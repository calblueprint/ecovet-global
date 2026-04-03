import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { B2, Caption, H3 } from "@/styles/text";

export const PhaseCaption = styled(Caption)`
  color: ${COLORS.black70};
  font-weight: 400;
`;

export const PhaseEntry = styled(Flex).attrs({
  $align: "center",
  $gap: "8px",
})``;
