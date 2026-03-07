import { Button, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import { Sans } from "@/styles/fonts";
import COLORS from "@/styles/colors";

export const PromptRendererStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    width: 100%;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid var(${COLORS.oat_medium}, #EEE);
    background: var(${COLORS.oat_light}, #F9F9F9);

]   color: var(--Black-100, #0F0F0F);
    font-family: "Public Sans";
    font-style: normal;
    line-height: normal;
`;

export const QuestionNumberStyled = styled.div`
    color: var(--Black-70, #4B4A49);
    font-family: ${Sans.style.fontFamily};
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 18px */
`;

export const QuestionHeaderStyled = styled.div`
    display: flex;
    align-items: center;
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
    min-width: 0; /* critical: prevents flex item from overflowing */

    border-radius: 4px;
    border: 1px solid var(${COLORS.oat_medium}, #EEE);
    background: var(${COLORS.oat_light}, #FFF);

    color: var(${COLORS.black20}, #C7C6C3);

    .MuiInputBase-input {
        font-size: 10px;
        font-family: ${Sans.style.fontFamily};
        font-weight: 500;
        color: var(--Black-20, #C7C6C3);
    }


    .MuiFormControl-root {
        width: 100%;
    }
    
    .MuiOutlinedInput-root {
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
`;

export const McqOptionStyled = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 8px 0px;
`;


export const DeleteMcqOptionButton = styled.div`
    padding-right: 20px;
    padding-left: 30px;
`;

export const CheckboxPromptStyled = styled.div``;

export const AddNewOptionStyled = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;
`;

export const AddNewOptionTextStyled = styled.div`
    font-family: ${Sans.style.fontFamily};
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    color: var(${COLORS.darkElectricBlue}, #476C77);
`;

