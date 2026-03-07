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
  justify-content: center;
  align-items: center;
`;

export const WelcomeTag = styled.h2`
  width: 100%;
  height: fit-content;
  color: ${COLORS.black100};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InputFields = styled.div`
  width: 100%;
  height: fit-content;
  padding: 1rem 0rem 2.25rem 0rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0, 5rem, 1rem, 1rem);
`;

export const Input = styled.input`
  width: 20rem;
  height: 45px;
  padding: 0.66rem;
  justify-content: center;
  align-items: center;
  border: 1px solid ${COLORS.black20};
  border-radius: 8px;
  background-color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: ${COLORS.black100};
  &::placeholder {
    color: ${COLORS.black20};
    opacity: 1;
  }
  &:focus {
    border: 1px solid ${COLORS.darkElectricBlue};
    outline: none;
  }
`;

export const EmailAddressDiv = styled.div`
  width: 100%;
  height: fit-content;
  padding-bottom: 0.5rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const Button = styled.button<{ disabled?: boolean }>`
  width: 20rem;
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

export const SignInTag = styled.div`
  color: ${COLORS.black100};
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  width: 100%;
  height: fit-content;
  gap: clamp(0, 5rem, 1vw, 1rem);
  margin-top: 1rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center; /* horizontal centering */
  align-items: center; /* vertical centering */
  text-align: center;

  a {
    color: ${COLORS.orange};
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }
`;
