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

export const MainDiv = styled.main`
  display: flex;
  width: 1096px;
  padding: 2rem 3rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  max-width: 1100px;
`;

export const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
`;

export const AnnouncementsPanel = styled.div`
  width: 280px;
  min-width: 280px;
  border-left: 1px solid var(--Oat-Medium, #eee);
`;

export const ContentDiv = styled.div`
  display: flex;
  padding: 32px 0 32px 48px;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  flex: 1;
  overflow-y: auto;
`;

export const HeadingBox = styled.main`
  display: flex;
  padding: 1rem 1.25rem;
  height: 50px;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
`;

export const PhaseInformation = styled.div`
  display: flex;
  padding: 1rem 1.25rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--Oat-Medium, #eee);
  background: var(--Oat-Light, #f9f9f9);
`;

export const ParticipantInformation = styled.div`
  display: flex;
  padding: 1rem 1.25rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  max-width: 60rem;
  gap: 1.25rem;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--Oat-Medium, #e8e8e8);
  background: var(--Oat-Light, #f9f9f9);
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px 16px;
  width: 100%;
`;

export const InfoLabel = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 15px;
  font-style: normal;
  color: var(--Black-40, #959492);
  font-weight: 500;
`;

export const InfoValue = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 15px;
  font-style: normal;
  color: var(--Black-70, #4b4a49);
  font-weight: 500;
`;

export const PhaseTitle = styled.h2`
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  color: ${COLORS.black};
  line-height: normal;
`;

export const PhaseStats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  align-self: stretch;
`;

export const PhaseStatsLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: align-start;
  gap: 4px;
  display: inline;
`;

export const ParticipantTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-self: stretch;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 4fr;
  height: 41px;
  padding: 0.75rem 1.5rem;
  align-items: center;
  align-self: stretch;
  border-radius: 8px 8px 0 0;
  border-bottom: 2px solid var(--Oat-Medium, #eee);
  font-size: 14px;
  gap: 16px;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 4fr;
  height: 50px;
  padding: 0.75rem 1.5rem;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid var(--Oat-Medium, #eee);
  gap: 16px;

  &:hover {
    background-color: ${COLORS.oat_light};
  }
`;

export const TableCell = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: ${COLORS.black70};
  line-height: normal;
  display: flex;
  align-items: center;
`;

export const TableCellBold = styled(TableCell)`
  font-weight: 600;
  color: ${COLORS.black};
`;

export const Heading3 = styled.h3`
  font-family: ${Sans.style.fontFamily};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-style: normal;
  line-height: normal;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column; /* stack children vertically */
  gap: 1rem; /* now works! */
  background-color: ${COLORS.white};
  border-radius: 12px;
  width: 100%;
  border: none;
`;

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  justify-content: center;
`;

export const Button = styled.button<{ disabled?: boolean }>`
  display: flex;
  padding: 0.5rem 2rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: 4px;
  background: var(--Dark-Electric-Blue, #476c77);
  border: var(--Dark-Electric-Blue, #476c77);
  font-family: ${Sans.style.fontFamily};
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  color: ${COLORS.white};
  line-height: normal;
  letter-spacing: 0.2px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background-color 0.2s;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export const SilverText = styled.span`
  color: var(--Black-40, #959492);
  font-family: ${Sans.style.fontFamily};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const NormalText = styled.span`
  color: var(--Black-70, #4b4a49);
  /* Body 1 */
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
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

export const PromptWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 2.5rem;
  position: relative;
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

export const PromptAnswer = styled.div`
  display: flex;
  padding: 12px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--Black-20, #c7c6c3);
  background: var(--Oat-LM, #f5f5f5);
  font-family: ${Sans.style.fontFamily};
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
`;
