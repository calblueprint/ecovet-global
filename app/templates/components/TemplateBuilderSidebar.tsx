"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { UUID } from "crypto";
import img from "@/assets/images/BlackPlus.svg";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { B2, Caption } from "@/styles/text";
import { localStore, Role, Template } from "@/types/schema";
import { SideBarEntry, SideBarItem, SideBarSection } from "./styles";

export default function TemplateBuilderSideBar({
  localStore,
  setActiveId,
  updateLocalStore,
}: {
  localStore: localStore | null;
  setActiveId: (id: number | UUID) => void;
  updateLocalStore: (updater: (draft: localStore) => void) => void;
}) {
  const router = useRouter();
  const TEMPLATE_INDEX = 1;
  const template = localStore?.rolesById[TEMPLATE_INDEX] as Template;

  function createUUID(): UUID {
    return crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
  }

  function addPhase(): void {
    if (!localStore) return;
    const newPhaseID = createUUID();

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

  function addRole(): void {
    if (localStore == null) return;
    const newRoleID = createUUID();

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

  return (
    <div>
      <SideBarSection>
        <Flex $gap="6px" $direction="column">
          <Caption $color={COLORS.black40}>←Catalogue</Caption>
          <B2
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
          </B2>
        </Flex>
      </SideBarSection>

      <SideBarSection>
        <SideBarEntry>
          <Caption>Global</Caption>

          <SideBarItem onClick={() => setActiveId(TEMPLATE_INDEX)}>
            <Caption $color={COLORS.black70}>Scenario Overview</Caption>
          </SideBarItem>
        </SideBarEntry>

        <SideBarEntry>
          <Flex $align="center" $justify="between" $direction="row">
            <Caption>Phases</Caption>
            <Image
              style={{ cursor: "pointer" }}
              alt="add phase"
              src={img}
              width={8}
              height={8}
              onClick={addPhase}
            />
          </Flex>

          {localStore?.phaseIds.map((phaseId, i) => {
            const phase = localStore?.phasesById[phaseId];

            return (
              <SideBarItem key={phaseId}>
                <Flex $gap="8px" $direction="row">
                  <Caption $color={COLORS.black70}>{i + 1}</Caption>
                  <Caption
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => {
                      const value = e.currentTarget.textContent?.trim();

                      updateLocalStore(draft => {
                        draft.phasesById[phaseId].phase_name =
                          value && value.length > 0 ? value : `Phase ${i + 1}`;
                      });
                    }}
                  >
                    {phase?.phase_name}
                  </Caption>
                </Flex>
              </SideBarItem>
            );
          })}
        </SideBarEntry>
      </SideBarSection>

      <SideBarSection>
        <SideBarEntry>
          <Flex $align="center" $justify="between" $direction="row">
            <Caption>Roles</Caption>
            <Image
              style={{ cursor: "pointer" }}
              alt="add phase"
              src={img}
              width={8}
              height={8}
              onClick={addRole}
            />
          </Flex>

          {localStore?.roleIds.map(roleId => {
            if (roleId === TEMPLATE_INDEX) return null;
            const role = localStore.rolesById[roleId] as Role;

            return (
              <SideBarItem key={roleId} onClick={() => setActiveId(roleId)}>
                <Caption $color={COLORS.black70}>{role.role_name}</Caption>
              </SideBarItem>
            );
          })}
        </SideBarEntry>
      </SideBarSection>
    </div>
  );
}
