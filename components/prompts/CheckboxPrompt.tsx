import { Button, Checkbox } from "@mui/material";
import { OptionsProps } from "./BuildPromptRenderer";
import {
  AddNewOptionStyled,
  AddNewOptionTextStyled,
  CheckboxPromptStyled,
  DeleteMcqOptionButton,
  McqOptionStyled,
  TextFieldStyled,
} from "./styles";

export default function CheckboxPrompt({
  options,
  addNewOption,
  deleteOption,
  updateOptionText,
}: OptionsProps) {
  function handleAddNewOption() {
    addNewOption?.("");
  }

  return (
    <CheckboxPromptStyled>
      {options.map(opt => (
        <div key={opt.option_number}>
          <McqOptionStyled>
            <Checkbox />

            <TextFieldStyled
              size="small"
              placeholder="Enter option text"
              value={opt.option_text}
              onChange={e =>
                updateOptionText?.(opt.option_number, e.target.value)
              }
            />

            <DeleteMcqOptionButton>
              <Button
                color="error"
                onClick={() => deleteOption?.(opt.option_number)}
              >
                Delete
              </Button>
            </DeleteMcqOptionButton>
          </McqOptionStyled>
        </div>
      ))}

      <Button onClick={handleAddNewOption} sx={{ textTransform: "none" }}>
        <AddNewOptionStyled>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <rect y="4.44434" width="10" height="1.11111" fill="#476C77" />
            <rect
              x="5.55566"
              width="10"
              height="1.11111"
              transform="rotate(90 5.55566 0)"
              fill="#476C77"
            />
          </svg>
          <AddNewOptionTextStyled>Add Option</AddNewOptionTextStyled>
        </AddNewOptionStyled>
      </Button>
    </CheckboxPromptStyled>
  );
}
