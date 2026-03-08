import { useState } from "react";
import Image from "next/image";
import { UUID } from "crypto";
import DownArrow from "@/assets/images/DownArrow.svg";
import RightArrow from "@/assets/images/RightArrow.svg";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { Caption } from "@/styles/text";
import { localStore, Role } from "@/types/schema";
import { ActiveIds } from "../page";
import { SideBarItem } from "./styles";

// TODO: add remove role shit
export default function RoleEntry({
  role,
  localStore,
  setActiveIds,
}: {
  role: Role;
  localStore: localStore;
  setActiveIds: React.Dispatch<React.SetStateAction<ActiveIds>>;
}) {
  const [selected, setSelected] = useState(false);

  return (
    <SideBarItem key={role.role_id}>
      <Flex $gap="4px" $direction="column">
        <Flex $gap="4px" $direction="row" $align="center">
          <Image
            alt="expand/collapse arrow"
            src={selected ? DownArrow : RightArrow}
            width={6}
            height={6}
            onClick={() => setSelected(s => !s)}
          />

          <Caption $color={COLORS.black70}>{role.role_name}</Caption>
        </Flex>

        <Flex $gap="4px" $direction="column" $pl="12px">
          {selected &&
            Object.entries(localStore?.rolePhasesById).map(
              ([rolePhaseId, rolePhase]) => {
                const phase = localStore?.phasesById[rolePhase.phase_id];

                return (
                  <SideBarItem
                    key={rolePhaseId}
                    onClick={() =>
                      setActiveIds({
                        roleId: role.role_id,
                        phaseId: rolePhaseId as UUID,
                      })
                    }
                  >
                    <Flex $gap="8px" $direction="row">
                      <Caption $color={COLORS.black70}>
                        {phase.phase_number}
                      </Caption>
                      <Caption $color={COLORS.black70}>
                        {phase.phase_name}
                      </Caption>
                    </Flex>
                  </SideBarItem>
                );
              },
            )}
        </Flex>
      </Flex>
    </SideBarItem>
  );
}
