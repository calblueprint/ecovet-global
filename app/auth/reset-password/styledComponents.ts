import styled from "styled-components";
import COLORS from "@/styles/colors";

export const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  padding: 2rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  background: white;
`;

export const Container = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  width: min(100%, 400px);
  border: none;
`;

export const Heading2 = styled.h2`
  font-family: var(--font-public-sans);
  font-size: 32px;
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
  color: var(--Black-70, rgba(0, 0, 0, 0.7));
  font-family: {Public_Sans};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  width: 100%;
  height: fit-content;
  gap: clamp(0, 5rem, 1vw, 1rem);
  margin-top: 1%;

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
`;

export const InputFields = styled.div`
  width: 100%;
  height: fit-content;
  padding: 1rem 0rem 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: clamp(0, 5rem, 1vw, 1rem);
`;

export const Input = styled.input`
  width: 100%;
  height: 45px;
  padding: 0.66rem;
  border: 1px solid ${COLORS.black20};
  border-radius: 8px;
  background-color: var(--White-100, #ffffff);
  font-family: var(--font-public-sans);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: ${COLORS.black100};
  &::placeholder {
    color: var(--Black-40, rgba(0, 0, 0, 0.4));
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
  font-family: var(--font-public-sans);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const PasswordDiv = styled.div`
  width: 100%;
  height: fit-content;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  font-family: var(--font-public-sans);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const PasswordConfirmDiv = styled.div`
  width: 100%;
  height: fit-content;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  font-family: var(--font-public-sans);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
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
  color: #c7c6c3;
`;

export const PasswordCheckBox = styled.div`
  width: 100%;
  height: fit-content;
  padding-top: 1rem;
  font-family: var(--font-public-sans);
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
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
  font-size: 12px;
  font-weight: 400;
  transition: color 0.2s ease;

  &::before {
    content: ${({ $touched, $valid }) =>
      !$touched ? "#666" : $valid ? "green" : "red"};
    display: inline-block;
    width: 1em; /* space for the symbol */
  }

  color: ${({ $touched, $valid }) =>
    !$touched ? "black" : $valid ? "green" : "red"};

  svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    color: ${({ $touched, $valid }) =>
      !$touched ? "#666" : $valid ? "green" : "red"};
  }
`;

export const SignUpButton = styled.button`
  width: 100%;
  height: 45px;
  padding: 1rem 0rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  gap: clamp(0, 5rem, 1vw, 1rem);
  background-color: ${COLORS.darkElectricBlue};
  font-family: var(--font-public-sans);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS.darkElectricBlue};
  }
  border-radius: 4px;
  radius-color: ${COLORS.darkElectricBlue};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
