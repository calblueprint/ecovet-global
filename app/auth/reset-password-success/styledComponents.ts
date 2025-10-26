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
  background-color: ${COLORS.white};
  border-radius: 12px;
  padding: 2rem 2.5rem;
  width: min(100%, 400px);
  border: none;
`;

export const Heading2 = styled.h2`
  font-family: ${Sans.style.fontFamily};
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const RedirectButton = styled.button`
  width: 100%;
  height: 45px;
  margin-top: 2rem;
  padding: 1rem 0rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  gap: clamp(0, 5rem, 1vw, 1rem);
  background-color: ${COLORS.darkElectricBlue};
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS.darkElectricBlue};
  }
  border: 0px ${COLORS.darkElectricBlue};
  border-radius: 4px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
