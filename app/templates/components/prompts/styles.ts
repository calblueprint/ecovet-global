import { TextField } from "@mui/material";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const PromptRendererStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${COLORS.oat_medium};
  background-color: ${COLORS.oat_light};

  ]color: var(--Black-100, #0f0f0f);
  font-family: "Public Sans";
  font-style: normal;
  line-height: normal;
`;

export const QuestionNumberStyled = styled.div`
  color: ${COLORS.black70};
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 18px */
`;

export const QuestionHeaderStyled = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between
  width: 100%;
  gap: 12px;
  box-sizing: border-box;
  font-family: ${Sans.style.fontFamily};

  .MuiFormControl-root {
    width: 100%;
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
