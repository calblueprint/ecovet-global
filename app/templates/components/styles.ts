import styled from "styled-components";
import COLORS from "@/styles/colors";
import { B2, Caption, H3 } from "@/styles/text";

export const Selectable = styled.div`
  cursor: pointer;
`;

export const PhaseCaption = styled(Caption)`
  color: ${COLORS.black70};
  font-weight: 400;
`;

export const PhaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const TabbedList = styled(PhaseList)`
  padding-top: 0.35rem;
  padding-left: 12px;
  font-weight: 400;
`;
