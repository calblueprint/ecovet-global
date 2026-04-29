import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const Button = styled.button`
  width: 6rem;
  height: 2rem;
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
  font-weight: 500;
  line-height: normal;
  color: white;
  cursor: pointer;
  border-radius: 0.25rem;
  &:hover {
    background-color: ${COLORS.darkElectricBlue};
  }
  border: 0px ${COLORS.darkElectricBlue};
  border-radius: 0.3rem;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

export const DeleteButton = styled.button`
  background-color: transparent;
  border: 0;
  cursor: pointer;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out;
`;
