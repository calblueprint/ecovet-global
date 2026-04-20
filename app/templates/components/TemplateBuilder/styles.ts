import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";

export const PanelCard = styled(Flex).attrs({ $direction: "column" })`
  // padding: 40px 100px 0 0;
  gap: 32px;
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  width: auto;

  padding: 13px 18px;
  border-radius: 4px;
  background: ${COLORS.darkElectricBlue};
  color: ${COLORS.white};
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
  cursor: pointer;
`;
