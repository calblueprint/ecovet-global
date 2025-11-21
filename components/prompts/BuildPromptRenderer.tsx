'use client'
import { useState, useEffect } from "react";
import { PromptRendererStyled, QuestionHeader } from "./styles";
import { PromptType, PromptOption } from "@/types/schema";
import TextPrompt from "./TextPrompt";
import MultipleChoicePrompt from "./MultipleChoicePrompt";
import CheckboxPrompt from "./CheckboxPrompt";

// Options staged in state, only converted to PromptOptions on submit
export type StagedOption = {
    option_number: number;
    option_text: string;
}

type PromptRendererProps = {
    prompt_id: number;
    onUpdate: (prompt_id: number, data: { 
        question: string;
        promptType: PromptType; 
        options: StagedOption[];
    }) => void;
};
export interface OptionsProps {
    options: StagedOption[];
    updateOptionText: (option_number: number, text: string) => void;
    addNewOption?: (newText: string) => void;
    deleteOption?: (option_number: number) => void;
}

export default function PromptRenderer ({
    prompt_id, 
    onUpdate,
    }: PromptRendererProps ) {
    const [promptType, setPromptType] = useState<PromptType>('text');
    const [options, setOptions] = useState<StagedOption[]>([]);
    const [question, setQuestion] = useState('Untitled Question');

    // Notify parent whenever prompt state changes
    useEffect(() => {
        onUpdate(prompt_id, { question, promptType, options });
    }, [question, promptType, options]);

    function handleChangePromptType(newType: PromptType) {
        // clear all options
        setOptions([])

        // set new prompt type
        setPromptType(newType);
    }

    function addNewOption(newText: string) {
    setOptions(prev => [
        ...prev,
        {
        option_number: prev.length + 1,
        option_text: newText,
        }
    ]);
    }

    function deleteOption(option_number: number) {
        setOptions(prev =>
        prev
            .filter(o => o.option_number !== option_number)
            .map((o, i) => ({ ...o, option_number: i + 1 })) // reindex
        );
    }

    function updateOptionText(option_number: number, text: string) {
        setOptions(prev =>
        prev.map(o => 
            o.option_number === option_number 
            ? { ...o, option_text: text }
            : o
        )
        );
    }

    const optionsField =
        promptType === "text" ? (
        <TextPrompt 
            options={options} 
            updateOptionText={updateOptionText} 
        />
        ) : promptType === "multiple_choice" ? (
        <MultipleChoicePrompt
            options={options}
            addNewOption={addNewOption}
            deleteOption={deleteOption}
            updateOptionText={updateOptionText}
        />
        ) : (
        <CheckboxPrompt
            options={options}
            addNewOption={addNewOption}
            deleteOption={deleteOption}
            updateOptionText={updateOptionText}
        />
        );

    return (
        <PromptRendererStyled>
        <QuestionHeader 
            type="text" 
            value={question} 
            onChange={(e) => setQuestion(e.target.value)}
        />

        <select value={promptType} onChange={e => handleChangePromptType(e.target.value as PromptType)}>
            <option value="text">Text</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="checkbox">Checkbox</option>
        </select>

        {optionsField}
        </PromptRendererStyled>
    );
}