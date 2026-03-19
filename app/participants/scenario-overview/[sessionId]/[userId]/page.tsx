"use client";

import type {
  Phase,
  Prompt,
  PromptAnswer,
  RolePhase,
  Template,
  UUID,
} from "@/types/schema";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  createPromptAnswer,
  fetchMostRecentPhase,
  fetchPhases,
  fetchPromptResponses,
  fetchPrompts,
  fetchRole,
  fetchRolePhases,
  fetchTemplateId,
  isSessionForceAdvance,
} from "@/actions/supabase/queries/sessions";
import { fetchTemplate } from "@/actions/supabase/queries/templates";
import { useProfile } from "@/utils/ProfileProvider";
import NextButton from "../../../components/ParticipantNextButton";
import PromptsRightPanel from "./components/PromptsRightPanel";
import ScenarioLeftPanel from "./components/ScenarioLeftPanel";
import { Main } from "./styles";

export default function SessionFlowPage() {
  const { userId: profileUserId } = useProfile();
  const { sessionId, userId: paramUserId } = useParams();

  const userId = (profileUserId ?? paramUserId) as UUID | null;
  const sessionIdStr = sessionId as UUID | null;

  const [templateInfo, setTemplateInfo] = useState<Template | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);

  const [phaseIdx, setPhaseIdx] = useState(-1);

  const [roleId, setRoleId] = useState<string | null>(null);
  const [rolePhase, setRolePhase] = useState<RolePhase | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [completedPrompts, setCompletedPrompts] = useState<Set<string>>(
    new Set(),
  );
  const [isForceAdvance, setIsForceAdvance] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentPhase = phases[phaseIdx] ?? null;
  const isLastPhase = phaseIdx === phases.length - 1;
  const isOverview = phaseIdx === -1;

  const loadData = useCallback(async () => {
    if (!userId || !sessionIdStr) return;
    setLoading(true);
    try {
      const templateId = await fetchTemplateId(sessionIdStr);
      const template = await fetchTemplate(
        templateId.template_id as unknown as UUID,
      );
      setTemplateInfo(template);

      const phaseData = await fetchPhases(sessionIdStr);
      setPhases(phaseData);

      const fetchedRoleId = await fetchRole(userId, sessionIdStr);
      setRoleId(fetchedRoleId as string);

      const isCurrentSessionAsync = await isSessionForceAdvance(sessionIdStr);
      setIsForceAdvance(isCurrentSessionAsync);

      let mostRecentPhaseIndex: number;
      try {
        mostRecentPhaseIndex = await fetchMostRecentPhase(userId, sessionIdStr);
      } catch {
        mostRecentPhaseIndex = -1;
      }
      setPhaseIdx(mostRecentPhaseIndex);
    } catch (err) {
      console.error("Error loading session data:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, sessionIdStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!currentPhase || !roleId) return;

    async function loadPhaseContent() {
      try {
        const rp = await fetchRolePhases(
          roleId as UUID,
          currentPhase!.phase_id,
        );
        setRolePhase(rp);
        const p = rp ? await fetchPrompts(rp.role_phase_id) : [];
        setPrompts(p);
      } catch (err) {
        console.error("Error loading phase content:", err);
        setPrompts([]);
      }
    }

    loadPhaseContent();
  }, [currentPhase, roleId]);

  useEffect(() => {
    if (!userId || !sessionIdStr || !rolePhase || prompts.length === 0) return;

    async function loadResponses() {
      try {
        let mostRecentPhaseIndex: number;
        try {
          mostRecentPhaseIndex = await fetchMostRecentPhase(
            userId!,
            sessionIdStr!,
          );
        } catch {
          return;
        }
        if (phaseIdx < mostRecentPhaseIndex) {
          const responses = await fetchPromptResponses(
            userId!,
            sessionIdStr!,
            rolePhase!.phase_id,
          );
          if (!responses) return;
          const ordered = sortResponsesByPromptOrder(prompts, responses);
          setAnswers(ordered.map(r => r?.prompt_answer ?? ""));
        }
      } catch (err) {
        console.error("Response load failed:", err);
      }
    }

    loadResponses();
  }, [userId, sessionIdStr, rolePhase, prompts, phaseIdx]);

  useEffect(() => {
    console.log("Phase index changed:", phaseIdx);
  }, [phaseIdx]);

  useEffect(() => {
    if (!userId || !sessionIdStr) return;

    const channel = supabase
      .channel(`participant_session_updates_${userId}_${sessionIdStr}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participant_session",
          filter: `session_id=eq.${sessionIdStr}`,
        },
        payload => {
          const newPhaseIndex = payload.new.phase_index;
          if (
            payload.new.user_id != userId ||
            payload.new.session_id != sessionIdStr
          )
            return;
          if (newPhaseIndex != null) setPhaseIdx(newPhaseIndex);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, sessionIdStr]);

  useEffect(() => {
    setAnswers(Array(prompts.length).fill(""));
    setCompletedPrompts(new Set());
  }, [prompts]);

  function sortResponsesByPromptOrder(
    prompts: Prompt[],
    responses: PromptAnswer[],
  ) {
    const map = new Map(responses.map(r => [r.prompt_id, r]));
    return prompts.map(p => map.get(p.prompt_id) ?? null);
  }

  function handleInputAnswer(index: number, value: string) {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  }

  async function handleBlur(index: number) {
    const answer = answers[index]?.trim();
    if (!answer || !userId || !sessionIdStr || !currentPhase) return;
    const promptId = prompts[index].prompt_id;

    await createPromptAnswer(
      userId,
      promptId,
      sessionIdStr,
      currentPhase.phase_id,
      answer,
    );

    setCompletedPrompts(prev => new Set(prev).add(promptId));
  }

  async function submitAnswers() {
    if (!userId || !sessionIdStr || !currentPhase) return;
    const updated = new Set(completedPrompts);

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const promptId = prompts[i].prompt_id;

      if (!answer.trim()) continue;
      updated.add(promptId);

      await createPromptAnswer(
        userId,
        promptId,
        sessionIdStr,
        currentPhase.phase_id,
        answer,
      );
    }
    setCompletedPrompts(updated);
  }

  async function handleContinue() {
    if (phaseIdx + 1 >= phases.length) return;
    const nextInd = phaseIdx + 1;
    setPhaseIdx(nextInd);
  }

  if (loading) return <div>Loading session...</div>;

  return (
    <Main>
      <ScenarioLeftPanel
        templateInfo={templateInfo}
        phases={phases}
        phaseInd={phaseIdx}
        rolePhase={rolePhase}
        onContinue={handleContinue}
      />

      <PromptsRightPanel
        prompts={isOverview ? [] : prompts}
        answers={answers}
        completedPrompts={completedPrompts}
        phaseName={phases[phaseIdx]?.phase_name ?? "Unnamed Phase"}
        isOverview={isOverview}
        onInputAnswer={handleInputAnswer}
        onBlur={handleBlur}
        nextButton={
          !isOverview &&
          roleId &&
          userId &&
          sessionIdStr &&
          currentPhase && (
            <NextButton
              user_id={userId as UUID}
              role_id={roleId as UUID}
              session_id={sessionIdStr}
              is_force_advance={isForceAdvance}
              promptsCompleted={completedPrompts.size == prompts.length}
              isLastPhase={isLastPhase}
              currentPhaseIndex={phaseIdx}
              phase_id={currentPhase.phase_id as UUID}
              onClick={submitAnswers}
            />
          )
        }
      />
    </Main>
  );
}
