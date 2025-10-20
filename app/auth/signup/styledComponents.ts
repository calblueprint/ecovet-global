import styled from "styled-components";

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
  font-family: "Public Sans";
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const WelcomeTag = styled.div`
  width: 100%;
  height: hug-content;
  color: var(--Black-100, #0f0f0f);
`;

export const signInTag = styled.div`
  color: var(--Black-70, rgba(0, 0, 0, 0.7));
  font-family: "Public Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  width: 100%;
  height: hug-content;
  gap: clamp(0, 5rem, 1vw, 1rem);
  margin-top: 1%;

  a {
    color: var(--Tigers-Eye, #ed953b);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }
`;

export const introText = styled.div`
  width: 100%;
  height: hug-content;
`;

export const inputFields = styled.div`
  width: 100%;
  height: hug-content;
  padding-top: 36px;
  padding-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: clamp(0, 5rem, 1vw, 1rem);
`;

export const input = styled.input`
  width: 100%;
  height: 45px;
  padding: 10px 12px;
  border: 1px solid var(--Black-20, #d9d9d9);
  border-radius: 8px;
  background-color: var(--White-100, #ffffff);
  font-family: "Public Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: var(--Black-100, #0f0f0f);
  &::placeholder {
    color: var(--Black-40, rgba(0, 0, 0, 0.4));
    opacity: 1;
  }
  &:focus {
    border: 1px solid var(--Dark-Electric-Blue, #476c77);
    outline: none;
  }
`;

export const emailAddressButton = styled.div`
  width: 100%;
  height: hug-content;
  padding-bottom: 8px;
  font-family: "Public Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const passwordButton = styled.div`
  width: 100%;
  height: hug-content;
  padding-top: 16px;
  padding-bottom: 8px;
  font-family: "Public Sans";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const passwordConfirmButton = styled.div`
  width: 100%;
  height: hug-content;
  padding-top: 16px;
  padding-bottom: 8px;
  font-family: "Public Sans";
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
  color: fill= "#C7C6C3";
`;

export const passwordCheckBox = styled.div`
  width: 100%;
  height: hug-content;
  padding-top: 16px;
  font-family: "Public Sans";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  ul {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
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
  font-weight: 500;
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

export const signUpButton = styled.button`
  width: 100%;
  height: 45px;
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  gap: clamp(0, 5rem, 1vw, 1rem);
  background-color: var(--Dark-Electric-Blue, #476c77);
  font-family: "Public Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: var(--Dark-Electric-Blue, #476c77);
  }
  border-radius: 4px;
  radius-color: var(--Dark-Electric-Blue, #476c77);
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
