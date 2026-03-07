
import { TextField } from "@mui/material";
import { OptionsProps } from "./BuildPromptRenderer";

export default function TextPrompt({
  options,
  updateOptionText,
}: OptionsProps) {
  const value = options[0]?.option_text ?? "";

  return (
    <TextField
      value={value}
      placeholder="Type your answer here..."
      onChange={e => updateOptionText?.(1, e.target.value)}
    />
  );
}
