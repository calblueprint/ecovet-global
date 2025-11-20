import { OptionsProps } from "./BuildPromptRenderer";
import { MultipleChoicePromptStyled } from "./styles";

export default function MultipleChoicePrompt ({ 
    options,
    addNewOption,
    deleteOption, 
    toggleCorrect,
    updateOptionText,
}: OptionsProps) {

    function handleAddNewOption() {
        addNewOption?.("");  // new empty option
    }

    return (
        <MultipleChoicePromptStyled>
            <button onClick={handleAddNewOption}>
                + Add Option
            </button>

            {options.map(opt => (
                <div 
                key={opt.option_number} 
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >

                {/* Correct answer selector (radio) */}
                <input
                    type="radio"
                    name="mcq-correct"
                    checked={opt.is_correct === true}
                    onChange={() => toggleCorrect?.(opt.option_number)}
                />

                {/* Option text */}
                <input
                    value={opt.option_text}
                    placeholder="Enter option text"
                    onChange={(e) => updateOptionText?.(opt.option_number, e.target.value)}
                />

                {/* Delete option */}
                <button onClick={() => deleteOption?.(opt.option_number)}>
                    Delete
                </button>
                </div>
            ))}
        </MultipleChoicePromptStyled>
    );
}