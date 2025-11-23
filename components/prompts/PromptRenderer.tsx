"use client";

// Just leaving this here for future reference when we need to render prompts for participants.
import { useEffect, useState } from "react";
import { UUID } from "crypto";
import { getOptionsForPrompt } from "@/actions/supabase/queries/prompt";
import { PromptOption, PromptType } from "@/types/schema";

// import CheckboxPrompt from "./CheckboxPrompt";
// import MultipleChoicePrompt from "./MultipleChoicePrompt";
// import { PromptRendererStyled, QuestionHeader } from "./styles";
// import TextPrompt from "./TextPrompt";

type PromptRendererProps = {
  prompt_id: UUID;
  prompt_type: PromptType;
  question: string;
};

export interface OptionsProps {
  options: PromptOption[];
}

export default function PromptRenderer({
  prompt_id,
  prompt_type,
  question,
}: PromptRendererProps) {
  const [options, setOptions] = useState<PromptOption[]>([]);

  // pull prompt options
  async function loadPromptOptions() {
    const pulled_options = await getOptionsForPrompt(prompt_id);
    setOptions(pulled_options ?? []);
  }

  useEffect(() => {
    loadPromptOptions();
  }, [prompt_id]);

  //   const optionsField =
  //     prompt_type === "text" ? (
  //       <TextPrompt options={options} />
  //     ) : prompt_type === "multiple_choice" ? (
  //       <MultipleChoicePrompt options={options} />
  //     ) : (
  //       <CheckboxPrompt options={options} />
  //     );

  return (
    // <PromptRendererStyled>
    //   <QuestionHeader>{question}</QuestionHeader>
    //   {optionsField}
    // </PromptRendererStyled>
    <></>
  );
}
