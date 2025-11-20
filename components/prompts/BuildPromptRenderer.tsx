'use client'

import { UUID } from "crypto";
import { useState, useEffect } from "react";
import { PromptRendererStyled, QuestionHeader } from "./styles";
import { PromptType, PromptOption } from "@/types/schema";
import { getOptionsForPrompt } from "@/actions/supabase/queries/prompt";
import TextPrompt from "./TextPrompt";
import MultipleChoicePrompt from "./MultipleChoicePrompt";
import CheckboxPrompt from "./CheckboxPrompt";

// Options staged in state, only converted to PromptOptions on submit
export type StagedOption = {
    option_number: number;
    option_text: string;
    is_correct?: boolean;    // used for MCQ/Checkbox
}

type PromptRendererProps = {
    prompt_id: UUID;
    onUpdate: (prompt_id: UUID, data: { 
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
    toggleCorrect?: (option_number: number) => void;
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
        is_correct: false,
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

    function toggleCorrect(option_number: number) {
        if (promptType === "multiple_choice") {
        // only one correct
        setOptions(prev =>
            prev.map(o => ({
            ...o,
            is_correct: o.option_number === option_number
            }))
        );
        } else {
        // checkbox: many correct
        setOptions(prev =>
            prev.map(o =>
            o.option_number === option_number
                ? { ...o, is_correct: !o.is_correct }
                : o
            )
        );
        }
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
            toggleCorrect={toggleCorrect}
        />
        ) : (
        <CheckboxPrompt
            options={options}
            addNewOption={addNewOption}
            deleteOption={deleteOption}
            updateOptionText={updateOptionText}
            toggleCorrect={toggleCorrect}
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