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
  phaseInd: number;
  isOverview: boolean;
  onInputAnswer: (index: number, value: string) => void;
  onBlur: (index: number) => void;
  nextButton: ReactNode;
}

export default function PromptsRightPanel({
  prompts,
  answers,
  completedPrompts,
  phaseInd,
  isOverview,
  onInputAnswer,
  onBlur,
  nextButton,
}: PromptsRightPanelProps) {
  const totalPrompts = prompts.length;
  const completedCount = completedPrompts.size;
  const progressPercentage =
    totalPrompts > 0 ? Math.round((completedCount / totalPrompts) * 100) : 0;

  if (isOverview) {
    return (
      <ContentDiv>
        <PhaseHeading>Get Ready</PhaseHeading>
        <PromptText>
          Read the scenario overview on the left, then click Continue to begin
          Phase 1.
        </PromptText>
      </ContentDiv>
    );
  }

  return (
    <ContentDiv>
      <PhaseHeading>Phase {phaseInd + 1}</PhaseHeading>

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

      <ContinueButtonDiv>{nextButton}</ContinueButtonDiv>
    </ContentDiv>
  );
}
