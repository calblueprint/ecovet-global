import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { B2, Caption, H3 } from "@/styles/text";

export const PhaseCaption = styled(Caption)`
  color: ${COLORS.black70};
  font-weight: 400;
`;

export const RoleEntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const RoleEntryHeader = styled(Flex).attrs({
  $align: "center",
  $gap: "4px",
})``;

export const RoleFlex = styled(Flex)`
  gap: 0.5rem;
  direction: row;
`;
