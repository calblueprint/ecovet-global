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
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const Heading3 = styled.h3`
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.black70};
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 500;
`;

export const WelcomeTag = styled.div`
  display: flex;
  flex-direction: column;
  color: ${COLORS.black100};
`;

export const IntroText = styled.div`
  width: 100%;
  height: fit-content;
`;

export const InputFields = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1.5rem;
  flex-direction: column;
`;

export const Input = styled.input`
  width: 100%;
  height: 2.25rem;
  padding: 0.66rem;
  border-radius: 0.25rem;
  border: 1px solid ${COLORS.black20};
  background-color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: ${COLORS.black100};
  &:focus {
    border: 1px solid ${COLORS.darkElectricBlue};
    outline: none;
  }
`;

export const InputDiv = styled.div`
  align-self: stretch;
  width: 100%;
  height: fit-content;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Label = styled.div`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.6875rem;
  font-style: bold;
  font-weight: 700;
  line-height: normal;
  color: ${COLORS.black70};
`;

export const Button = styled.button`
  width: 100%;
  height: 45px;
  gap: 10rem;
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
