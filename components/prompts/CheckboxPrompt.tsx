import { OptionsProps } from "./BuildPromptRenderer";
import { CheckboxPromptStyled } from "./styles";
import { UUID } from "crypto";

export default function CheckboxPrompt ({ 
    options,
    addNewOption,
    deleteOption, 
    updateOptionText, 
}: OptionsProps) {

    function handleAddNewOption() {
        addNewOption?.("New option");
    }

    return (
        <CheckboxPromptStyled>
            <button onClick={handleAddNewOption}>
                + Add Option
            </button>

            {options.map(opt => (
                <div 
                    key={opt.option_number}
                    style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                    <input 
                        type="checkbox"
                        // checked={opt.is_correct}
                        // onChange={() => toggleCorrect?.(opt.option_number)}
                    />

                    <input
                        value={opt.option_text}
                        placeholder="Enter option text"
                        onChange={(e) => updateOptionText?.(opt.option_number, e.target.value)}
                    />

                    <button 
                        onClick={() => deleteOption?.(opt.option_number)}
                        style={{ marginLeft: "8px" }}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </CheckboxPromptStyled>
    );
}
