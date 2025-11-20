import { OptionsProps } from "./BuildPromptRenderer";
import { TextPromptStyled } from "./styles";

export default function TextPrompt({ 
    options,
    updateOptionText
}: OptionsProps) {

    const value = options[0]?.option_text ?? "";

    return (
        <TextPromptStyled
            value={value}
            placeholder="User will type their answer here..."
            onChange={(e) => updateOptionText?.(0, e.target.value)}
        />
    );
}
