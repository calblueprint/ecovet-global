import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const Main = styled.main`
  display: flex;
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
  width: stretch;
  width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`;

export const Heading2 = styled.h2`
  font-family: ${Sans.style.fontFamily};
  padding-bottom: 0.5rem;
  font-size: 2 rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const Button = styled.button`
  width: 15rem;
  height: 45px;
  border-radius: 0.25rem;
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

export const Heading3 = styled.h3`
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.black100};
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 500;
  text-align: start;
`;
