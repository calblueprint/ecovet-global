"use client";

import { PromptWithOption } from "@/app/participants/session-flow/page";
import TextPromptParticipant from "@/app/participants/components/TextPromptParticipant";
import MultipleChoicePromptParticipant from "@/app/participants/components/MultipleChoicePromptParticipant";
import CheckboxPromptParticipant from "@/app/participants/components/CheckboxPromptParticipant";

type PromptRendererProps = {
  promptWithOption: PromptWithOption;
  answer: string | string[];
  onAnswer: (value: string | string[]) => void;
};

export default function PromptRenderer({
  promptWithOption,
  answer,
  onAnswer,
}: PromptRendererProps) {

  const { prompt, options } = promptWithOption;

  return (
    <div>
      <p>{prompt.prompt_text}</p>

      {prompt.prompt_type === "text" && (
        <TextPromptParticipant
          value={(answer as string) || ""}
          onChange={onAnswer}
        />
      )}

      {prompt.prompt_type === "multiple_choice" && (
        <MultipleChoicePromptParticipant
          options={options}
          value={(answer as string) || ""}
          onChange={onAnswer}
        />
      )}

      {prompt.prompt_type === "checkbox" && (
        <CheckboxPromptParticipant
          options={options}
          value={(answer as string[]) || []}
          onChange={onAnswer}
        />
      )}
    </div>
  );
}