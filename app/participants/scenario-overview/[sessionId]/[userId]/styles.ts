import TextareaAutosize from "@mui/material/TextareaAutosize";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const Main = styled.main`
  display: flex;
  flex-direction: row;
  height: 100vh;
  min-height: 100vh;
  background-color: ${COLORS.white};
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

export const StyledTextarea = styled(TextareaAutosize)`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: ${COLORS.black20} 0.1rem solid;
  font-size: 0.8rem;
  font-family: ${Sans.style.fontFamily};
  resize: none;

  &:focus {
    outline: none;
    border-color: #7aa0ff;
    box-shadow: 0 0 0 2px #e8efff;
  }
`;
