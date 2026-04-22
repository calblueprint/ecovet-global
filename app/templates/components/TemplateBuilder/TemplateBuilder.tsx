import type { EditablePhase, RolePhase, UUID } from "@/types/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addNewOption } from "@/actions/supabase/queries/prompt";
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
import { PanelCard } from "./styles";

export default function TemplateBuilder({
  activeIds,
  setActiveIds,
  localStore,
  onFinish,
  update,
  saveTemplate,
  setSelectedPhaseId,
}: {
  activeIds: ActiveIds;
  setActiveIds: React.Dispatch<React.SetStateAction<ActiveIds>>;
  localStore: LocalStore | null;
  onFinish: () => void;
  update: (updater: (draft: LocalStore) => void) => void;
  saveTemplate: () => Promise<void>;
  setSelectedPhaseId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const router = useRouter();
  const TEMPLATE_INDEX = 1;

  const phases = localStore
    ? localStore.phaseIds.map(id => localStore.phasesById[id])
    : [];
  const roles = localStore
    ? localStore.roleIds
        .filter(id => id !== 1)
        .map(id => localStore.rolesById[id] as Role)
    : [];

  function insertPromptAt(rolePhaseId: UUID, index: number): void {
    if (localStore == null) return;

    update(draft => {
      const newPromptID = crypto.randomUUID() as UUID;
      draft.promptById[newPromptID] = {
        prompt_id: newPromptID,
        role_phase_id: rolePhaseId,
        prompt_text: "",
        prompt_number: index + 1,
        prompt_follow_ups: "",
        prompt_type: "text",
      };
      if (!draft.promptIndex[rolePhaseId]) {
        draft.promptIndex[rolePhaseId] = [];
      }
      draft.promptIndex[rolePhaseId].splice(index, 0, newPromptID);
      draft.optionsByPromptId[newPromptID] = [];
    });
  }

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
        draft.phasesById[pid].phase_number = index + 1;
      });
    });
  }

  function addPhase(): void {
    if (!localStore) return;

    update(draft => {
      const newPhaseId = crypto.randomUUID();
      const nextNumber = draft.phaseIds.length + 1;

      draft.phaseIds.push(newPhaseId);
      draft.phasesById[newPhaseId] = {
        phase_id: newPhaseId,
        template_id: draft.templateID,
        phase_name: `Phase ${nextNumber}`,
        phase_description: "",
        phase_number: nextNumber,
      } as EditablePhase;

      draft.roleIds.forEach(roleId => {
        if (roleId === 1) return;

        const newRolePhaseId = crypto.randomUUID();
        draft.rolePhasesById[newRolePhaseId] = {
          role_phase_id: newRolePhaseId,
          role_id: roleId as UUID,
          phase_id: newPhaseId,
          role_phase_description: "",
        } as RolePhase;

        if (!draft.rolePhaseIndex[roleId]) draft.rolePhaseIndex[roleId] = {};
        draft.rolePhaseIndex[roleId][newPhaseId] = newRolePhaseId;
        draft.promptIndex[newRolePhaseId] = [];
      });
    });
  }

  function addRole(): void {
    if (!localStore) return;

    update(draft => {
      const newRoleId = crypto.randomUUID();
      const nextNumber = draft.roleIds.length;

      draft.roleIds.push(newRoleId);
      draft.rolesById[newRoleId] = {
        role_id: newRoleId,
        template_id: draft.templateID,
        role_name: `Role ${nextNumber}`,
        role_description: "",
      } as Role;

      draft.rolePhaseIndex[newRoleId] = {};

      draft.phaseIds.forEach(phaseId => {
        const newRolePhaseId = crypto.randomUUID();
        draft.rolePhasesById[newRolePhaseId] = {
          role_phase_id: newRolePhaseId,
          role_id: newRoleId,
          phase_id: phaseId,
          role_phase_description: "",
        } as RolePhase;

        draft.rolePhaseIndex[newRoleId][phaseId] = newRolePhaseId;
        draft.promptIndex[newRolePhaseId] = [];
      });
    });
  }

  function renamePhase(phase_id: UUID, name: string): void {
    if (!localStore) return;
    update(draft => {
      draft.phasesById[phase_id].phase_name = name;
    });
  }

  function renameRole(role_id: UUID, name: string): void {
    if (!localStore) return;
    update(draft => {
      (draft.rolesById[role_id] as Role).role_name = name;
    });
  }

  function updatePhaseDescription(phase_id: UUID, description: string): void {
    if (!localStore) return;
    update(draft => {
      draft.phasesById[phase_id].phase_description = description;
    });
  }

  function updateRoleDescription(role_id: UUID, description: string): void {
    if (!localStore) return;
    update(draft => {
      (draft.rolesById[role_id] as Role).role_description = description;
    });
  }

  // Append at end — just delegates to insertPromptAt
  function addPrompt(rolePhaseID: UUID): void {
    if (localStore == null) return;
    const currentLength = localStore.promptIndex[rolePhaseID]?.length ?? 0;
    insertPromptAt(rolePhaseID, currentLength);
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
    next: string | PromptType | StagedOption[] | number,
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
      } else if (field === "insert_prompt_at") {
        // `next` is the index to insert at
        insertPromptAt(id as UUID, next as number);
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
      } else if (field === "prompt_follow_ups") {
        update(draft => {
          draft.promptById[id as UUID].prompt_follow_ups = next as string;
        });
      } else if (field === "prompt_type") {
        update(draft => {
          draft.promptById[id as UUID].prompt_type = next as PromptType;
          draft.optionsByPromptId[id as UUID] = [];
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

  const rolePhases = Object.entries(
    localStore?.rolePhaseIndex[activeIds.roleId as UUID] || {},
  ).map(([_, rolePhaseID]) => rolePhaseID);

  const handleNextPhase = () => {
    if (!localStore || !activeIds.rolePhaseId) return;

    const currentPhaseId =
      localStore.rolePhasesById[activeIds.rolePhaseId].phase_id;
    const currentPhaseIndex = localStore.phaseIds.indexOf(currentPhaseId);

    if (
      currentPhaseIndex !== -1 &&
      currentPhaseIndex < localStore.phaseIds.length - 1
    ) {
      const nextPhaseId = localStore.phaseIds[currentPhaseIndex + 1];
      const nextRolePhaseId =
        localStore.rolePhaseIndex[activeIds.roleId as UUID][nextPhaseId];

      setActiveIds({ roleId: activeIds.roleId, rolePhaseId: nextRolePhaseId });
      setSelectedPhaseId(nextPhaseId);
    } else {
      alert("This is the last phase for this role.");
    }
  };

  async function handleSaveAndExit() {
    await saveTemplate();
    router.push("/facilitator/template-list");
  }

  return (
    <div>
      <div>
        {localStore && (
          <PanelCard key={`panel-${String(activeIds.roleId)}`}>
            {activeIds.roleId == TEMPLATE_INDEX || rolePhases.length == 0 ? (
              <TemplateOverviewForm
                value={localStore.rolesById[TEMPLATE_INDEX] as Template}
                phases={phases}
                roles={roles}
                onChange={setActiveUpdate}
                onAddPhase={addPhase}
                onAddRole={addRole}
                onRenamePhase={renamePhase}
                onRenameRole={renameRole}
                onRemovePhase={removePhase}
                onRemoveRole={removeRole}
                onUpdatePhaseDescription={updatePhaseDescription}
                onUpdateRoleDescription={updateRoleDescription}
                onSaveAndExit={handleSaveAndExit}
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
                  optionsByPromptId: localStore.optionsByPromptId,
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
                onNextPhase={handleNextPhase}
                onSaveAndExit={handleSaveAndExit}
              />
            )}
          </PanelCard>
        )}
      </div>
    </div>
  );
}
