"use client";

import type { Prompt } from "@/types/schema";
import type { ReactNode } from "react";
import {
  ContentDiv,
  ContinueButtonDiv,
  PhaseHeading,
  PromptCard,
  PromptText,
  StyledTextarea,
} from "../styles";

interface PromptsRightPanelProps {
  prompts: Prompt[];
  answers: string[];
  completedPrompts: Set<string>;
  phaseName: string;
  isOverview: boolean;
  onInputAnswer: (index: number, value: string) => void;
  onBlur: (index: number) => void;
  nextButton: ReactNode;
  backButton: ReactNode;
}

export default function PromptsRightPanel({
  prompts,
  answers,
  completedPrompts,
  phaseName,
  isOverview,
  onInputAnswer,
  onBlur,
  backButton,
  nextButton,
}: PromptsRightPanelProps) {
  const totalPrompts = prompts.length;
  const completedCount = completedPrompts.size;
  const progressPercentage =
    totalPrompts > 0 ? Math.round((completedCount / totalPrompts) * 100) : 0;

  return (
    <ContentDiv>
      <PhaseHeading>{phaseName}</PhaseHeading>

      <div>
        Progress: {completedCount} / {totalPrompts} completed (
        {progressPercentage}%)
      </div>

      <PromptCard>
        {prompts.length === 0 ? (
          <PromptText>No prompts for this phase.</PromptText>
        ) : (
          prompts.map((prompt, index) => (
            <div key={prompt.prompt_id}>
              <PromptText>{prompt.prompt_text}</PromptText>
              <StyledTextarea
                value={answers[index] ?? ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onInputAnswer(index, e.target.value)
                }
                onBlur={() => onBlur(index)}
                minRows={3}
                placeholder="Type your answer..."
              />
            </div>
          ))
        )}
      </PromptCard>

      <ContinueButtonDiv>
        {backButton}
        {nextButton}
      </ContinueButtonDiv>
    </ContentDiv>
  );
}
