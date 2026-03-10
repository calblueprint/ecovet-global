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
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const WelcomeTag = styled.div`
  width: 100%;
  height: fit-content;
  color: ${COLORS.black100};
`;

export const SignInTag = styled.div`
  color: ${COLORS.black70};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 100%;
  height: fit-content;
  gap: clamp(0, 5rem, 1vw, 1rem);

  a {
    color: ${COLORS.orange};
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }
`;

export const IntroText = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const InputFields = styled.div`
  width: 100%;
  height: fit-content;
  padding: 1.5rem 0rem 1.5rem 0rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const InputLabel = styled.label`
  position: absolute;
  top: 0.375rem;
  left: 1rem;
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: ${COLORS.black40};
  pointer-events: none;
  font-family: ${Sans.style.fontFamily};
  z-index: 1;
`;

export const Input = styled.input`
  width: 100%;
  height: 45px;
  padding: 1.25rem 1rem 0.32rem 1rem;
  border: 1px solid ${COLORS.black20};
  border-radius: 0.25rem;
  background-color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 150%
  color: ${COLORS.black70};
  &::placeholder {
    color: ${COLORS.black20};
    opacity: 1;
  }
  &:focus {
    border: 1px solid ${COLORS.darkElectricBlue};
    outline: none;
    box-shadow: none;
  }
`;

export const EmailAddressDiv = styled.div`
  width: 100%;
  height: fit-content;
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const PasswordDiv = styled.div`
  width: 100%;
  height: fit-content;
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: ${COLORS.black70};
`;

export const PasswordConfirmDiv = styled.div`
  width: 100%;
  height: fit-content;
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: ${COLORS.black20};
`;

export const VisibilityToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: ${COLORS.black20};
`;

export const PasswordCheckBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;  
  height: fit-content;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  gap: 
  ul {
    list-style-type: disc;
    list-style-position: outside;
    // padding-left: 1.5rem;
    margin: 0.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }
`;

export const PasswordRule = styled.li<{ $touched: boolean; $valid: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 400;
  transition: color 0.2s ease;

  &::before {
    content: ${({ $touched, $valid }) =>
      !$touched ? COLORS.black70 : $valid ? "black" : "red"};
    display: inline-block;
    width: 1em; /* space for the symbol */
  }

  color: ${({ $touched, $valid }) =>
    !$touched ? COLORS.black70 : $valid ? "green" : "red"};

  svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    color: ${({ $touched, $valid }) =>
      !$touched ? COLORS.black70 : $valid ? "green" : "red"};
  }
`;

export const PasswordText = styled.p`
color: ${COLORS.black70};
font-family: ${Sans.style.fontFamily};
font-size: 0.75rem;
font-style: normal;
font-weight: 400;
line-height: normal;
align-self: stretch;
`;

export const Button = styled.button`
  width: 100%;
  height: 40px;
  padding: 1rem 0rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  gap: clamp(0, 5rem, 1vw, 1rem);
  background-color: ${COLORS.darkElectricBlue};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 700;
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

export const ForgetPasswordTag = styled.div`
  width: fit-content;
  height: fit-content;
  color: ${COLORS.black70};
  font-family: ${Sans.style.fontFamily};
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding-top: 0.6rem;
`;

export const ErrorMessage = styled.div`
  width: 100%;
  height: fit-content;
  color: red;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding-top: 1rem;
  text-align: center;
`;

export const SuccessMessage = styled.div`
  width: 100%;
  height: fit-content;
  color: ${COLORS.black70};
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding-top: 1rem;
  text-align: center;
`;
