"use client";

import type { Prompt, PromptOption } from "@/types/schema";
import type { ReactNode } from "react";
import { Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
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
  StyledTextArea,
} from "../styles";
import {
  CheckboxOptionParticipantStyled,
  CheckboxOptionTextStyled,
  CheckboxParticipantStyled,
  McqOptionParticipantStyled,
  McqOptionTextStyled,
  MultipleChoiceParticipantStyled,
} from "./styles";

interface PromptsRightPanelProps {
  prompts: Prompt[];
  answers: string[];
  optionsByPromptId: Record<string, PromptOption[]>;
  completedPrompts: Set<string>;
  phaseName: string;
  isOverview: boolean;
  onInputAnswer: (index: number, value: string) => void;
  onBlur: (index: number, value: string) => void;
  nextButton: ReactNode;
  backButton: ReactNode;
}

function parseCheckboxAnswer(raw: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function PromptsRightPanel({
  prompts,
  answers,
  optionsByPromptId,
  completedPrompts,
  phaseName,
  isOverview,
  onInputAnswer,
  onBlur,
  backButton,
  nextButton,
}: PromptsRightPanelProps) {
  const totalPrompts = prompts.length;
  const completedCount = Math.min(completedPrompts.size, totalPrompts);
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

  function renderAnswerInput(prompt: Prompt, index: number) {
    const promptOptions = optionsByPromptId[prompt.prompt_id] ?? [];
    const answer = answers[index];

    if (prompt.prompt_type === "multiple_choice") {
      const selectedId = typeof answer === "string" ? answer : "";
      return (
        <MultipleChoiceParticipantStyled>
          <RadioGroup
            value={selectedId}
            onChange={e => {
              onInputAnswer(index, e.target.value);
              onBlur(index, e.target.value);
            }}
            name={`mcq-${prompt.prompt_id}`}
          >
            {promptOptions.map(o => (
              <McqOptionParticipantStyled
                key={o.option_id}
                $selected={selectedId === o.option_id}
              >
                <FormControlLabel
                  value={o.option_id}
                  control={<Radio size="small" />}
                  label={
                    <McqOptionTextStyled $selected={selectedId === o.option_id}>
                      {o.option_text}
                    </McqOptionTextStyled>
                  }
                />
              </McqOptionParticipantStyled>
            ))}
          </RadioGroup>
        </MultipleChoiceParticipantStyled>
      );
    }

    if (prompt.prompt_type === "checkbox") {
      const selectedIds = parseCheckboxAnswer(answer ?? "");
      const toggle = (id: string) => {
        const set = new Set(selectedIds);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        const next = JSON.stringify(Array.from(set));
        onInputAnswer(index, next);
        onBlur(index, next);
      };
      return (
        <CheckboxParticipantStyled>
          {promptOptions.map(o => {
            const selected = selectedIds.includes(o.option_id);
            return (
              <CheckboxOptionParticipantStyled
                key={o.option_id}
                $selected={selected}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={selected}
                      onChange={() => toggle(o.option_id)}
                    />
                  }
                  label={
                    <CheckboxOptionTextStyled $selected={selected}>
                      {o.option_text}
                    </CheckboxOptionTextStyled>
                  }
                />
              </CheckboxOptionParticipantStyled>
            );
          })}
        </CheckboxParticipantStyled>
      );
    }

    return (
      <StyledTextArea
        value={typeof answer === "string" ? answer : ""}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onInputAnswer(index, e.target.value)
        }
        onBlur={() => onBlur(index, answer)}
        minRows={3}
        placeholder="Type your answer here..."
      />
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
              {renderAnswerInput(prompt, index)}
            </PromptWrapper>
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
