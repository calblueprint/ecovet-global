import styled from "styled-components";
import { Box, Flex } from "@/styles/containers";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const TabsHeader = styled(Flex).attrs({
  $justify: "between",
  $align: "center",
})`
  width: auto;
  margin-bottom: 8px;
`;

/* Left cluster: the tabs list + "+ New" */
export const TabsLeft = styled(Flex).attrs({ $align: 'center', $gap: "8px" })`
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;

  font-family: "Public Sans", system-ui, sans-serif;
  font-size: 11px;
  line-height: normal;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#0F0F0F" : "#4B4A49")};
  background: transparent;
  border: none;
  cursor: pointer;

  /* Add space for the orange line */
  padding: 8px 12px 8px 12px; /* extra left padding */

  transition: color 0.15s ease;

  &:hover {
    color: ${({ $active }) => ($active ? "#0F0F0F" : "#3f3e3d")};
  }

  &:focus-visible {
    outline: 2px solid ${COLORS.darkElectricBlue};
    outline-offset: 2px;
  }

  /* Orange line on the far left, inside padding */
  &::before {
    content: "";
    display: ${({ $active }) => ($active ? "block" : "none")};
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 19px;
    border-radius: 1px;
    background: ${COLORS.orange};
  }
`;

export const NewTabButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-family: "Public Sans", system-ui, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #0F0F0F;

  width: 22px;        /* compact square around "+" */
  height: 22px;
  border-radius: 4px;
  border: 1px dashed transparent;
  background: transparent;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;
`;

/* Divider under tabs */
export const TabsDivider = styled.div`
  width: 100%;
  height: 2px;
  background: #d9d9d9;
  flex-shrink: 0;
`;

/* Right cluster: phase count + up/down */
export const TabsRight = styled(Flex).attrs({ $align: "center", $gap: "8px" })`
    width: auto;
`;

export const PhasesControl = styled(Flex).attrs({ $align: "center" })`
  display: inline-flex;                 /* stay as small as its contents */
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid ${COLORS.teal};
  border-radius: 4px;
  background: ${COLORS.white};
  user-select: none;                    /* avoid text selection while clicking */
`;

/** “Phases:” label */
export const PhasesLabel = styled.span`
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;  
    color: ${COLORS.teal};
`;

export const PhasesCount = styled.span`
    text-align: right;
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;  
    color: ${COLORS.teal};
`;

/** Vertical arrow group */
export const PhasesStepper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

/** Arrow button */
export const StepButton = styled.button`
  width: 11px;
  height: 8px;
  line-height: 0;
  display: grid;
  place-items: center;
  color: ${COLORS.teal};

  border-color: transparent;
  background: transparent;
  cursor: pointer;

  transition: background 0.15s ease, transform 0.05s ease, border-color 0.15s;
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;