import { TextField } from "@mui/material";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const MultipleChoiceParticipantStyled = styled.div`
  display: flex;
  flex-direction: column;

  .MuiFormGroup-root {
    gap: 8px;
  }
`;

export const McqOptionParticipantStyled = styled.div<{ $selected: boolean }>`
  display: fit-content;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  background-color: ${COLORS.oat_light};

  background-color: ${({ $selected }) =>
    $selected ? COLORS.lightEletricBlue : COLORS.oat_light};
  border: 1px solid
    ${({ $selected }) => ($selected ? COLORS.darkElectricBlue : "transparent")};

  .MuiFormControlLabel-root {
    margin-left: 0;
    width: 100%;
  }

  .MuiRadio-root.Mui-checked {
    padding-left: 8px;
    color: ${({ $selected }) =>
      $selected ? COLORS.darkElectricBlue : COLORS.oat_medium};
  }
`;

export const McqOptionTextStyled = styled.span<{ $selected: boolean }>`
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: ${({ $selected }) => ($selected ? COLORS.black100 : COLORS.black70)};
  line-height: 150%; /* 18px */
  padding: 8px 0;
  width: 100%;
`;

export const CheckboxParticipantStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;

  .MuiFormGroup-root {
    gap: 8px;
  }
`;

export const CheckboxOptionParticipantStyled = styled.div<{
  $selected: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  background-color: ${({ $selected }) =>
    $selected ? COLORS.lightEletricBlue : COLORS.oat_light};
  border: 1px solid
    ${({ $selected }) => ($selected ? COLORS.darkElectricBlue : "transparent")};

  .MuiFormControlLabel-root {
    margin-left: 0;
    width: 100%;
  }

  .MuiCheckbox-root {
    padding-left: 8px;
  }

  .MuiCheckbox-root.Mui-checked {
    color: ${COLORS.darkElectricBlue};
  }
`;

export const CheckboxOptionTextStyled = styled.span<{ $selected: boolean }>`
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  padding: 8px 0;
  color: ${({ $selected }) => ($selected ? COLORS.black100 : COLORS.black70)};
`;

export const TextFieldParticpantsStyled = styled(TextField)`
  width: 100%;

  .MuiOutlinedInput-root {
    background-color: ${COLORS.white};
    border-radius: 8px;

    fieldset {
      border: 1px solid ${COLORS.black20}; // set here, not on root
    }

    &:hover fieldset {
      border-color: ${COLORS.black20};
    }

    &.Mui-focused fieldset {
      border-color: ${COLORS.black20};
      border-width: 1px; // MUI defaults to 2px on focus
    }
  }

  .MuiInputBase-input {
    font-size: 10px;
    font-family: ${Sans.style.fontFamily};
    font-weight: 500;
    color: ${COLORS.black70};
  }
`;
