"use client";

import type {
  Phase,
  Prompt,
  PromptAnswer,
  PromptOption,
  RolePhase,
  UUID,
} from "@/types/schema";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import { getOptionsForPrompt } from "@/actions/supabase/queries/prompt";
import {
  createPromptAnswer,
  deletePromptAnswers,
  fetchMostRecentPhase,
  fetchPhases,
  fetchPromptResponses,
  fetchPrompts,
  fetchRole,
  fetchRolePhases,
} from "@/actions/supabase/queries/sessions";
import PromptRenderer from "@/app/participants/components/PromptRenderer";
import { useProfile } from "@/utils/ProfileProvider";
import NextButton from "../components/ParticipantNextButton";
import {
  BodyTextStyled,
  Container,
  ContextStyled,
  Main,
  ParticipantFlowMain,
  PhaseContextStyled,
  PhaseHeading,
  PromptCard,
  PromptQuestionTitleStyled,
  ScenarioOverviewFieldsStyled,
  ScenarioOverviewStyled,
  ScenarioOverviewTitleStyled,
  SubheaderStyled,
} from "./styles";

export interface PromptWithOption {
  prompt: Prompt;
  options: PromptOption[];
}

export default function ParticipantFlowPage() {
  const { userId } = useProfile();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID;

  const [roleId, setRoleId] = useState<string | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [rolePhase, setRolePhase] = useState<RolePhase | null>(null);
  const [promptsWithOptions, setPromptsWithOptions] = useState<
    PromptWithOption[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<(string | string[])[]>([]);
  const [completedPrompts, setCompletedPrompts] = useState<Set<string>>(
    new Set(),
  );
  // DT: We use a set to store the index of prompts that hvae been completed (defined by blurred)
  const totalPrompts = promptsWithOptions.length;
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
        const phaseData = await fetchPhases(sessionId);
        setPhases(phaseData);
        console.log("Loaded phases:", phaseData);

        const fetchedRoleId = await fetchRole(userId, sessionId);
        setRoleId(fetchedRoleId as string);

        // Set currentPhaseIndex to most recent phase
        const mostRecentPhaseIndex = await fetchMostRecentPhase(
          userId,
          sessionId,
        );
        setCurrentPhaseIndex(mostRecentPhaseIndex);
      } catch (err) {
        console.error("Error loading session data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId, sessionId]);

  // Load Options if prompt is an mcq or checkbox
  async function loadPromptOptions(prompt_id: string) {
    const pulled_options = await getOptionsForPrompt(prompt_id);
    return pulled_options ?? [];
  }

  useEffect(() => {
    if (!currentPhase || !roleId) return;

    async function loadPhaseContent() {
      try {
        console.log("Getting role phase id");
        const rp = await fetchRolePhases(roleId as UUID, currentPhase.phase_id);
        setRolePhase(rp);

        if (rp) {
          const prompts = await fetchPrompts(rp.role_phase_id);

          const buffer: PromptWithOption[] = await Promise.all(
            prompts.map(async p => {
              const pulled_options = await loadPromptOptions(p.prompt_id);

              return {
                prompt: p,
                options: pulled_options,
              };
            }),
          );

          setPromptsWithOptions(buffer);
          console.log("Loaded prompts ", buffer);
        } else {
          setPromptsWithOptions([]);
        }
      } catch (err) {
        console.error("Error setting prompts:", err);
        setPromptsWithOptions([]);
      }
    }

    loadPhaseContent();
  }, [currentPhase, currentPhaseIndex, roleId]);

  useEffect(() => {
    if (!userId || !sessionId || !rolePhase || promptsWithOptions.length === 0)
      return;

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

          const ordered = sortResponsesByPromptOrder(
            promptsWithOptions,
            responses,
          );
          const answerStrings = ordered.map(r => r?.prompt_answer ?? "");
          setAnswers(answerStrings);
        }
      } catch (err) {
        console.error("Response load failed:", err);
      }
    }

    loadResponses();
  }, [userId, sessionId, rolePhase, promptsWithOptions, currentPhaseIndex]);

  function sortResponsesByPromptOrder(
    promptsWithOptions: PromptWithOption[],
    responses: PromptAnswer[],
  ) {
    const responseMap = new Map(responses.map(r => [r.prompt_id, r]));

    return promptsWithOptions.map(
      ({ prompt }) => responseMap.get(prompt.prompt_id) ?? null,
    );
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
          console.log(
            "OLD Realtime payload received:",
            payload,
            payload.old.is_finished,
            payload.old.phase_index,
          );
          console.log(
            "Realtime payload received:",
            payload,
            payload.new.is_finished,
            payload.new.phase_index,
          );

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
    setAnswers(Array(promptsWithOptions.length).fill(""));
    setCompletedPrompts(new Set());
  }, [promptsWithOptions]);

  function handleInputAnswer(index: number, value: string | string[]) {
    setAnswers(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }

  async function handleSave(promptIndex: number, value: string | string[]) {
    const { prompt_id, prompt_type } = promptsWithOptions[promptIndex].prompt;
    if (!value || !userId || !rolePhase) return;

    if (prompt_type === "checkbox" || prompt_type === "multiple_choice") {
      const deleteResult = await deletePromptAnswers(
        userId,
        prompt_id,
        sessionId,
      );
      console.log("deleted rows for", prompt_id, deleteResult);
    }

    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      const result = await createPromptAnswer(
        userId,
        prompt_id,
        sessionId,
        rolePhase.phase_id,
        v,
        prompt_type,
      );
      console.log("inserted", v, result);
    }

    console.log("saving answer ", prompt_id, values);

    setCompletedPrompts(prev => new Set(prev).add(prompt_id));
  }

  async function submitAnswers() {
    // sequential, submit all answers, safety flush
    for (let i = 0; i < answers.length; i++) {
      await handleSave(i, answers[i]);
    }
  }

  if (loading || !currentPhase) {
    console.log("Loading or currentPhase not yet available");
    return <div>Loading phases...</div>;
  }

  return (
    <Main>
      <Container>
        <PhaseContextStyled>
          {currentPhaseIndex + 1} out of {phases.length}
          <PhaseHeading>Phase {currentPhaseIndex + 1}</PhaseHeading>
          <ContextStyled>
            <SubheaderStyled>Context</SubheaderStyled>
            <BodyTextStyled>
              <div>
                Your office has been working around the clock tackling a new
                wave of COVID-19 spurred by a lack of compliance with public
                health precautions as people moved indoors during the colder
                months. Yesterday, the country reached all-time highs of 7,019
                new cases and 144 deaths. Vaccines are expected to start
                becoming available in February, but only in limited amounts
                initially.
              </div>
              <div>
                You receive a call from a rural field office that the local
                hospital has reported seeing over 100 patients with fever,
                headache and breathing difficulties last week. Due to limited
                lab supplies, only 37 of the patients could be tested. The swabs
                were sent to a private laboratory for analysis, and none of the
                tests were positive for COVID-19. Based on the symptoms and
                progression of the disease, doctors at the hospital believe the
                patients do have COVID-19, and they are concerned about the
                handling and testing protocols used for the samples. Upon
                checking CRVS, you find that the lab has not yet submitted the
                results for those tests.
              </div>
              <div>
                You ask your colleague at the field office to visit the hospital
                and the laboratory to see if he can identify any issues with the
                test kits, sampling process, handling, or analysis protocols. He
                expresses concern about visiting the COVID ward at the hospital
                due to shortages of PPE.
              </div>
              <div>
                A breakout of COVID-19 at PTCL headquarters in Islamabad has
                impacted Internet reliability, causing intermittent outages,
                particularly in the capital.
              </div>
            </BodyTextStyled>
            <button>Hide</button>
          </ContextStyled>
          <ScenarioOverviewStyled>
            <ScenarioOverviewTitleStyled>
              Scenario Overview
            </ScenarioOverviewTitleStyled>

            <ScenarioOverviewFieldsStyled>
              <SubheaderStyled>Summary</SubheaderStyled>
              {}
            </ScenarioOverviewFieldsStyled>

            <ScenarioOverviewFieldsStyled>
              <SubheaderStyled>Setting</SubheaderStyled>
              {}
            </ScenarioOverviewFieldsStyled>

            <ScenarioOverviewFieldsStyled>
              <SubheaderStyled>Current Activity</SubheaderStyled>
              {}
            </ScenarioOverviewFieldsStyled>
          </ScenarioOverviewStyled>
        </PhaseContextStyled>

        <ParticipantFlowMain>
          <PromptQuestionTitleStyled>Questions</PromptQuestionTitleStyled>

          <div>
            Progress: {completedCount} / {totalPrompts} completed (
            {progressPercentage}%)
          </div>

          <PromptCard>
            {promptsWithOptions.map((pWithOpts, index) => (
              <PromptRenderer
                index={index}
                key={pWithOpts.prompt.prompt_id}
                promptWithOption={pWithOpts}
                answer={answers[index]}
                onAnswer={value => handleInputAnswer(index, value)}
                onBlur={value => handleSave(index, value)}
              />
            ))}
          </PromptCard>

          {roleId && userId && sessionId && (
            <NextButton
              user_id={userId as UUID}
              role_id={roleId as UUID}
              session_id={sessionId as UUID}
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
