import type { UUID } from "@/types/schema";
import { useState } from "react";
import Link from "next/link";
import {
  createPhases,
  createPrompts,
  createRolePhases,
  createRoles,
  createTemplates,
} from "@/actions/supabase/queries/templates";
import { LocalStore, Prompt, Role, Template } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import RoleForm from "./RoleForm";
import {
  NewTabButton,
  PanelCard,
  PhasesControl,
  PhasesCount,
  PhasesLabel,
  PhasesStepper,
  StepButton,
  SubmitButton,
  TabButton,
  TabsHeader,
  TabsLeft,
  TabsRight,
} from "./styles";
import TemplateOverviewForm from "./TemplateOverviewForm";

export default function TemplateBuilder({
  LocalStore,
  onFinish,
  update,
}: {
  LocalStore: LocalStore | null;
  onFinish: () => void;
  update: (updater: (draft: LocalStore) => void) => void;
}) {
  const [activeId, setActiveId] = useState<UUID | number>(1); // current 'tab' or role
  const [saving, setSaving] = useState(false); //nice 'saving' to let user know supabase push is still happening and when finished
  const { profile } = useProfile();

  function createUUID(): UUID {
    //helper function to create new UUIDs
    return crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
  }

  function addRole(): void {
    if (LocalStore == null) return;
    const newRoleID = createUUID();

    update(draft => {
      draft.rolesById[newRoleID] = {
        role_id: newRoleID,
        role_name: "New Role",
        role_description: "",
        template_id: draft.templateID,
      };
      draft.roleIds.push(newRoleID);
      draft.rolePhaseIndex[newRoleID] = {}; //initialize rolePhaseIndex dict for this role
      for (const phaseID of draft.phaseIds) {
        //when creating roles when phases already exist, automatically add rolePhases for role
        const newRolePhaseID = createUUID();
        draft.rolePhaseIndex[newRoleID][phaseID] = newRolePhaseID;
        draft.rolePhasesById[newRolePhaseID] = {
          role_phase_id: newRolePhaseID,
          phase_id: phaseID,
          role_id: newRoleID,
          description: null,
        };
        draft.promptIndex[newRolePhaseID] = []; //similiar to rolePhaseIndex dict but for prompts
      }
    });
    setActiveId(newRoleID);
  }

  function removeRole(role_id: UUID | number): void {
    if (LocalStore == null || typeof role_id == "number") return; //if role_id is '1', the current tab is Scenario Overivew and therefore should not be removed

    let nextActive: UUID | number = 1;
    const idx = LocalStore.roleIds.indexOf(role_id);
    if (idx !== -1) {
      nextActive =
        LocalStore.roleIds[idx + 1] ?? LocalStore.roleIds[idx - 1] ?? 1;
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
        }
        delete draft.promptIndex[rolePhaseID];
      }
      delete draft.rolePhaseIndex[role_id];
    });
    setActiveId(nextActive);
  }

  function renameRole(role_id: UUID | number, newLabel: string) {
    if (LocalStore == null) return;

    update(draft => {
      if (typeof role_id === "number") {
        (draft.rolesById[role_id] as Template).template_name = newLabel;
      } else {
        (draft.rolesById[role_id] as Role).role_name = newLabel;
      }
    });
  }

  function addPhase(): void {
    if (!LocalStore) return;
    const newPhaseID = createUUID();

    update(draft => {
      const phaseNumber = draft.phaseIds.length + 1;
      draft.phasesById[newPhaseID] = {
        phase_id: newPhaseID,
        template_id: draft.templateID,
        phase_name: `Phase ${phaseNumber}`,
        phase_number: phaseNumber,
        phase_description: null,
        is_finished: null,
      };
      draft.phaseIds.push(newPhaseID);

      for (const role of draft.roleIds) {
        if (typeof role === "number") continue;
        const newRolePhaseID = createUUID();
        draft.rolePhasesById[newRolePhaseID] = {
          role_phase_id: newRolePhaseID,
          phase_id: newPhaseID,
          role_id: role,
          description: null,
        };
        draft.rolePhaseIndex[role][newPhaseID] = newRolePhaseID;
        draft.promptIndex[newRolePhaseID] = [];
      }
    });
  }

  function removePhase(phase_id: UUID | null = null): void {
    if (LocalStore?.phaseIds.length == 0 || LocalStore == null) {
      return;
    }

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
    if (LocalStore == null) return;

    update(draft => {
      const newPromptID = createUUID();
      draft.promptById[newPromptID] = {
        prompt_id: newPromptID,
        user_id: null,
        role_phase_id: rolePhaseID,
        prompt_text: "",
        prompt_type: "text",
      };
      draft.promptIndex[rolePhaseID].push(newPromptID);
    });
  }

  function removePrompt(rolePhaseID: UUID, promptID: UUID): void {
    if (LocalStore == null) return;

    update(draft => {
      const i = draft.promptIndex[rolePhaseID].indexOf(promptID);
      if (i !== -1) draft.promptIndex[rolePhaseID].splice(i, 1);

      delete draft.promptById[promptID];
    });
  }

  function setActiveUpdate(id: UUID | number, field: string, next: string) {
    if (!LocalStore) return;

    if (typeof id === "number") {
      update(draft => {
        (draft.rolesById[id] as unknown as Record<string, unknown>)[field] =
          next;
      });
    } else {
      if (field == "add_prompt") {
        addPrompt(id as UUID);
      } else if (field == "remove_prompt") {
        removePrompt(next as UUID, id as UUID);
      } else if (field == "role_description") {
        update(draft => {
          (draft.rolesById[id as UUID] as Role).role_description = next;
        });
      } else if (field == "description") {
        update(draft => {
          draft.rolePhasesById[id as UUID].description = next;
        });
      } else if (field == "prompt_text") {
        update(draft => {
          draft.promptById[id as UUID].prompt_text = next;
        });
      } else if (field == "remove_phase") {
        removePhase(id);
      }
    }
  }

  async function saveTemplate(): Promise<void> {
    setSaving(true);

    if (LocalStore == null) return;
    const saveStore: LocalStore = structuredClone(LocalStore);

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
        saveStore.phasesById[phaseID].is_finished,
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
        await createRolePhases(
          rolePhaseID,
          phaseID,
          roleID,
          saveStore.rolePhasesById[rolePhaseID].description,
        );
      }
    }

    for (const [promptID, prompt] of Object.entries(saveStore.promptById) as [
      UUID,
      Prompt,
    ][]) {
      await createPrompts(
        promptID,
        null,
        prompt.role_phase_id ?? "",
        prompt.prompt_text,
      );
    }
    setSaving(false);
    onFinish();
  }

  return (
    <div>
      <TabsHeader>
        <TabsLeft>
          {LocalStore?.roleIds.map(t => {
            const roleOrTemplate = LocalStore.rolesById[t];
            const isTemplate = typeof t === "number";

            return (
              <TabButton
                key={String(t)}
                $active={activeId === t}
                onClick={() => setActiveId(t)}
              >
                {isTemplate ? (
                  "Scenario Overview"
                ) : (
                  <>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="outline-none"
                      onBlur={e => {
                        const value =
                          e.currentTarget.textContent?.trim() || "New Role";
                        update(draft => {
                          (draft.rolesById[t] as Role).role_name = value;
                        });
                      }}
                    >
                      {(roleOrTemplate as Role).role_name}
                    </span>
                    <span
                      role="button"
                      style={{
                        marginLeft: 10,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => removeRole(t)}
                    >
                      ×
                    </span>
                  </>
                )}
              </TabButton>
            );
          })}

          <NewTabButton onClick={addRole}>+</NewTabButton>
        </TabsLeft>

        <TabsRight>
          <PhasesControl
            role="group"
            aria-label="Phases control"
            onKeyDown={e => {
              if (e.key === "ArrowUp") addPhase();
              if (e.key === "ArrowDown") removePhase();
            }}
          >
            <PhasesLabel>Phases:</PhasesLabel>
            <PhasesCount>{LocalStore?.phaseIds.length ?? 0}</PhasesCount>
            <PhasesStepper>
              <StepButton aria-label="Increase phases" onClick={addPhase}>
                ▲
              </StepButton>
              <StepButton
                aria-label="Decrease phases"
                onClick={() => removePhase()}
                disabled={(LocalStore?.phaseIds.length ?? 0) === 0}
              >
                ▼
              </StepButton>
            </PhasesStepper>
          </PhasesControl>
          <Link href="/facilitator/template-list">
            <SubmitButton onClick={saveTemplate}>
              {saving ? "Saving..." : "Submit Template"}
            </SubmitButton>
          </Link>
        </TabsRight>
      </TabsHeader>

      <div>
        {LocalStore?.roleIds.map(t =>
          t === activeId ? (
            <PanelCard key={`panel-${String(t)}`}>
              {typeof activeId === "number" ? (
                <TemplateOverviewForm
                  value={LocalStore.rolesById[activeId] as Template}
                  onChange={setActiveUpdate}
                />
              ) : (
                <RoleForm
                  value={{
                    role: LocalStore.rolesById[activeId] as Role,
                    rolePhases: LocalStore.rolePhasesById,
                    rolePhaseIndex: LocalStore.rolePhaseIndex[activeId],
                    promptById: LocalStore.promptById,
                    promptIndex: LocalStore.promptIndex,
                    phasesById: LocalStore.phasesById,
                  }}
                  onChange={setActiveUpdate}
                />
              )}
            </PanelCard>
          ) : null,
        )}
      </div>
    </div>
  );
}
