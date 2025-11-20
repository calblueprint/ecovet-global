'use client'

import { UUID } from "crypto";
import { useState, useEffect } from "react";
import { PromptRendererStyled, QuestionHeader } from "./styles";
import { PromptType, PromptOption } from "@/types/schema";
import { getOptionsForPrompt } from "@/actions/supabase/queries/prompt";
import TextPrompt from "./TextPrompt";
import MultipleChoicePrompt from "./MultipleChoicePrompt";
import CheckboxPrompt from "./CheckboxPrompt";

type PromptRendererProps = {
    prompt_id: UUID;
    prompt_type: PromptType;
    question: string;
}

export interface OptionsProps {
    options: PromptOption[]
}

export default function PromptRenderer ({
    prompt_id, 
    prompt_type, 
    question
    }: PromptRendererProps ) {
    const [options, setOptions] = useState<PromptOption[]>([]);

    // pull prompt options
    async function loadPromptOptions() {
        const pulled_options = await getOptionsForPrompt(prompt_id);
        setOptions(pulled_options ?? []);
    }

    useEffect(() => {
        loadPromptOptions();
    }, [prompt_id]);

      const optionsField =
        prompt_type === "text" ? (
        <TextPrompt options={options} />
        ) : prompt_type === "multiple_choice" ? (
        <MultipleChoicePrompt options={options} />
        ) : (
        <CheckboxPrompt options={options} />
        );

    return (
        <PromptRendererStyled>
            <QuestionHeader>{question}</QuestionHeader>
            {optionsField}
        </PromptRendererStyled>
    );
}