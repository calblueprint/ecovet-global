"use client";

import { useState } from "react";
import { useProfile } from "@/utils/ProfileProvider";
import {
  PromptCard,
  ParticipantFlowMain,
  PhaseHeading,
  PromptText,
  RolePhaseDescription,
  StyledTextarea,
  Container,
  Main,
  Button
} from "./styles";
import { createPromptAnswer } from "@/api/supabase/queries/sessions";

export default function ParticipantFlow() {
  const { userId } = useProfile();
  const phaseNumber = 1;
  const rolePhaseDescription = "description description descripoton ";

  const dummyPrompts = [
    "question 1",
    "question 2",
    "question 3"
  ];

  const dummyPromptIds = [
    '00eae773-098f-4f98-989a-67b764ce2513',
    '0ac0db78-a5cc-43e9-a9a8-9e1103dfa109',
    '99eb19df-1d3f-4290-8744-32ac7d038c59'
  ]

  const [answers, setAnswers] = useState<string[]>(
    Array(dummyPrompts.length).fill("")
  );

  function handleInputAnswer(index: number, value: string) {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  }

  async function submitAnswers() {
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];

      if (!answer.trim()) continue;
      const promptId = dummyPromptIds[i];

    if (!userId) continue;
      await createPromptAnswer(
        userId,
        promptId,
        answer
      );

    }
  }

  return (
    <Main>
    <Container>
    <ParticipantFlowMain>
      <PhaseHeading>Phase {phaseNumber}</PhaseHeading>
      <RolePhaseDescription>
        role phase description: {rolePhaseDescription}
      </RolePhaseDescription>
      <PromptCard>
      {dummyPrompts.map((prompt, index) => (
        <div key={index}>
          <PromptText>{prompt}</PromptText>

          <StyledTextarea
            value={answers[index]}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputAnswer(index, e.target.value)}
            minRows={3}
            placeholder="Type your answer..."
          />
        </div>
      ))}
      </PromptCard>

      <Button onClick={submitAnswers}>Next</Button>
    </ParticipantFlowMain>
    </Container>
    </Main>
  );
}
