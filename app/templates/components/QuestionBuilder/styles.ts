import { GroupBase, StylesConfig } from "react-select";
import { TextField } from "@mui/material";
import styled, { css } from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { Sans } from "@/styles/fonts";
import { B2, Caption, H3 } from "@/styles/text";
import { DropdownOption } from "@/types/dropdown";

export const selectStyles: StylesConfig<
  DropdownOption,
  boolean,
  GroupBase<DropdownOption>
> = {
  control: base => ({
    ...base,
    border: `1px solid ${COLORS.black}`,
  }),
  menu: base => ({
    ...base,
    border: `1px solid ${COLORS.black}`,
  }),
};

export const compactSelectStyles: StylesConfig<
  DropdownOption,
  boolean,
  GroupBase<DropdownOption>
> = {
  control: base => ({
    ...base,
    border: `1px solid ${COLORS.oat_dark}`,
    boxShadow: "none",
    "&:hover": {
      border: `1px solid ${COLORS.oat_dark}`,
    },
    fontSize: "0.625rem",
    minHeight: "32px",
  }),
  menu: base => ({
    ...base,
    border: `1px solid ${COLORS.black20}`,
    fontSize: "0.75rem",
  }),
  option: base => ({
    ...base,
    fontSize: "0.75rem",
  }),
  singleValue: base => ({
    ...base,
    fontSize: "0.75rem",
  }),
};

export const PhaseTemplateHeader = styled(H3)`
  color: ${COLORS.black100};
  font-weight: 700;
`;

export const RoleTemplateName = styled(B2)`
  color: ${COLORS.black70};
`;

export const RoleDescriptionTemplate = styled(B2)`
  color: ${COLORS.black40};
`;

export const QuestionRowStyled = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;

  width: 100%;
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
  $gap: "20px",
})``;

export const RoleHeader = styled(Flex)`
  justify-content: space-between;
  align-items: flex-end; /* Aligns the text block and buttons nicely */
`;

export const RoleHeaderContainer = styled(Flex).attrs({
  $direction: "column",
  $gap: "1rem",
})`
  padding-top: 1rem; /* Added padding so it looks good when sticky */
  padding-bottom: 1rem;
  border-bottom: 1px solid ${COLORS.oat_medium};

  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${COLORS.white};
`;

export const HeaderButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const HeaderButtonLight = styled.button`
  background: #e8ecef;
  color: #476c77;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: filter 0.15s ease;
  &:hover {
    filter: brightness(0.95);
  }
`;

export const HeaderButtonDark = styled.button`
  background: #476c77;
  color: #ffffff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: filter 0.15s ease;
  &:hover {
    filter: brightness(1.1);
  }
`;

export const FieldCard = styled.div<{ $focused?: boolean }>`
  display: flex;
  padding: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;

  border-radius: 0.5rem;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.oat_light};

  ${({ $focused }) =>
    $focused &&
    css`
      border-color: ${COLORS.mediumElectricBlue};
      border-width: 0.1rem;
      padding: 0.9rem;
    `}
`;

export const PhaseCard = styled.div`
  display: flex;
  gap: 2.5rem;
  flex-direction: column;
`;

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
export const FieldLegend = styled(B2)`
  color: ${COLORS.black70};
  font-weight: 700;
  line-height: 150%;
`;

export const LegendFlex = styled(Flex)`
  display: flex;
  justify-content: space-between;
`;

export const QuestionCard = styled.fieldset`
  display: flex;
  position: relative;
  border: 1px solid ${COLORS.black20};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
`;

export const BigInput = styled(TextField).attrs({
  multiline: true,
  minRows: 1,
  variant: "outlined",
})`
  display: flex;
  align-self: stretch;
  flex-shrink: 0;

  width: 70%;

  .MuiInputBase-root {
    padding: 10px 12px;
    font-size: 0.75rem;
    border-radius: 4px;
    border: 1px solid ${COLORS.oat_medium};
    background: ${COLORS.white};
  }

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  .MuiInputBase-input {
    padding: 0;
    font-size: 0.75rem;

    &::placeholder {
      color: ${COLORS.black40};
    }
  }
`;
// TODO: placeholder color not working

export const RolePhaseDescriptionInput = styled.input.attrs({ type: "text" })`
  width: 100%;
  padding: 10px 12px;
  font-size: 0.875rem;
  border-radius: 4px;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};
  color: ${COLORS.black70};

  &::placeholder {
    color: ${COLORS.black20};
  }

  &:focus {
    outline: 1px solid ${COLORS.black40};
  }
`;

export const TextFieldStyled = styled(TextField)`
  flex: 1;
  min-width: 0;
  height: fit-content;

  border-radius: 4px;
  border: 1px solid ${COLORS.oat_medium};
  background-color: ${COLORS.white};

  color: ${COLORS.black20};

  .MuiInputBase-input {
    font-size: 10px;
    font-family: ${Sans.style.fontFamily};
    font-weight: 500;
    color: ${COLORS.black70};
  }

  .MuiFormControl-root {
    width: 100%;
  }

  .MuiOutlinedInput-root {
    background-color: transparent;

    fieldset {
      border-width: 0; /* grey */
    }

    &:hover fieldset {
      border-color: #bdbdbd;
    }

    &.Mui-focused fieldset {
      border-color: #bdbdbd;
    }
  }
`;

export const PromptTypeDropdownStyled = styled.div`
  height: 100%;
`;

export const MultipleChoicePromptStyled = styled.div`
  width: 100%;
`;

export const McqOptionStyled = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 2px 0px;
  align-items: center;
`;

export const DeleteMcqOptionButton = styled.div`
  padding-right: 20px;
  padding-left: 30px;
  margin-left: auto;
`;

export const CheckboxPromptStyled = styled.div`
  width: 100%;
`;

export const AddNewOptionStyled = styled.div`
  display: flex;
  align-items: center;
  justify-contet: space-between;
  gap: 8px;
  align-self: stretch;
`;

export const AddNewOptionTextStyled = styled.div`
  font-family: ${Sans.style.fontFamily};
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: ${COLORS.darkElectricBlue};
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 4px;
  transition:
    opacity 0.15s,
    color 0.15s;
  align-self: center;

  &:hover {
    color: #e53e3e;
  }
`;

export const InsertQuestionRow = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1rem;
`;

export const InsertQuestionButton = styled.button`
  background: ${COLORS.darkElectricBlue};
  color: ${COLORS.white};
  border: none;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${COLORS.mediumElectricBlue};
  }
`;
