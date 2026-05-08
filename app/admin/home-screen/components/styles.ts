import styled from "styled-components";
import { styles } from "@/components/pdf/styles";
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
  background: ${COLORS.white};
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

export const SubmitDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
  width: 100%;
`;

export const EmailDiv = styled.div`
  flex-direction: row;
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  width: 100%;
`;

export const EmailInput = styled.input`
  display: block;
  width: 100%;
  height: 2.4rem;

  padding: 0 0.75rem;
  box-sizing: border-box;

  border-radius: 4px;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};

  color: ${COLORS.black100};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-weight: 500;
  line-height: normal;

  outline: none;
  appearance: none;

  &::placeholder {
    color: ${COLORS.black20};
    font-size: 0.7rem;
    font-weight: 500;
    font-family: ${Sans.style.fontFamily};
  }
`;

export const SubmitButton = styled.button`
  min-width: 8rem;
  display: flex;
  padding: 0rem 2rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  border-radius: 0.25rem;
  border: 1px transparent;
  background: ${COLORS.darkElectricBlue};
  cursor: pointer;
  height: 2.3rem;

  color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;

  &:disabled {
    background: ${COLORS.darkElectricBlue};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const CancelButton = styled.button`
  min-width: 8rem;
  display: flex;
  padding: 0rem 2rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  border-radius: 0.25rem;
  border: 1px transparent;
  background: ${COLORS.white};
  cursor: pointer;
  height: 2.3rem;

  color: ${COLORS.black40};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 500;
  border: 1px solid ${COLORS.black20};
  line-height: normal;
  white-space: nowrap;
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

export const ButtonPaddingDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InviteTypeButton = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.25rem;
  align-items: center;
  align-self: stretch;
  height: 2.3rem;
  width: 70%;

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

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FacilitatorTextArea = styled.textarea`
  display: block;
  width: 100%;
  min-height: 4rem;
  overflow-y: hidden;
  padding: 0.75rem;
  box-sizing: border-box;
  border-radius: 0.3rem;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};
  color: ${COLORS.black100};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1.5;
  outline: none;
  resize: none;

  &::placeholder {
    color: ${COLORS.black20};
    font-size: 0.7rem;
    font-weight: 500;
    font-family: ${Sans.style.fontFamily};
  }
`;

export const ModalBox = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 35rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ErrorBanner = styled.h2<{ $isError: boolean }>`
  color: ${COLORS.tagRed};
  font-size: 0.7rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const BasicText = styled.h3`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-weight: 500;
  margin-top: 0.5rem;
  line-height: normal;
`;

export const RequiredText = styled.span`
  color: ${COLORS.tagRed};
`;

export const GroupDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};
  width: 100%;
  height: 100%;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  font-family: ${Sans.style.fontFamily};
  font-size: 1rem;
  font-weight: 700;
  color: ${COLORS.black100};
  margin: 0;
`;

export const WarningText = styled.p`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.8rem;
  font-weight: 500;
  color: ${COLORS.tagRed};
  margin: 0;
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLORS.black40};
  font-size: 0.85rem;
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem 0 2.25rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.85rem;
  color: ${COLORS.black100};
  outline: none;

  &::placeholder {
    color: ${COLORS.black40};
  }
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 32rem;
  overflow-y: auto;
`;

export const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${COLORS.oat_light};
  cursor: pointer;
`;

export const FileIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`;

export const FileName = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.95rem;
  font-weight: 500;
  color: ${COLORS.black100};
`;

export const FileDate = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.8rem;
  font-weight: 400;
  color: ${COLORS.black40};
`;

export const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  border-bottom: 1px solid ${COLORS.oat_medium};
`;

export const TabButton = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  color: ${({ $active }) => ($active ? COLORS.black100 : COLORS.black40)};

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${COLORS.darkElectricBlue};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: opacity 0.2s ease;
  }

  &:hover {
    color: ${COLORS.black100};
  }
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
  margin-top: auto;
`;

export const Groups = styled.div`
  gap: 3rem;
`;

export const HeaderSide = styled.div`
  gap: 3rem;
`;
