import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  padding: 2rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${COLORS.white};
  background: ${COLORS.white};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column; /* stack children vertically */
  gap: 1rem; /* now works! */
  background-color: ${COLORS.white};
  border-radius: 12px;
  padding: 2rem 2.5rem;
  width: 40%;
  border: none;
`;

export const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.darkElectricBlue};
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background-color 0.2s;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;
