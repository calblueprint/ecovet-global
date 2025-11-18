import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";

//----------------------------------------------------------------------------------------
//-----------------------------------   TABS STYLING   -----------------------------------
//----------------------------------------------------------------------------------------
export const TabsHeader = styled(Flex).attrs({
  $justify: "between",
  $align: "end",
})`
  width: auto;
  margin-bottom: 8px;
  border-bottom: 2px solid #d9d9d9;
  padding-bottom: 10px;
`;

/* Left cluster: the tabs list + "+ New" */
export const TabsLeft = styled(Flex).attrs({ $align: "center", $gap: "8px" })``;

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
  color: #0f0f0f;

  width: 22px; /* compact square around "+" */
  height: 22px;
  border-radius: 4px;
  border: 1px dashed transparent;
  background: transparent;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
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
  gap: 12px;
`;

export const PhasesControl = styled(Flex).attrs({ $align: "center" })`
  display: inline-flex;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid ${COLORS.teal};
  border-radius: 4px;
  background: ${COLORS.white};
  user-select: none;
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
  width: 8px;
  height: 6px;
  line-height: 0;
  display: grid;
  place-items: center;
  color: ${COLORS.teal};

  border-color: transparent;
  background: transparent;
  cursor: pointer;

  transition:
    background 0.15s ease,
    transform 0.05s ease,
    border-color 0.15s;
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  width: auto;

  padding: 13px 18px;
  border-radius: 4px;
  background: ${COLORS.darkElectricBlue};
  color: ${COLORS.white};
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
  cursor: pointer;
`;

//----------------------------------------------------------------------------------------
//-----------------------------------   FORM STYLING   -----------------------------------
//----------------------------------------------------------------------------------------

/* Page section wrapper for a role's panel */
export const PanelCard = styled(Flex).attrs({ $direction: "column" })`
  // padding: 40px 100px 0 0;
  gap: 32px;
`;

/* Row with name input and remove button */
export const PanelHeaderRow = styled(Flex).attrs({
  $justify: "between",
  $align: "center",
})`
  margin-bottom: 8px;
`;

/* Simple text input (used for role name) */
export const NameInput = styled.input`
  padding: 6px 10px;
  border: 1px solid ${COLORS.black20};
  border-radius: 4px;
  outline: none;
  width: 320px;
  &:focus {
    border-color: ${COLORS.darkElectricBlue};
  }
`;

/* Ghosty small button */
export const GhostButton = styled.button`
  padding: 6px 10px;
  border: 1px solid ${COLORS.black20};
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
  &:hover {
    background: #f8f8f8;
  }
`;

/* Vertical form spacing */
export const FormStack = styled(Flex).attrs({
  $direction: "column",
  $gap: "40px",
})`
  padding-right: 150px;
`;

export const FieldCard = styled.fieldset`
  position: relative;
  border: 1px solid ${COLORS.black20};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
`;

export const PhaseCard = styled.div``;

export const PhaseHeader = styled(Flex).attrs({ $align: "center" })`
  gap: 4px;
  flex-wrap: nowrap;
  padding-bottom: 12px;
`;

export const RemovePhaseButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;

  flex: 0 0 auto; /* don't grow or shrink */
  padding: 0;
  background: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  font-size: 20px;
`;

export const RemoveQuestionButton = styled.button`
  border: 1px solid ${COLORS.black20};
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;

  padding: 4px 8px; /* tighter padding */
  line-height: 1; /* removes default tall line box */
  font-size: 14px; /* optional: consistent text sizing */
`;

/** Legend text */
export const FieldLegend = styled.legend`
  font-family: "Public Sans", system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #c7c6c3;
`;

export const QuestionCard = styled.fieldset`
  display: flex;
  position: relative;
  border: 1px solid ${COLORS.black20};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
`;
/* Big comfortable text area (used for description/prompts) */
export const BigInput = styled.input.attrs({ type: "text" })`
  width: calc(100% - 20px);
  margin: 10px;
  border: none;
  resize: none;
  font: inherit;
  line-height: 1.4;
  &:focus {
    outline: none;
    box-shadow: none;
    border-color: inherit;
  }
`;

/* Section heading like “Phase 1” */
export const SectionH2 = styled.h2`
  font-family: "Public Sans", system-ui, sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin: 0;

  /* key bits to stop growing */
  display: inline-flex; /* or inline-block */
  flex: 0 0 auto;
  width: max-content; /* or fit-content */
  white-space: nowrap;

  padding: 2px 8px;
  line-height: 1.1;
`;
