import styled from "styled-components";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const ParticipantFlowMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;
  width: 100%;
`;

export const Container = styled.div`
  background-color: ${COLORS.white};
  width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`;

export const PromptCard = styled.div`
  gap: 1rem;
  padding-bottom: 1rem;
`;

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


export const PhaseHeading = styled.h1`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
`;

export const RolePhaseDescription = styled.p`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
`;

export const PromptText = styled.p`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
`;

export const StyledTextarea = styled(TextareaAutosize)`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: ${COLORS.black20} 0.1rem solid;
  font-size: 0.8rem;
  font-family: ${Sans.style.fontFamily};

  &:focus {
    outline: none;
    border-color: #7aa0ff;
    box-shadow: 0 0 0 2px #e8efff;
  }
`;

export const Button = styled.button`
  width: 100%;
  height: 45px;
  gap: 10rem;
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