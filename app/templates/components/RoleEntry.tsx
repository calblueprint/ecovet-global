import { useState } from "react";
import Image from "next/image";
import DownArrow from "@/assets/images/DownArrow.svg";
import RightArrow from "@/assets/images/RightArrow.svg";
import { LocalStore, Role, UUID } from "@/types/schema";
import { ActiveIds } from "../page";
import {
  PhaseCaption,
  RoleEntryContainer,
  RoleEntryHeader,
  RoleFlex,
  Selectable,
  TabbedList,
} from "./styles";

export default function RoleEntry({
  role,
  onRenameRole,
  localStore,
  setActiveIds,
}: {
  role: Role;
  onRenameRole: (newName: string) => void;
  localStore: LocalStore;
  setActiveIds: React.Dispatch<React.SetStateAction<ActiveIds>>;
}) {
  const [selected, setSelected] = useState(false);

  return (
    <RoleEntryContainer>
      <RoleEntryHeader>
        <Image
          alt="expand/collapse arrow"
          src={selected ? DownArrow : RightArrow}
          width={6}
          height={6}
          onClick={() => setSelected(s => !s)}
        />

        <PhaseCaption
          contentEditable
          suppressContentEditableWarning
          onBlur={e => {
            const value = e.currentTarget.textContent?.trim();
            onRenameRole(
              value && value.length > 0 ? value : (role.role_name ?? ""),
            );
          }}
        >
          {role.role_name}
        </PhaseCaption>
      </RoleEntryHeader>

      {selected && (
        <TabbedList>
          {Object.entries(localStore?.rolePhaseIndex[role.role_id]).map(
            ([_, rolePhaseId]) => {
              const rolePhase = localStore?.rolePhasesById[rolePhaseId];
              const phase = localStore?.phasesById[rolePhase.phase_id];

              return (
                <Selectable
                  key={rolePhaseId}
                  onClick={() => {
                    setActiveIds({
                      roleId: role.role_id,
                      rolePhaseId: rolePhaseId as UUID,
                    });
                  }}
                >
                  <RoleFlex>
                    <PhaseCaption>{phase.phase_number}</PhaseCaption>
                    <PhaseCaption>{phase.phase_name}</PhaseCaption>
                  </RoleFlex>
                </Selectable>
              );
            },
          )}
        </TabbedList>
      )}
    </RoleEntryContainer>
  );
}
