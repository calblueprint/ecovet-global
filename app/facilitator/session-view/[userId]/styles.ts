import { styled } from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const InfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: auto;
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  margin-top: 8px;
`;

export const OptionRow = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.6rem 0.7rem;
  border-radius: 0.6rem;
  background-color: ${({ $selected }) =>
    $selected ? COLORS.lightEletricBlue : COLORS.oat_light};
  border: 1px solid
    ${({ $selected }) => ($selected ? COLORS.darkElectricBlue : COLORS.black20)};

  span {
    font-family: ${Sans.style.fontFamily};
    font-size: 12px;
    font-weight: 500;
    line-height: 150%;
    color: ${({ $selected }) => ($selected ? COLORS.black100 : COLORS.black70)};
  }
`;

export const RadioCircle = styled.span<{ $selected: boolean }>`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid
    ${({ $selected }) =>
      $selected ? COLORS.darkElectricBlue : COLORS.oat_medium};
  background-color: ${COLORS.white};
  position: relative;

  ${({ $selected }) =>
    $selected &&
    `
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${COLORS.darkElectricBlue};
      }
    `}
`;

export const PromptCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 60rem;
  margin-right: 4rem;
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
  padding: 0.7rem 1rem;
  flex-direction: column;
  align-items: flex-start;
  line-height: 150%;
  border-radius: 0.6rem;
  border: 1px solid ${COLORS.black20};
  background: ${COLORS.oat_light};
  font-family: ${Sans.style.fontFamily};
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
`;

export const AnnouncementsPanel = styled.div`
  width: 280px;
  min-width: 280px;
  border-left: 1px solid var(--Oat-Medium, #eee);
`;

export const ContentDiv = styled.div`
  display: flex;
  padding: 5rem 0 0 14rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  flex: 1;
  overflow-y: auto;
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

export const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
`;
