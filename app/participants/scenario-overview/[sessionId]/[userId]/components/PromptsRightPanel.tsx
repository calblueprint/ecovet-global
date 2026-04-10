"use client";

import type { Prompt } from "@/types/schema";
import type { ReactNode } from "react";
import {
  ContentDiv,
  ContinueButtonDiv,
  FollowUpItem,
  FollowUpList,
  PhaseHeading,
  PromptCard,
  PromptQuestionNumber,
  PromptQuestionText,
  PromptText,
  PromptWrapper,
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
}

export default function PromptsRightPanel({
  prompts,
  answers,
  completedPrompts,
  phaseName,
  isOverview,
  onInputAnswer,
  onBlur,
  nextButton,
}: PromptsRightPanelProps) {
  const totalPrompts = prompts.length;
  const completedCount = completedPrompts.size;
  const progressPercentage =
    totalPrompts > 0 ? Math.round((completedCount / totalPrompts) * 100) : 0;

  function renderFollowUps(followUps: string | null | undefined) {
    if (!followUps) return null;
    const lines = followUps.split("\n").filter(line => line.trim() !== "");
    if (lines.length === 0) return null;
    return (
      <FollowUpList>
        {lines.map((line, i) => (
          <FollowUpItem key={i}>{line}</FollowUpItem>
        ))}
      </FollowUpList>
    );
  }

  return (
    <ContentDiv>
      <PhaseHeading>Questions</PhaseHeading>

      <PromptQuestionText>
        Progress: {completedCount} / {totalPrompts} completed (
        {progressPercentage}%)
      </PromptQuestionText>

      <PromptCard>
        {prompts.length === 0 ? (
          <PromptText>No prompts for this phase.</PromptText>
        ) : (
          prompts.map((prompt, index) => (
            <PromptWrapper key={prompt.prompt_id}>
              <PromptQuestionNumber>{index + 1} →</PromptQuestionNumber>
              <PromptQuestionText>{prompt.prompt_text}</PromptQuestionText>
              {renderFollowUps(prompt.prompt_follow_ups)}
              <StyledTextarea
                value={answers[index] ?? ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onInputAnswer(index, e.target.value)
                }
                onBlur={() => onBlur(index)}
                minRows={3}
                placeholder="Type your answer here..."
              />
            </PromptWrapper>
          ))
        )}
      </PromptCard>

      <ContinueButtonDiv>{nextButton}</ContinueButtonDiv>
    </ContentDiv>
  );
}
