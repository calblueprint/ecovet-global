"use client";

import type { Phase, Prompt, PromptOption, RolePhase, UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  createPromptAnswer,
  fetchPhases,
  fetchPrompts,
  fetchRole,
  fetchRolePhases,
} from "@/actions/supabase/queries/sessions";
import { useProfile } from "@/utils/ProfileProvider";
import NextButton from "../components/ParticipantNextButton";
import {
  Container,
  Main,
  ParticipantFlowMain,
  PhaseHeading,
  PromptCard,
  PhaseContextStyled,
  SubheaderStyled,
  ContextStyled,
  ScenarioOverviewStyled,
  ScenarioOverviewFieldsStyled,
  ScenarioOverviewTitleStyled,
  BodyTextStyled,
  PromptQuestionTitleStyled,
} from "./styles";
import { getOptionsForPrompt } from "@/actions/supabase/queries/prompt";
import PromptRenderer from "@/app/participants/components/PromptRenderer";

export interface PromptWithOption {
  prompt: Prompt
  options: PromptOption[];
}

export default function ParticipantFlowPage() {
  const { userId } = useProfile();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;

  const [roleId, setRoleId] = useState<string | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [rolePhase, setRolePhase] = useState<RolePhase | null>(null);
  const [promptsWithOptions, setPromptsWithOptions] = useState<PromptWithOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<(string | string[])[]>([]);

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

  // Load Options if prompt is an mcq or checkbox
  async function loadPromptOptions(prompt_id: string) {
    const pulled_options = await getOptionsForPrompt(prompt_id);
    return pulled_options ?? [];
  }

  useEffect(() => {
    if (!currentPhase || !roleId) return;

    async function loadPhaseContent() {
      try {
        const rp = await fetchRolePhases(roleId as UUID, currentPhase.phase_id);
        setRolePhase(rp);

        if (rp) {
          const prompts = await fetchPrompts(rp.role_phase_id);

          const buffer: PromptWithOption[] = await Promise.all(
            prompts.map(async(p) => {
              const pulled_options = await loadPromptOptions(p.prompt_id);

              return {
                prompt: p,
                options: pulled_options,
              }
            })
          )

          setPromptsWithOptions(buffer);

        } else {
          setPromptsWithOptions([]);
        }
      } catch (err) {
        console.error("Error setting prompts:", err);
        setPromptsWithOptions([]);
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
    setAnswers(Array(promptsWithOptions.length).fill(""));
  }, [promptsWithOptions]);

  function handleInputAnswer(index: number, value: string | string[]) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }

  async function submitAnswers() {
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const promptId = promptsWithOptions[i].prompt.prompt_id;

      if (!userId || !answer) continue;

      // TEXT or MCQ
      if (typeof answer === "string") {
        if (!answer.trim()) continue;

        await createPromptAnswer(userId, promptId, answer);
      }

      // CHECKBOX (multiple answers)
      if (Array.isArray(answer)) {
        for (const optionId of answer) {
          await createPromptAnswer(userId, promptId, optionId);
        }
      }
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
        <PhaseContextStyled>
          {currentPhaseIndex + 1} out of {phases.length}
          <PhaseHeading>Phase {currentPhaseIndex + 1}</PhaseHeading>
          <ContextStyled>
            <SubheaderStyled>Context</SubheaderStyled>
            <BodyTextStyled>
              <div>
                Your office has been working around the clock tackling a new wave of COVID-19 spurred by a lack of compliance with public health precautions as people moved indoors during the colder months. Yesterday, the country reached all-time highs of 7,019 new cases and 144 deaths. Vaccines are expected to start becoming available in February, but only in limited amounts initially.
              </div>
              <div>
                You receive a call from a rural field office that the local hospital has reported seeing over 100 patients with fever, headache and breathing difficulties last week. Due to limited lab supplies, only 37 of the patients could be tested. The swabs were sent to a private laboratory for analysis, and none of the tests were positive for COVID-19. Based on the symptoms and progression of the disease, doctors at the hospital believe the patients do have COVID-19, and they are concerned about the handling and testing protocols used for the samples. Upon checking CRVS, you find that the lab has not yet submitted the results for those tests.
              </div>
              <div>
                You ask your colleague at the field office to visit the hospital and the laboratory to see if he can identify any issues with the test kits, sampling process, handling, or analysis protocols. He expresses concern about visiting the COVID ward at the hospital due to shortages of PPE.
              </div>
              <div>
                A breakout of COVID-19 at PTCL headquarters in Islamabad has impacted Internet reliability, causing intermittent outages, particularly in the capital.
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

          <PromptQuestionTitleStyled>
            Questions
          </PromptQuestionTitleStyled>
    
          {/* {rolePhase && (
            <RolePhaseDescription>
              Role description: {rolePhase.description}
            </RolePhaseDescription>
          )} */}

          <PromptCard>
            {promptsWithOptions.map((pWithOpts, index) => (
              <PromptRenderer
                index={index}
                key={pWithOpts.prompt.prompt_id}
                promptWithOption={pWithOpts}
                answer={answers[index]}
                onAnswer={(value) => handleInputAnswer(index, value)}
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
              onClick={submitAnswers}
            />
          )}

          {currentPhaseIndex === phases.length && <div>End of phases</div>}
        </ParticipantFlowMain>
      </Container>
    </Main>
  );
}
