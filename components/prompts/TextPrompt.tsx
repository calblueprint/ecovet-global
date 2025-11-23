import TextareaAutosize from "@mui/material/TextareaAutosize";
import { OptionsProps } from "./BuildPromptRenderer";

export default function TextPrompt({
  options,
  updateOptionText,
}: OptionsProps) {
  const value = options[0]?.option_text ?? "";

  return (
    <TextareaAutosize
      value={value}
      placeholder="User will type their answer here..."
      onChange={e => updateOptionText?.(1, e.target.value)}
    />
  );
}
