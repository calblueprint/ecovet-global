import { Button, Checkbox, TextField } from "@mui/material";
import { OptionsProps } from "./BuildPromptRenderer";
import { CheckboxPromptStyled, McqOptionStyled, TextFieldStyled, DeleteMcqOptionButton } from "./styles";

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

            <TextFieldStyled>
              <TextField
                size="small"
                placeholder="Enter option text"
                value={opt.option_text}
                onChange={e => updateOptionText?.(opt.option_number, e.target.value)}
              />
            </TextFieldStyled>

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

      <Button onClick={handleAddNewOption}>+ Add Option</Button>
    </CheckboxPromptStyled>
  );
}