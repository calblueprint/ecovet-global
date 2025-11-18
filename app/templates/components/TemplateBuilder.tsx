import { useState } from "react";
import { UUID } from "crypto";
import {
  createPhases,
  createPrompts,
  createRolePhases,
  createRoles,
  createTemplates,
} from "@/api/supabase/queries/templates";
import { localStore, Prompt, Role, Template } from "@/types/schema";
import RoleForm from "./RoleForm";
import TemplateOverviewForm from "./TemplateOverviewForm";

export default function TemplateBuilder({
  localStore,
  onFinish,
  update,
}: {
  localStore: localStore | null;
  onFinish: () => void;
  update: (updater: (draft: localStore) => void) => void;
}) {
  const [activeId, setActiveId] = useState<UUID | number>(1); // current 'tab' or role
  const [saving, setSaving] = useState(false); //nice 'saving' to let user know supabase push is still happening and when finished

  function createUUID(): UUID {
    //helper function to create new UUIDs
    return crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
  }

  function addRole(): void {
    if (localStore == null) return;
    const newRoleID = createUUID();

    update(draft => {
      draft.rolesById[newRoleID] = {
        role_id: newRoleID,
        role_name: "New Role",
        role_description: "New Role Description",
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
    if (localStore == null || typeof role_id == "number") return; //if role_id is '1', the current tab is Scenario Overivew and therefore should not be removed

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
    setActiveId(localStore.roleIds.at(-1)!);
  }

  function renameRole(role_id: UUID | number, newLabel: string) {
    if (localStore == null) return;

    update(draft => {
      (draft.rolesById[role_id] as Role).role_name = newLabel;
    });
  }

  function addPhase(): void {
    if (localStore == null) return;
    const newPhaseID = createUUID();

    update(draft => {
      draft.phasesById[newPhaseID] = {
        phase_id: newPhaseID,
        session_id: null,
        phase_name: String(draft.phaseIds.length),
        phase_description: null,
        is_finished: null,
      };
      draft.phaseIds.push(newPhaseID);

      for (const role of draft.roleIds) {
        if (typeof role === "number") {
          continue;
        }
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
    if (localStore?.phaseIds.length == 0 || localStore == null) {
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
            delete obj[removedPhaseID];
          }
          for (const prompt of draft.promptIndex[rolePhaseID]) {
            delete draft.promptById[prompt];
          }
          delete draft.promptIndex[rolePhaseID];
        }
      }
    });
  }

  function addPrompt(rolePhaseID: UUID): void {
    if (localStore == null) return;

    update(draft => {
      const newPromptID = createUUID();
      draft.promptById[newPromptID] = {
        prompt_id: newPromptID,
        user_id: null,
        role_phase_id: rolePhaseID,
        prompt_text: "New Prompt",
      };
      draft.promptIndex[rolePhaseID].push(newPromptID);
    });
  }

  function removePrompt(rolePhaseID: UUID, promptID: UUID): void {
    if (localStore == null) return;

    update(draft => {
      const i = draft.promptIndex[rolePhaseID].indexOf(promptID);
      if (i !== -1) draft.promptIndex[rolePhaseID].splice(i, 1);

      delete draft.promptById[promptID];
    });
  }

  function setActiveUpdate(id: UUID | number, field: string, next: string) {
    if (!localStore) return;

    update(draft => {
      if (typeof id === "number") {
        (draft.rolesById[id] as unknown as Record<string, unknown>)[field] =
          next;
      } else {
        if (field == "add_prompt") {
          addPrompt(id as UUID);
        } else if (field == "remove_prompt") {
          removePrompt(next as UUID, id as UUID);
        } else if (field == "role_description") {
          (draft.rolesById[id as UUID] as Role).role_description = next;
        } else if (field == "description") {
          draft.rolePhasesById[id as UUID].description = next;
        } else if (field == "prompt_text") {
          draft.promptById[id as UUID].prompt_text = next;
        } else if (field == "remove_phase") {
          removePhase(id);
        }
      }
    });
  }

  async function saveTemplate(): Promise<void> {
    setSaving(true);
    if (localStore == null) return;
    const realtemplateID = await createTemplates(
      localStore.templateID,
      "erm name tbd",
      null,
      (localStore.rolesById[1] as Template).objective,
      (localStore.rolesById[1] as Template).summary,
      (localStore.rolesById[1] as Template).setting,
      (localStore.rolesById[1] as Template).current_activity,
    );

    for (const roleID of localStore.roleIds) {
      if (!(typeof roleID == "number")) {
        await createRoles(
          roleID,
          realtemplateID,
          (localStore.rolesById[roleID] as Role).role_name,
          (localStore.rolesById[roleID] as Role).role_description,
        );
      }
    }

    for (const phaseID of localStore.phaseIds) {
      await createPhases(
        phaseID,
        localStore.phasesById[phaseID].session_id,
        localStore.phasesById[phaseID].phase_name,
        localStore.phasesById[phaseID].is_finished,
        localStore.phasesById[phaseID].phase_description,
      );
    }

    for (const [roleID, obj] of Object.entries(localStore.rolePhaseIndex) as [
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
          localStore.rolePhasesById[rolePhaseID].description,
        );
      }
    }

    for (const [promptID, prompt] of Object.entries(localStore.promptById) as [
      UUID,
      Prompt,
    ][]) {
      await createPrompts(
        promptID,
        null,
        prompt.role_phase_id,
        prompt.prompt_text,
      );
    }
    setSaving(false);
    onFinish();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {localStore?.roleIds.map(t => (
            <button
              key={String(t)}
              onClick={() => setActiveId(t)}
              style={{
                padding: "6px 10px",
                border: "1px solid #ccc",
                borderBottom:
                  activeId === t ? "2px solid transparent" : "1px solid #ccc",
                background: activeId === t ? "#fff" : "#f8f8f8",
                fontWeight: activeId === t ? 600 : 400,
              }}
            >
              {localStore.rolesById[t] && "role_name" in localStore.rolesById[t]
                ? localStore.rolesById[t].role_name
                : "Scenario Overview"}
            </button>
          ))}
          <button onClick={addRole}>+ New</button>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>Phases: {localStore?.phaseIds.length}</p>
          <button onClick={addPhase}>UP</button>
          <button onClick={() => removePhase()}>DOWN</button>
        </div>
      </div>

      {localStore?.roleIds.map(t =>
        t === activeId ? (
          <div
            key={`panel-${String(t)}`}
            style={{ border: "1px solid #ccc", padding: 12 }}
          >
            {activeId !== 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <input
                  value={(localStore.rolesById[t] as Role).role_name}
                  onChange={e => renameRole(t, e.target.value)}
                  style={{ padding: 6, border: "1px solid #ccc" }}
                />
                <button
                  onClick={() => removeRole(t)}
                  style={{ border: "1px solid #ccc", padding: 6 }}
                >
                  Remove
                </button>
              </div>
            )}
            {typeof activeId === "number" ? (
              <TemplateOverviewForm
                value={localStore.rolesById[activeId] as Template}
                onChange={setActiveUpdate}
              />
            ) : (
              <RoleForm
                value={{
                  role: localStore.rolesById[activeId] as Role,
                  rolePhases: localStore.rolePhasesById,
                  rolePhaseIndex: localStore.rolePhaseIndex[activeId],
                  promptById: localStore.promptById,
                  promptIndex: localStore.promptIndex,
                }}
                onChange={setActiveUpdate}
              />
            )}
          </div>
        ) : null,
      )}
      <button onClick={saveTemplate} disabled={saving}>
        {saving ? "Saving..." : "Submit Template"}
      </button>
    </div>
  );
}
