"use client";

import type {
  Phase,
  Prompt,
  PromptAnswer,
  RolePhase,
  UUID,
} from "@/types/schema";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  createPromptAnswer,
  fetchMostRecentPhase,
  fetchPhases,
  fetchPromptResponses,
  fetchPrompts,
  fetchRole,
  fetchRolePhases,
  isSessionAsync,
} from "@/actions/supabase/queries/sessions";
import { useProfile } from "@/utils/ProfileProvider";
import NextButton from "../components/ParticipantNextButton";
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
  const [completedPrompts, setCompletedPrompts] = useState<Set<string>>(
    new Set(),
  );
  const [isAsync, setIsAsync] = useState(false);

  // DT: We use a set to store the index of prompts that hvae been completed (defined by blurred)
  const totalPrompts = prompts.length;
  const completedCount = completedPrompts.size;
  const progressPercentage =
    totalPrompts > 0 ? Math.round((completedCount / totalPrompts) * 100) : 0;
  const isLastPhase = currentPhaseIndex === phases.length - 1;

  const currentPhase = phases[currentPhaseIndex];

  useEffect(() => {
    async function loadData() {
      if (!userId || !sessionId) return;

      setLoading(true);
      try {
        const [
          phaseData,
          fetchedRoleId,
          mostRecentPhaseIndex,
          isCurrentSessionAsync,
        ] = await Promise.all([
          fetchPhases(sessionId),
          fetchRole(userId, sessionId),
          fetchMostRecentPhase(userId, sessionId),
          isSessionAsync(sessionId),
        ]);

        setPhases(phaseData);
        setRoleId(fetchedRoleId as string);
        setCurrentPhaseIndex(mostRecentPhaseIndex);
        setIsAsync(isCurrentSessionAsync);
        console.log("Loaded phases:", phaseData);
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
    if (!userId || !sessionId || !rolePhase || prompts.length === 0) return;

    async function loadResponses() {
      if (!userId || !sessionId || !rolePhase) return;

      try {
        const mostRecentPhaseIndex = await fetchMostRecentPhase(
          userId,
          sessionId,
        );
        console.log(
          "currentPhaseIndex ",
          currentPhaseIndex,
          "mostRecentPhaseIndex ",
          mostRecentPhaseIndex,
        );

        if (currentPhaseIndex < mostRecentPhaseIndex) {
          const responses = await fetchPromptResponses(
            userId,
            sessionId,
            rolePhase.phase_id,
          );

          console.log("responses ", responses);

          if (!responses) return;

          const ordered = sortResponsesByPromptOrder(prompts, responses);
          const answerStrings = ordered.map(r => r?.prompt_answer ?? "");
          setAnswers(answerStrings);
        }
      } catch (err) {
        console.error("Response load failed:", err);
      }
    }

    loadResponses();
  }, [userId, sessionId, rolePhase, prompts, currentPhaseIndex]);

  function sortResponsesByPromptOrder(
    prompts: Prompt[],
    responses: PromptAnswer[],
  ) {
    const responseMap = new Map(responses.map(r => [r.prompt_id, r]));

    return prompts.map(prompt => responseMap.get(prompt.prompt_id) ?? null);
  }

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

          const arrayIndex = newPhaseIndex;
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
    setCompletedPrompts(new Set());
  }, [prompts]);

  function handleInputAnswer(index: number, value: string) {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  }

  async function submitAnswers() {
    if (!userId || !sessionId) return;
    const updatedCompletedPrompts = new Set(completedPrompts);

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const promptId = prompts[i].prompt_id;

      if (!answer.trim()) continue;
      updatedCompletedPrompts.add(promptId);

      await createPromptAnswer(
        userId,
        sessionId!,
        currentPhase.phase_id,
        promptId,
        answer,
      );
    }
    setCompletedPrompts(updatedCompletedPrompts);
  }

  async function saveAnswers() {
    if (!userId || !sessionId) return;
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];

      if (!answer.trim()) continue;
      const promptId = prompts[i].prompt_id;

      if (!userId) continue;
      await createPromptAnswer(
        userId,
        promptId,
        answer,
        sessionId,
        currentPhase.phase_id,
      );
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
          <div>
            Progress: {completedCount} / {totalPrompts} completed (
            {progressPercentage}%)
          </div>
          <PromptCard>
            {prompts.map((prompt, index) => (
              <div key={prompt.prompt_id}>
                <PromptText>{prompt.prompt_text}</PromptText>

                <StyledTextarea
                  value={answers[index]}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputAnswer(index, e.target.value)
                  }
                  onBlur={async () => {
                    const value = answers[index]?.trim();
                    if (!value || !userId || !sessionId) return;
                    const promptId = prompts[index].prompt_id;

                    await createPromptAnswer(
                      userId,
                      promptId,
                      value,
                      sessionId,
                      currentPhase.phase_id,
                    );

                    setCompletedPrompts(prev => {
                      const updated = new Set(prev);
                      updated.add(promptId);
                      return updated;
                    });
                  }}
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
              is_async={isAsync}
              isLastPhase={isLastPhase}
              currentPhaseIndex={currentPhaseIndex}
              phase_id={currentPhase.phase_id as UUID}
              onClick={submitAnswers}
            />
          )}

          {currentPhaseIndex === phases.length && <div>End of phases</div>}
        </ParticipantFlowMain>
      </Container>
    </Main>
  );
}
