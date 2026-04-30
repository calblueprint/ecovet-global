import TextareaAutosize from "@mui/material/TextareaAutosize";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const Main = styled.main`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  > *:nth-child(1) {
    flex: 0.5 0.5 25rem;
  }

  > *:nth-child(2) {
    flex: 1 1 auto;
    min-width: 0;
  }

  > *:nth-child(3) {
    flex: 0 0 23rem;
    border-left: 1px solid #e5e7eb;
  }
`;

export const LoadingScreen = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentDiv = styled.div`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PhaseDescriptionWrapper = styled.div<{ $phase?: boolean }>`
  display: ${({ $phase }) => ($phase ? "flex" : "none")};
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

export const OverviewHeader = styled.h2<{ $phase?: boolean }>`
  color: ${COLORS.black};
  font-family: ${Sans.style.fontFamily};
  font-size: ${({ $phase }) => ($phase ? "2rem" : "1.5rem")};
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const PhaseHeader = styled.h2`
  color: ${COLORS.black};
  font-family: ${Sans.style.fontFamily};
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const ContentBody40 = styled.p`
  color: ${COLORS.black40};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
`;

export const ContentBubble = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  gap: 0.5rem;
  border-radius: 8px;
  width: 100%;
  background: #f5f5f5;
`;

export const ContentHeader = styled.h3`
  color: ${COLORS.black40};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const ContentBody = styled.p`
  color: ${COLORS.black70};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
  width: 100%;
`;

export const ContinueButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0 2rem 0;
  margin-top: auto;
`;

export const ContinueButton = styled.button`
  display: flex;
  padding: 0.5rem 2rem;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.25rem;
  background: ${COLORS.darkElectricBlue};
  border: none;
  color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PhaseHeading = styled.h1`
  font-family: ${Sans.style.fontFamily};
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  color: ${COLORS.black};
`;

export const PromptCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const PromptText = styled.p`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${COLORS.black};
  padding-bottom: 0.5rem;
`;

export const StyledTextArea = styled(TextareaAutosize)`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: ${COLORS.black20} 0.07rem solid;
  font-size: 0.8rem;
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.black70};
  resize: none;

  &::placeholder {
    color: ${COLORS.black20};
  }

  &:focus {
    outline: none;
    border-color: #7aa0ff;
    box-shadow: 0 0 0 2px #e8efff;
  }
`;

export const PromptQuestionNumber = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  font-family: ${Sans.style.fontFamily};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.black70};
`;

export const PromptQuestionText = styled.p`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.875rem;
  font-weight: 700;
  color: ${COLORS.black70};
  margin: 0;
`;

export const FollowUpList = styled.ul`
  list-style-type: disc;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
`;

export const FollowUpItem = styled.li`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.8rem;
  font-weight: 400;
  color: ${COLORS.black40};
  line-height: 1.4;
`;

export const PromptWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 2.5rem;
  position: relative;
`;

export const Clickable = styled.div`
  cursor: pointer;
`;
