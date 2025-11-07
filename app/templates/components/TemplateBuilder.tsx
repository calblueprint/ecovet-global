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
import {
  GhostButton,
  NameInput,
  NewTabButton,
  PanelCard,
  PanelHeaderRow,
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
  localStore,
  onFinish,
  update,
}: {
  localStore: localStore | null;
  onFinish: () => void;
  update: () => void;
}) {
  const [activeId, setActiveId] = useState<UUID | number>(1); // current 'tab' or role
  const [, setTick] = useState(0); //some boofed way to force a rerender by calling a random usestate lmao
  const [saving, setSaving] = useState(false); //nice 'saving' to let user know supabase push is still happening and when finished

  function useForceUpdate(): void {
    // call whenever my screen isn't updating :)
    setTick(tick => (tick + 1) % 10);
  }

  function createUUID(): UUID {
    //helper function to create new UUIDs
    return crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
  }

  function addRole(): void {
    if (localStore == null) return;
    const newRoleID = createUUID();
    localStore.rolesById[newRoleID] = {
      role_id: newRoleID,
      role_name: "New Role",
      role_description: "New Role Description",
      template_id: localStore.templateID,
    };
    localStore.roleIds.push(newRoleID);
    localStore.rolePhaseIndex[newRoleID] = {}; //initialize rolePhaseIndex dict for this role
    for (const phaseID of localStore.phaseIds) {
      //when creating roles when phases already exist, automatically add rolePhases for role
      const newRolePhaseID = createUUID();
      localStore.rolePhaseIndex[newRoleID][phaseID] = newRolePhaseID;
      localStore.rolePhasesById[newRolePhaseID] = {
        role_phase_id: newRolePhaseID,
        phase_id: phaseID,
        role_id: newRoleID,
        description: null,
      };
      localStore.promptIndex[newRolePhaseID] = []; //similiar to rolePhaseIndex dict but for prompts
    }

    setActiveId(newRoleID);
  }

  function removeRole(role_id: UUID | number): void {
    if (localStore == null || typeof role_id == "number") return; //if role_id is '1', the current tab is Scenario Overivew and therefore should not be removed

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

    setActiveId(localStore.roleIds.at(-1)!); //go to the last tab
  }

  function renameRole(role_id: UUID | number, newLabel: string) {
    if (localStore == null) return;

    if (typeof role_id === "number") {
      (localStore.rolesById[role_id] as Template).template_name = newLabel;
      update();
    } else {
      (localStore.rolesById[role_id] as Role).role_name = newLabel;
    }
    useForceUpdate();
  }

  function addPhase(): void {
    if (localStore == null) return;
    const newPhaseID = createUUID();
    localStore.phasesById[newPhaseID] = {
      phase_id: newPhaseID,
      session_id: null,
      phase_name: String(localStore.phaseIds.length),
      phase_description: null,
      is_finished: null,
    };
    localStore.phaseIds.push(newPhaseID);

    for (const role of localStore.roleIds) {
      if (typeof role === "number") {
        continue;
      }
      const newRolePhaseID = createUUID();
      localStore.rolePhasesById[newRolePhaseID] = {
        role_phase_id: newRolePhaseID,
        phase_id: newPhaseID,
        role_id: role,
        description: null,
      };
      localStore.rolePhaseIndex[role][newPhaseID] = newRolePhaseID;
      localStore.promptIndex[newRolePhaseID] = [];
    }
    useForceUpdate();
  }

  function removePhase(phase_id: UUID | null = null): void {
    if (localStore?.phaseIds.length == 0 || localStore == null) {
      return;
    }

    let removedPhaseID: UUID | undefined;

    if (phase_id) {
      const i = localStore.phaseIds.indexOf(phase_id);
      [removedPhaseID] = localStore.phaseIds.splice(i, 1);
    } else {
      removedPhaseID = localStore.phaseIds.pop() as UUID;
    }
    if (removedPhaseID) {
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
    useForceUpdate();
  }

  function addPrompt(rolePhaseID: UUID): void {
    if (localStore == null) return;

    const newPromptID = createUUID();
    localStore.promptById[newPromptID] = {
      prompt_id: newPromptID,
      user_id: null,
      role_phase_id: rolePhaseID,
      prompt_text: "New Prompt",
    };
    localStore.promptIndex[rolePhaseID].push(newPromptID);
  }

  function removePrompt(rolePhaseID: UUID, promptID: UUID): void {
    if (localStore == null) return;

    const i = localStore.promptIndex[rolePhaseID].indexOf(promptID);
    if (i !== -1) localStore.promptIndex[rolePhaseID].splice(i, 1);

    delete localStore.promptById[promptID];
    useForceUpdate();
  }

  function setActiveUpdate(id: UUID | number, field: string, next: string) {
    if (!localStore) return;

    if (typeof id === "number") {
      const key = field as keyof Template;
      (localStore.rolesById[id] as unknown as Record<string, unknown>)[field] =
        next;
    } else {
      if (field == "add_prompt") {
        addPrompt(id as UUID);
      } else if (field == "remove_prompt") {
        removePrompt(next as UUID, id as UUID);
      } else if (field == "role_description") {
        (localStore.rolesById[id as UUID] as Role).role_description = next;
      } else if (field == "description") {
        localStore.rolePhasesById[id as UUID].description = next;
      } else if (field == "prompt_text") {
        localStore.promptById[id as UUID].prompt_text = next;
      } else if (field == "remove_phase") {
        removePhase(id);
      }
    }
    useForceUpdate();
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
      <TabsHeader>
        <TabsLeft>
          {localStore?.roleIds.map(t => (
            <TabButton
              key={String(t)}
              $active={activeId === t}
              onClick={() => setActiveId(t)}
            >
              {localStore.rolesById[t] && "role_name" in localStore.rolesById[t]
                ? localStore.rolesById[t].role_name
                : "Scenario Overview"}
            </TabButton>
          ))}
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
            <PhasesCount>{localStore?.phaseIds.length ?? 0}</PhasesCount>
            <PhasesStepper>
              <StepButton aria-label="Increase phases" onClick={addPhase}>
                ▲
              </StepButton>
              <StepButton
                aria-label="Decrease phases"
                onClick={() => removePhase()}
                disabled={(localStore?.phaseIds.length ?? 0) === 0}
              >
                ▼
              </StepButton>
            </PhasesStepper>
          </PhasesControl>
          <SubmitButton onClick={saveTemplate}>
            {saving ? "Saving..." : "Submit Template"}
          </SubmitButton>
        </TabsRight>
      </TabsHeader>

      <div>
        {localStore?.roleIds.map((t, idx) =>
          t === activeId ? (
            <PanelCard key={`panel-${String(t)}`}>
              {typeof activeId === "number" ? (
                <PanelHeaderRow>
                  <NameInput
                    value={
                      (localStore.rolesById[t] as Template).template_name ?? ""
                    }
                    onChange={e => renameRole(t, e.target.value)}
                  />
                </PanelHeaderRow>
              ) : (
                <PanelHeaderRow>
                  <NameInput
                    value={(localStore.rolesById[t] as Role).role_name}
                    onChange={e => renameRole(t, e.target.value)}
                  />
                  <GhostButton onClick={() => removeRole(t)}>
                    Remove
                  </GhostButton>
                </PanelHeaderRow>
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
            </PanelCard>
          ) : null,
        )}
      </div>
    </div>
  );
}
