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
  isSessionAsync,
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

  const [phaseInd, setPhaseInd] = useState(-1);

  const [roleId, setRoleId] = useState<string | null>(null);
  const [rolePhase, setRolePhase] = useState<RolePhase | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [completedPrompts, setCompletedPrompts] = useState<Set<string>>(
    new Set(),
  );
  const [isAsync, setIsAsync] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentPhase = phases[phaseInd] ?? null;
  const isLastPhase = phaseInd === phases.length - 1;
  const isOverview = phaseInd === -1;

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

      const isCurrentSessionAsync = await isSessionAsync(sessionIdStr);
      setIsAsync(isCurrentSessionAsync);

      let mostRecentPhaseIndex: number;
      try {
        mostRecentPhaseIndex = await fetchMostRecentPhase(userId, sessionIdStr);
      } catch {
        mostRecentPhaseIndex = -1;
      }
      setPhaseInd(mostRecentPhaseIndex);
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
        if (phaseInd < mostRecentPhaseIndex) {
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
  }, [userId, sessionIdStr, rolePhase, prompts, phaseInd]);

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
          if (newPhaseIndex != null) setPhaseInd(newPhaseIndex);
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
    const value = answers[index]?.trim();
    if (!value || !userId || !sessionIdStr || !currentPhase) return;
    const promptId = prompts[index].prompt_id;
    await createPromptAnswer(
      userId,
      promptId,
      value,
      sessionIdStr,
      currentPhase.phase_id,
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
        sessionIdStr,
        currentPhase.phase_id,
        promptId,
        answer,
      );
    }
    setCompletedPrompts(updated);
  }

  async function handleContinue() {
    if (phaseInd + 1 >= phases.length) return;
    const nextInd = phaseInd + 1;
    setPhaseInd(nextInd);
  }

  if (loading) return <div>Loading session...</div>;

  return (
    <Main>
      <ScenarioLeftPanel
        templateInfo={templateInfo}
        phases={phases}
        phaseInd={phaseInd}
        rolePhase={rolePhase}
        onContinue={handleContinue}
      />

      <PromptsRightPanel
        prompts={isOverview ? [] : prompts}
        answers={answers}
        completedPrompts={completedPrompts}
        phaseInd={phaseInd}
        isOverview={isOverview}
        onInputAnswer={handleInputAnswer}
        onBlur={handleBlur}
        nextButton={
          !isOverview && roleId && userId && sessionIdStr && currentPhase ? (
            <NextButton
              user_id={userId as UUID}
              role_id={roleId as UUID}
              session_id={sessionIdStr}
              is_async={isAsync}
              isLastPhase={isLastPhase}
              currentPhaseIndex={phaseInd}
              phase_id={currentPhase.phase_id as UUID}
              onClick={submitAnswers}
            />
          ) : null
        }
      />
    </Main>
  );
}
