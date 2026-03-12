import TextareaAutosize from "@mui/material/TextareaAutosize";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const ParticipantFlowMain = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: top;
  padding: 40px 0;
  width: 100%;
  height: 100%;
  align-items: flex-start;
  gap: 32px;
  flex: 1 0 0;
`;

export const Container = styled.div`
  background-color: ${COLORS.white};
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;
  padding: 80px 120px;
`;

export const PhaseContextStyled = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const PromptCard = styled.div`
  display: flex;
  padding-top: 32px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  flex: 1 0 0;
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
  font-family: ${Sans.style.fontFamily};
`;

export const PhaseHeading = styled.h1`
  display: flex;
  flex-direction: column;
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

export const ContextStyled = styled.div`
  display: flex;
  padding: 9px 12px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;

  border-radius: 8px;
  background-color: ${COLORS.oat_medium};

  color: ${COLORS.black70};

  /* Body 2 */
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 18px */
`;

export const SubheaderStyled = styled.h4`
  font-size: 10px;
  color: ${COLORS.black40};
  padding 0 0 8px;
`;

export const BodyTextStyled = styled.h4`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

export const ScenarioOverviewStyled = styled.h3`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 16px;
`;

export const ScenarioOverviewTitleStyled = styled.div`
  color: ${COLORS.black};
  padding: 0 0 16px 0;

  /* Heading 3 */
  font-family: ${Sans.style.fontFamily};
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const ScenarioOverviewFieldsStyled = styled.div`
  display: flex;
  padding: 9px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;

  border-radius: 8px;
  background-color: ${COLORS.oat_medium};
`;

export const PromptQuestionTitleStyled = styled.div`
  color: ${COLORS.black};

  /* Heading 3 */
  font-family: ${Sans.style.fontFamily};
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const NextButtonContainerStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const PromptQuestionStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
  color: ${COLORS.black70};
`;

export const PromptQuestionArrowStyled = styled.div`
  display: flex;
  flex-shrink: 0;
  color: ${COLORS.black70};

  /* Body 1 */
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const PromptQuestionContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  color: ${COLORS.black70};
  width: 100%;
`;

export const PromptQuestionContentTitledStyled = styled.div`
  display: flex;
  padding: 0 0 16px 0;
  color: ${COLORS.black70};

  /* Body 1 */
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
