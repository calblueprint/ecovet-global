"use client";

import CheckboxPromptParticipant from "@/app/participants/components/CheckboxPromptParticipant";
import MultipleChoicePromptParticipant from "@/app/participants/components/MultipleChoicePromptParticipant";
import TextPromptParticipant from "@/app/participants/components/TextPromptParticipant";
import { PromptWithOption } from "@/app/participants/session-flow/page";
import {
  PromptQuestionArrowStyled,
  PromptQuestionContentStyled,
  PromptQuestionContentTitledStyled,
  PromptQuestionStyled,
} from "../session-flow/styles";

type PromptRendererProps = {
  index: number;
  promptWithOption: PromptWithOption;
  answer: string | string[];
  onAnswer: (value: string | string[]) => void;
};

export default function PromptRenderer({
  index,
  promptWithOption,
  answer,
  onAnswer,
}: PromptRendererProps) {
  const { prompt, options } = promptWithOption;

  const arrowString: string = "->";

  return (
    <PromptQuestionStyled>
      <PromptQuestionArrowStyled>
        {index + 1} {arrowString}{" "}
      </PromptQuestionArrowStyled>

      <PromptQuestionContentStyled>
        <PromptQuestionContentTitledStyled>
          {prompt.prompt_text}
        </PromptQuestionContentTitledStyled>

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
      </PromptQuestionContentStyled>
    </PromptQuestionStyled>
  );
}
