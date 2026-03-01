import { useState } from "react";
import Image from "next/image";
import { UUID } from "crypto";
import DownArrow from "@/assets/images/DownArrow.svg";
import RightArrow from "@/assets/images/RightArrow.svg";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { Caption } from "@/styles/text";
import { localStore, Role } from "@/types/schema";
import { SideBarItem } from "./styles";

export default function RoleEntry({
  role,
  localStore,
  setActiveId,
}: {
  role: Role;
  localStore: localStore;
  setActiveId: (id: number | UUID) => void;
}) {
  const [selected, setSelected] = useState(false);

  return (
    <SideBarItem key={role.role_id} onClick={() => setActiveId(role.role_id)}>
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
            localStore?.phaseIds.map((phaseId, i) => {
              const phase = localStore?.phasesById[phaseId];

              return (
                <SideBarItem key={phaseId}>
                  <Flex $gap="8px" $direction="row">
                    <Caption $color={COLORS.black70}>{i + 1}</Caption>
                    <Caption $color={COLORS.black70}>
                      {phase?.phase_name}
                    </Caption>
                  </Flex>
                </SideBarItem>
              );
            })}
        </Flex>
      </Flex>
    </SideBarItem>
  );
}
