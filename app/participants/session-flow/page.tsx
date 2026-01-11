"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UUID } from "crypto";
import supabase from "@/actions/supabase/client";
import {
  createPromptAnswer,
  fetchPhases,
  fetchPrompts,
  fetchRole,
  fetchRolePhases,
} from "@/api/supabase/queries/sessions";
import { Phase, Prompt, RolePhase } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import NextButton from "../ParticipantNextButton";
import {
  Container,
  Main,
  ParticipantFlowMain,
  PhaseHeading,
  PromptCard,
  PromptText,
  RolePhaseDescription,
  StyledTextarea,
} from "./styles";

export default function ParticipantFlowPage() {
  const { userId } = useProfile();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;

  const [roleId, setRoleId] = useState<string | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [rolePhase, setRolePhase] = useState<RolePhase | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const isLastPhase = currentPhaseIndex === phases.length - 1;

  const currentPhase = phases[currentPhaseIndex];

  useEffect(() => {
    async function loadData() {
      if (!userId || !sessionId) return;

      setLoading(true);
      try {
        const phaseData = await fetchPhases(sessionId);
        setPhases(phaseData);
        console.log("Loaded phases:", phaseData);

        const fetchedRoleId = await fetchRole(userId, sessionId);
        setRoleId(fetchedRoleId as string);
      } catch (err) {
        console.error("Error loading session data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId, sessionId]);

  useEffect(() => {
    if (!currentPhase || !roleId) return;

    async function loadPhaseContent() {
      try {
        const rp = await fetchRolePhases(roleId as UUID, currentPhase.phase_id);
        setRolePhase(rp);

        if (rp) {
          const p = await fetchPrompts(rp.role_phase_id);
          setPrompts(p);
        } else {
          setPrompts([]);
        }
      } catch (err) {
        console.error("Error setting prompts:", err);
        setPrompts([]);
      }
    }

    loadPhaseContent();
  }, [currentPhase, roleId]);

  useEffect(() => {
    if (!userId || !sessionId) return;

    console.log(
      "Setting up Supabase subscription for participant session updates",
    );

    const channel = supabase
      .channel(`participant_session_updates_${userId}_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participant_session",
          filter: `session_id=eq.${sessionId}`,
        },
        payload => {
          console.log("Realtime payload received:", payload);

          const newPhaseIndex = payload.new.phase_index;
          console.log("New phase_index from DB:", newPhaseIndex);

          if (newPhaseIndex == null) return;

          const arrayIndex = newPhaseIndex - 1;
          console.log("Mapped to array index:", arrayIndex);

          setCurrentPhaseIndex(arrayIndex);
        },
      )
      .subscribe();

    return () => {
      console.log("Cleaning up Supabase subscription");
      supabase.removeChannel(channel);
    };
  }, [userId, sessionId, phases]);

  useEffect(() => {
    setAnswers(Array(prompts.length).fill(""));
  }, [prompts]);

  function handleInputAnswer(index: number, value: string) {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  }

  async function submitAnswers() {
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];

      if (!answer.trim()) continue;
      const promptId = prompts[i].prompt_id;

      if (!userId) continue;
      await createPromptAnswer(userId, promptId, answer);
    }
  }

  if (loading || !currentPhase) {
    console.log("Loading or currentPhase not yet available");
    return <div>Loading phases...</div>;
  }

  console.log("user id:", userId);
  console.log("session id:", sessionId);
  console.log("currentPhaseIndex:", currentPhaseIndex);

  return (
    <Main>
      <Container>
        <ParticipantFlowMain>
          <PhaseHeading>Phase {currentPhaseIndex + 1}</PhaseHeading>

          {rolePhase && (
            <RolePhaseDescription>
              Role description: {rolePhase.description}
            </RolePhaseDescription>
          )}

          <PromptCard>
            {prompts.map((prompt, index) => (
              <div key={index}>
                <PromptText>{prompt.prompt_text}</PromptText>

                <StyledTextarea
                  value={answers[index]}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputAnswer(index, e.target.value)
                  }
                  minRows={3}
                  placeholder="Type your answer..."
                />
              </div>
            ))}
          </PromptCard>

          {roleId && userId && sessionId && (
            <NextButton
              user_id={userId as UUID}
              role_id={roleId as UUID}
              session_id={sessionId as UUID}
              isLastPhase={isLastPhase}
              currentPhaseIndex={currentPhaseIndex}
              onClick={submitAnswers}
            />
          )}

          {currentPhaseIndex === phases.length && <div>End of phases</div>}
        </ParticipantFlowMain>
      </Container>
    </Main>
  );
}
