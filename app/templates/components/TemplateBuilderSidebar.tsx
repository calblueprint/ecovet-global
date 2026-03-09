"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import img from "@/assets/images/BlackPlus.svg";
import { Caption } from "@/styles/text";
import { LocalStore, Role, Template, UUID } from "@/types/schema";
import { ActiveIds } from "../page";
import EditablePhase from "./EditablePhase";
import RoleEntry from "./RoleEntry";
import {
  HeaderWithPlus,
  PhaseCaption,
  PhaseList,
  RoleList,
  Selectable,
  SidebarCaption,
  SidebarContainer,
  SideBarEntry,
  SideBarHeader,
  SideBarSection,
  SidebarTemplateName,
  TabbedList,
} from "./styles";

export default function TemplateBuilderSideBar({
  localStore,
  setActiveIds,
  updateLocalStore,
}: {
  localStore: LocalStore | null;
  setActiveIds: React.Dispatch<React.SetStateAction<ActiveIds>>;
  updateLocalStore: (updater: (draft: LocalStore) => void) => void;
}) {
  const router = useRouter();
  const TEMPLATE_INDEX = 1;
  const template = localStore?.rolesById[TEMPLATE_INDEX] as Template;

  function addPhase(): void {
    if (!localStore) return;
    const newPhaseID = crypto.randomUUID();

    updateLocalStore(draft => {
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
        const newRolePhaseID = crypto.randomUUID();
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

  function addRole(): void {
    if (localStore == null) return;
    const newRoleID = crypto.randomUUID();

    updateLocalStore(draft => {
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
        const newRolePhaseID = crypto.randomUUID();
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

    setActiveIds({ roleId: newRoleID, rolePhaseId: null });
  }

  function renameRole(role_id: UUID | number, newLabel: string) {
    if (localStore == null) return;

    updateLocalStore(draft => {
      if (typeof role_id === "number") {
        (draft.rolesById[role_id] as Template).template_name = newLabel;
      } else {
        (draft.rolesById[role_id] as Role).role_name = newLabel;
      }
    });
  }

  return (
    <SidebarContainer>
      <SideBarSection $isFirst={true}>
        <SideBarHeader>
          <SidebarCaption>← Catalogue</SidebarCaption>
          <SidebarTemplateName
            contentEditable
            suppressContentEditableWarning
            onBlur={e => {
              const value = e.currentTarget.textContent?.trim();

              updateLocalStore(draft => {
                (draft?.rolesById[TEMPLATE_INDEX] as Template).template_name =
                  value && value.length > 0 ? value : "New Template";
              });
            }}
          >
            {template.template_name}
          </SidebarTemplateName>
        </SideBarHeader>
      </SideBarSection>

      <SideBarSection>
        <SideBarEntry>
          <Caption>Global</Caption>

          <TabbedList>
            <Selectable
              onClick={() =>
                setActiveIds({ roleId: TEMPLATE_INDEX, rolePhaseId: null })
              }
            >
              <PhaseCaption>Scenario Overview</PhaseCaption>
            </Selectable>
          </TabbedList>
        </SideBarEntry>

        <SideBarEntry>
          <HeaderWithPlus>
            <Caption>Phases</Caption>

            <Selectable>
              <Image
                alt="add phase"
                src={img}
                width={8}
                height={8}
                onClick={addPhase}
              />
            </Selectable>
          </HeaderWithPlus>

          <PhaseList>
            {localStore?.phaseIds.map((phaseId, i) => {
              const phase = localStore?.phasesById[phaseId];
              const onUpdate = (value: string) => {
                updateLocalStore(draft => {
                  draft.phasesById[phaseId].phase_name =
                    value && value.length > 0 ? value : `Phase ${i + 1}`;
                });
              };

              return (
                <EditablePhase
                  index={i}
                  key={phaseId}
                  name={phase?.phase_name ?? `Phase ${i + 1}`}
                  onUpdate={onUpdate}
                />
              );
            })}
          </PhaseList>
        </SideBarEntry>
      </SideBarSection>

      <SideBarSection>
        <SideBarEntry>
          <HeaderWithPlus>
            <Caption>Roles</Caption>
            <Selectable>
              <Image
                alt="add phase"
                src={img}
                width={8}
                height={8}
                onClick={addRole}
              />
            </Selectable>
          </HeaderWithPlus>

          <RoleList>
            {localStore?.roleIds.map(roleId => {
              if (roleId === TEMPLATE_INDEX) return null;
              const role = localStore.rolesById[roleId] as Role;

              return (
                <RoleEntry
                  key={roleId}
                  role={role}
                  onRenameRole={newLabel => renameRole(roleId, newLabel)}
                  localStore={localStore}
                  setActiveIds={setActiveIds}
                />
              );
            })}
          </RoleList>
        </SideBarEntry>
      </SideBarSection>
    </SidebarContainer>
  );
}
