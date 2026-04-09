import type { UUID } from "@/types/schema";
import { useState } from "react";
import Link from "next/link";
import { addNewOption } from "@/actions/supabase/queries/prompt";
import {
  createPhases,
  createPrompts,
  createRolePhases,
  createRoles,
  createTemplates,
} from "@/actions/supabase/queries/templates";
import {
  LocalStore,
  Prompt,
  PromptType,
  Role,
  StagedOption,
  Template,
} from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { ActiveIds } from "../../page";
import QuestionBuilder from "../QuestionBuilder/QuestionBuilder";
import TemplateOverviewForm from "../TemplateOverviewForm/TemplateOverviewForm";
import { PanelCard, SubmitButton } from "./styles";

// TODO: add an active phase id
// TODO: add an active phase id
export default function TemplateBuilder({
  activeIds,
  setActiveIds,
  localStore,
  onFinish,
  update,
}: {
  activeIds: ActiveIds;
  setActiveIds: React.Dispatch<React.SetStateAction<ActiveIds>>;
  localStore: LocalStore | null;
  onFinish: () => void;
  update: (updater: (draft: LocalStore) => void) => void;
}) {
  const [saving, setSaving] = useState(false);
  const { profile } = useProfile();
  const TEMPLATE_INDEX = 1;

  function removeRole(role_id: UUID | number): void {
    if (localStore == null || typeof role_id == "number") return;

    let nextActive: UUID | number = 1;
    const idx = localStore.roleIds.indexOf(role_id);
    if (idx !== -1) {
      nextActive =
        localStore.roleIds[idx + 1] ?? localStore.roleIds[idx - 1] ?? 1;
    }
    update(draft => {
      delete draft.rolesById[role_id];
      const i = draft.roleIds.indexOf(role_id);
      draft.roleIds.splice(i, 1);
      const deletedRolePhases = draft.rolePhaseIndex[role_id];
      for (const [, rolePhaseID] of Object.entries(deletedRolePhases)) {
        delete draft.rolePhasesById[rolePhaseID];
        for (const prompt of draft.promptIndex[rolePhaseID]) {
          delete draft.promptById[prompt];
          delete draft.optionsByPromptId[prompt];
        }
        delete draft.promptIndex[rolePhaseID];
      }
      delete draft.rolePhaseIndex[role_id];
    });

    setActiveIds({ roleId: nextActive, rolePhaseId: null });
  }

  function removePhase(phase_id: UUID | null = null): void {
    if (localStore?.phaseIds.length == 0 || localStore == null) return;

    update(draft => {
      let removedPhaseID: UUID | undefined;

      if (phase_id) {
        const i = draft.phaseIds.indexOf(phase_id);
        [removedPhaseID] = draft.phaseIds.splice(i, 1);
      } else {
        removedPhaseID = draft.phaseIds.pop() as UUID;
      }
      if (removedPhaseID) {
        delete draft.phasesById[removedPhaseID];
        for (const [, obj] of Object.entries(draft.rolePhaseIndex)) {
          const rolePhaseID = obj[removedPhaseID];
          if (rolePhaseID) {
            delete draft.rolePhasesById[rolePhaseID];
            for (const prompt of draft.promptIndex[rolePhaseID]) {
              delete draft.promptById[prompt];
              delete draft.optionsByPromptId[prompt];
            }
            delete draft.promptIndex[rolePhaseID];
          }
          delete obj[removedPhaseID];
        }
      }

      draft.phaseIds.forEach((pid, index) => {
        draft.phasesById[pid].phase_name = `Phase ${index + 1}`;
        draft.phasesById[pid].phase_number = index + 1;
      });
    });
  }

  function addPrompt(rolePhaseID: UUID): void {
    if (localStore == null) return;

    update(draft => {
      const newPromptID = crypto.randomUUID();
      draft.promptById[newPromptID] = {
        prompt_id: newPromptID,
        role_phase_id: rolePhaseID,
        prompt_text: "",
        prompt_follow_ups: "",
        prompt_type: "text",
      };
      draft.promptIndex[rolePhaseID].push(newPromptID);
      draft.optionsByPromptId[newPromptID] = []; // initialize empty options
    });
  }

  function removePrompt(rolePhaseID: UUID, promptID: UUID): void {
    if (localStore == null) return;

    update(draft => {
      const i = draft.promptIndex[rolePhaseID].indexOf(promptID);
      if (i !== -1) draft.promptIndex[rolePhaseID].splice(i, 1);

      delete draft.promptById[promptID];
      delete draft.optionsByPromptId[promptID];
    });
  }

  function setActiveUpdate(
    id: UUID | number,
    field: string,
    next: string | PromptType | StagedOption[],
  ) {
    if (!localStore) return;

    if (typeof id === "number") {
      update(draft => {
        (draft.rolesById[id] as unknown as Record<string, unknown>)[field] =
          next;
      });
    } else {
      if (field === "add_prompt") {
        addPrompt(id as UUID);
      } else if (field === "remove_prompt") {
        removePrompt(next as UUID, id as UUID);
      } else if (field === "role_description") {
        update(draft => {
          (draft.rolesById[id as UUID] as Role).role_description =
            next as string;
        });
      } else if (field === "description") {
        update(draft => {
          draft.rolePhasesById[id as UUID].role_phase_description =
            next as string;
        });
      } else if (field === "prompt_text") {
        update(draft => {
          draft.promptById[id as UUID].prompt_text = next as string;
        });
      } else if (field === "prompt_type") {
        update(draft => {
          draft.promptById[id as UUID].prompt_type = next as PromptType;
          draft.optionsByPromptId[id as UUID] = []; // clear options on type change
        });
      } else if (field === "options") {
        update(draft => {
          draft.optionsByPromptId[id as UUID] = next as StagedOption[];
        });
      } else if (field === "remove_phase") {
        removePhase(id);
      }
    }
  }

  async function saveTemplate(): Promise<void> {
    setSaving(true);

    if (localStore == null) return;
    const saveStore: LocalStore = structuredClone(localStore);

    const realtemplateID = await createTemplates(
      saveStore.templateID,
      (saveStore.rolesById[1] as Template).template_name,
      null,
      (saveStore.rolesById[1] as Template).objective,
      (saveStore.rolesById[1] as Template).summary,
      (saveStore.rolesById[1] as Template).setting,
      (saveStore.rolesById[1] as Template).current_activity,
      profile?.user_group_id,
    );

    for (const roleID of saveStore.roleIds) {
      if (!(typeof roleID == "number")) {
        await createRoles(
          roleID,
          realtemplateID,
          (saveStore.rolesById[roleID] as Role).role_name,
          (saveStore.rolesById[roleID] as Role).role_description,
        );
      }
    }

    for (const phaseID of saveStore.phaseIds) {
      await createPhases(
        phaseID,
        saveStore.phasesById[phaseID].template_id,
        saveStore.phasesById[phaseID].phase_name,
        saveStore.phasesById[phaseID].phase_description,
        saveStore.phasesById[phaseID].phase_number,
      );
    }

    for (const [roleID, obj] of Object.entries(saveStore.rolePhaseIndex) as [
      UUID,
      Record<UUID, UUID>,
    ][]) {
      for (const [phaseID, rolePhaseID] of Object.entries(obj) as [
        UUID,
        UUID,
      ][]) {
        console.log(
          "saving rolePhase description:",

          saveStore.rolePhasesById[rolePhaseID].role_phase_description,
        );
        try {
          await createRolePhases(
            rolePhaseID,
            phaseID,
            roleID,
            saveStore.rolePhasesById[rolePhaseID].role_phase_description,
          );
        } catch (err) {
          console.error("createRolePhases error:", err);
        }
      }
    }

    for (const [promptID, prompt] of Object.entries(saveStore.promptById) as [
      UUID,
      Prompt,
    ][]) {
      await createPrompts(
        promptID,
        prompt.role_phase_id ?? "",
        prompt.prompt_follow_ups,
        prompt.prompt_text,
        prompt.prompt_follow_ups,
        prompt.prompt_type,
      );

      // Save options for mutlichoice prompts
      const options = saveStore.optionsByPromptId[promptID] ?? [];
      for (const opt of options) {
        await addNewOption(promptID, opt.option_text ?? "");
      }
    }

    setSaving(false);
    onFinish();
  }

  const rolePhases = Object.entries(
    localStore?.rolePhaseIndex[activeIds.roleId as UUID] || {},
  ).map(([_, rolePhaseID]) => rolePhaseID);

  return (
    <div>
      <div>
        {localStore && (
          <PanelCard key={`panel-${String(activeIds.roleId)}`}>
            {activeIds.roleId == TEMPLATE_INDEX || rolePhases.length == 0 ? (
              <TemplateOverviewForm
                value={localStore.rolesById[TEMPLATE_INDEX] as Template}
                onChange={setActiveUpdate}
              />
            ) : (
              <QuestionBuilder
                value={{
                  role: localStore.rolesById[activeIds.roleId] as Role,
                  rolePhases: localStore.rolePhasesById,
                  rolePhaseIndex:
                    localStore.rolePhaseIndex[activeIds.roleId as UUID],
                  promptById: localStore.promptById,
                  promptIndex: localStore.promptIndex,
                  phasesById: localStore.phasesById,
                  optionsByPromptId: localStore.optionsByPromptId, // NEW
                }}
                rolePhaseId={activeIds.rolePhaseId || rolePhases[0]}
                phase={
                  localStore.phasesById[
                    localStore.rolePhasesById[
                      activeIds.rolePhaseId || rolePhases[0]
                    ].phase_id
                  ]
                }
                onChange={setActiveUpdate}
              />
            )}
          </PanelCard>
        )}
      </div>

      <Link href="/facilitator/template-list">
        <SubmitButton onClick={saveTemplate}>
          {saving ? "Saving..." : "Submit Template"}
        </SubmitButton>
      </Link>
    </div>
  );
}
