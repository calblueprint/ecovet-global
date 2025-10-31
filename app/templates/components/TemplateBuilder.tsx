import { useState } from "react";
import { UUID } from "crypto";
import TemplateOverviewForm from "./TemplateOverviewForm";
import RoleForm from "./RoleForm";
import { localStore, Prompt, Role, Template } from "@/types/schema";
import { createPhases, createPrompts, createRolePhases, createRoles, createTemplates } from "@/api/supabase/queries/templates";

export default function TemplateBuilder({localStore} : {localStore: localStore|null} ) {
  const [activeId, setActiveId] = useState<UUID|number>(1);
  const [phaseCount, setPhaseCount] = useState<number>(0);
  const [, setTick] = useState(0);

  function useForceUpdate() {
    setTick((tick) => (tick + 1) % 10);
  }

  function addRole(): void {
    if (localStore == null) return;
    const newRoleID = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
    localStore.rolesById[newRoleID] = { role_id: newRoleID, role_name: "New Role", role_description: "New Role Description", template_id: localStore.templateID };
    localStore.roleIds.push(newRoleID);
    localStore.rolePhaseIndex[newRoleID] = {};
    for (const phaseID of localStore.phaseIds) {
        const newRolePhaseID = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
        localStore.rolePhaseIndex[newRoleID][phaseID] = newRolePhaseID;
        localStore.rolePhasesById[newRolePhaseID] = { role_phase_id: newRolePhaseID, phase_id: phaseID, role_id: newRoleID, description: null };

        localStore.promptIndex[newRolePhaseID] = [];
    }
    
    setActiveId(newRoleID);
  }

  function removeRole(role_id: UUID | number): void {
    if (localStore == null || typeof role_id == "number") return;

    delete localStore.rolesById[role_id];
    const i = localStore.roleIds.indexOf(role_id);
    localStore.roleIds.splice(i, 1);
    const deletedRolePhases = localStore.rolePhaseIndex[role_id];
    for (const [, rolePhaseID] of Object.entries(deletedRolePhases)) {
        delete localStore.rolePhasesById[rolePhaseID];
        for (const prompt of localStore.promptIndex[rolePhaseID]) {
            delete localStore.promptById[prompt];
        }
        delete localStore.promptIndex[rolePhaseID];
    }
    delete localStore.rolePhaseIndex[role_id];

    setActiveId(localStore.roleIds.at(-1)!);
  }

  function renameRole(role_id: UUID | number, newLabel: string) {
    if (localStore == null) return;

    (localStore.rolesById[role_id] as Role).role_name = newLabel;
    useForceUpdate();
  }

  function addPhase(): void {
    if (localStore == null) return;
    setPhaseCount(prev => prev + 1)

    const newPhaseID = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
    localStore.phasesById[newPhaseID] = { phase_id: newPhaseID, session_id: null, phase_name: String(phaseCount), phase_description: null, is_finished: null };
    localStore.phaseIds.push(newPhaseID);
    
    for (const role of localStore.roleIds) {
        if (typeof role === "number") {
            continue;
        }
        const newRolePhaseID = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
        localStore.rolePhasesById[newRolePhaseID] = { role_phase_id: newRolePhaseID, phase_id: newPhaseID, role_id: role, description: null };
        localStore.rolePhaseIndex[role][newPhaseID] = newRolePhaseID;
        localStore.promptIndex[newRolePhaseID] = [];
    }
  }

  function removePhase(): void {
    if (phaseCount == 0  || localStore == null) {
        return
    }
    setPhaseCount(prev => prev - 1);

    const removedPhaseID = localStore.phaseIds.pop() as UUID;
    delete localStore.phasesById[removedPhaseID];

    for (const [roleID, obj] of Object.entries(localStore.rolePhaseIndex)) {
        const rolePhaseID = obj[removedPhaseID];
        if (rolePhaseID) {
            delete localStore.rolePhasesById[rolePhaseID];
            delete obj[removedPhaseID];
        }
        for (const prompt of localStore.promptIndex[rolePhaseID]) {
            delete localStore.promptById[prompt];
        }
        delete localStore.promptIndex[rolePhaseID];
    }
  }

  function addPrompt(rolePhaseID: UUID): void {
    if (localStore == null) return;

    const newPromptID = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
    localStore.promptById[newPromptID] = { prompt_id: newPromptID, user_id: null, role_phase_id: rolePhaseID, prompt_text: "New Prompt" };
    localStore.promptIndex[rolePhaseID].push(newPromptID);
  }

  function removePrompt(rolePhaseID: UUID, promptID: UUID): void {
    if (localStore == null) return;

    const i = localStore.promptIndex[rolePhaseID].indexOf(promptID);
    if (i  !== -1) localStore.promptIndex[rolePhaseID].splice(i, 1);

    delete localStore.promptById[promptID];
    useForceUpdate();
  }

  function setActiveUpdate(field: string, next: string) {
    if (!localStore) return;

    if (typeof activeId === "number") {
        const key = field as keyof Template;
        (localStore.rolesById[activeId] as unknown as Record<string, unknown>)[field] = next; // sets the field of template equal to next
    
    } else {
        if (field == 'add_prompt') {
            addPrompt((next as UUID));
        } else if (field == 'remove_prompt') {
            for (const [rolePhaseID, promptIDs] of Object.entries(localStore.promptIndex)) {
                if (promptIDs.includes(next as UUID)) {
                    removePrompt(rolePhaseID as UUID, next as UUID);
                    break;
                }
            }  
        } else if (field == 'role_description') {
            (localStore.rolesById[activeId] as Role).role_description = next;
        }
        else{
            localStore.promptById[(field as UUID)].prompt_text = next;
        }
    }
    useForceUpdate();
  }

  async function saveTemplate(): Promise<void> {
    if (localStore == null) return;
    const realtemplateID = await createTemplates(
        localStore.templateID,
        'erm name tbd', 
        null, 
        (localStore.rolesById[1] as Template).objective, 
        (localStore.rolesById[1] as Template).summary, 
        (localStore.rolesById[1] as Template).setting, 
        (localStore.rolesById[1] as Template).current_activity
    );

    for (let roleID of localStore.roleIds) {
        if (!(typeof roleID == "number")) {
            await createRoles(
                roleID,
                realtemplateID, 
                (localStore.rolesById[roleID] as Role).role_name, 
                (localStore.rolesById[roleID] as Role).role_description,
            );            
        }
    }

    for (let phaseID of localStore.phaseIds) {
        await createPhases(
            phaseID,
            localStore.phasesById[phaseID].session_id,
            localStore.phasesById[phaseID].phase_name,
            localStore.phasesById[phaseID].is_finished,
            localStore.phasesById[phaseID].phase_description,
        )
    }

    for (let [roleID, obj] of Object.entries(localStore.rolePhaseIndex) as [UUID, Record<UUID, UUID>][]) {
        for (let [phaseID, rolePhaseID] of Object.entries(obj) as [UUID, UUID][]) {
            await createRolePhases(
                rolePhaseID,
                phaseID,
                roleID,
                localStore.rolePhasesById[rolePhaseID].description,
            )
        }
    }

    for (let [promptID, prompt] of Object.entries(localStore.promptById) as [UUID, Prompt][]) {
        await createPrompts(
            null,
            prompt.role_phase_id,
            prompt.prompt_text,
        )
    }
  }

  return (
    <div>
        <div style={{ display: "flex", justifyContent: "space-between"}}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {localStore?.roleIds.map((t) => (
                <button
                    key={String(t)}
                    onClick={() => setActiveId(t)}
                    style={{
                    padding: "6px 10px",
                    border: "1px solid #ccc",
                    borderBottom: activeId === t ? "2px solid transparent" : "1px solid #ccc",
                    background: activeId === t ? "#fff" : "#f8f8f8",
                    fontWeight: activeId === t ? 600 : 400,
                    }}
                >
                    { localStore.rolesById[t] && 'role_name' in localStore.rolesById[t]
                        ? localStore.rolesById[t].role_name
                        : "Scenario Overview"
                    }
                </button>
                ))}
                <button onClick={addRole}>+ New</button>
            </div>
            <div style={{ display: "flex", alignItems: 'center' }}>
                <p>Phases: {phaseCount}</p>
                <button onClick={addPhase}>UP</button>
                <button onClick={removePhase}>DOWN</button>
            </div>
        </div>

        {localStore?.roleIds.map((t) =>
            t === activeId ? (
            <div key={`panel-${String(t)}`} style={{ border: "1px solid #ccc", padding: 12 }}>
                {activeId !== 1 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <input
                            value={(localStore.rolesById[t] as Role).role_name}
                            onChange={(e) => renameRole(t, e.target.value)}
                            style={{ padding: 6, border: "1px solid #ccc" }}
                        />
                        <button onClick={() => removeRole(t)} style={{ border: "1px solid #ccc", padding: 6 }}>
                            Remove
                        </button>
                    </div>
                )}
                {typeof activeId === "number" ? (
                <TemplateOverviewForm
                    value={(localStore.rolesById[activeId] as Template)}
                    onChange={setActiveUpdate}
                />
                ) : (
                <RoleForm
                    value={{
                        role: (localStore.rolesById[activeId] as Role), 
                        rolePhases: localStore.rolePhasesById, 
                        rolePhaseIndex: localStore.rolePhaseIndex[activeId],
                        promptById: localStore.promptById,
                        promptIndex: localStore.promptIndex,
                    }}
                    onChange={setActiveUpdate}
                />
                )}
            </div>
            ) : null
        )}
        <button onClick={saveTemplate}>Submit Template</button>
    </div>
  );
}