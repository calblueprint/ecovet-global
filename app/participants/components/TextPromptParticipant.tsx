import { TextField } from "@mui/material";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

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

type TextPromptParticipantProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function TextPromptParticipant({
  value,
  onChange,
}: TextPromptParticipantProps) {
  return (
    <TextFieldParticpantsStyled
      value={value}
      placeholder="Type your answer..."
      onChange={e => onChange(e.target.value)}
    />
  );
}
