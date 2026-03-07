import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const Button = styled.button`
  width: 100%;
  height: 45px;
  gap: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background-color: ${COLORS.darkElectricBlue};
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS.darkElectricBlue};
  }
  border: 0px ${COLORS.darkElectricBlue};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
