import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const AddInviteMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
  gap: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.oat_light};
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
export const FormHeader = styled.h2`
  color: ${COLORS.black70};
  font-size: 0.85rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  font-family: ${Sans.style.fontFamily};
`;

export const AddInviteFormDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
  width: 100%;
`;

export const EmailDiv = styled.div<{ $isAdmin?: boolean }>`
  display: flex;
  width: 100%;
  ${({ $isAdmin }) =>
    $isAdmin
      ? `
    flex-direction: column;
    gap: 1rem;
  `
      : `
    flex-direction: row;
    gap: 2rem;
    justify-content: space-between;
  `}
`;

export const EmailInput = styled.textarea`
  display: block;
  width: 100%;
  min-height: 100px;

  padding: 0.75rem;
  box-sizing: border-box;

  border-radius: 4px;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};

  color: ${COLORS.black100};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1.5;

  outline: none;
  appearance: none;
  resize: vertical;

  &::placeholder {
    color: ${COLORS.black20};
    font-size: 0.7rem;
    font-weight: 500;
    font-family: ${Sans.style.fontFamily};
  }
`;

export const EmailTextArea = styled.textarea`
  display: block;
  width: 100%;
  min-height: 60px;
  padding: 0.75rem;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};
  color: ${COLORS.black100};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1.5;
  outline: none;
  resize: vertical;

  &::placeholder {
    color: ${COLORS.black20};
    font-size: 0.7rem;
    font-weight: 500;
    font-family: ${Sans.style.fontFamily};
  }
`;

export const SubmitButton = styled.button<{ $isAdmin?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px transparent;
  background: ${COLORS.darkElectricBlue};
  cursor: pointer;
  color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  ${({ $isAdmin }) =>
    $isAdmin
      ? `
    padding: 0.5rem 1rem;
    gap: 0.625rem;
    flex: 1;
  `
      : `
    padding: 0rem 2rem;
    gap: 0.625rem;
    align-self: stretch;
    white-space: nowrap;
  `}

  &:disabled {
    background: ${COLORS.darkElectricBlue};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ErrorMessageDiv = styled.div<{ $hasError: string }>`
  display: ${({ $hasError }) => ($hasError == "" ? "none" : "flex")};
  flex-direction: column;
`;

export const ErrorMessage = styled.p`
  color: ${COLORS.tagRed};
  font-size: 0.7rem;
  font-weight: 500;
  font-family: ${Sans.style.fontFamily};
`;

export const ButtonPaddingDiv = styled.div<{ $isAdmin?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  ${({ $isAdmin }) =>
    $isAdmin
      ? `
    flex-wrap: wrap;
    gap: 0.5rem;
  `
      : `
    gap: 16rem;
  `}
`;

export const InviteTypeButton = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.25rem;
  align-items: center;
  align-self: stretch;

  border-radius: 0.25rem;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};
`;

export const ParticipantButton = styled.button<{ $isOn: boolean }>`
  display: flex;
  padding: 0.25rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;
  border: transparent;
  cursor: pointer;

  border-radius: 0.25rem;
  background: ${({ $isOn }) => ($isOn ? COLORS.oat_medium : COLORS.white)};

  color: ${({ $isOn }) => ($isOn ? COLORS.black100 : COLORS.black40)};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
export const FacilitatorButton = styled.button<{ $isOn: boolean }>`
  display: flex;
  padding: 0.25rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
  align-self: stretch;
  border: transparent;
  cursor: pointer;

  border-radius: 0.25rem;
  background: ${({ $isOn }) => ($isOn ? COLORS.oat_medium : COLORS.white)};

  color: ${({ $isOn }) => ($isOn ? COLORS.black100 : COLORS.black40)};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
