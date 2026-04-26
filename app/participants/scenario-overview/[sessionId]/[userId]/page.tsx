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
import { fetchOptionsForPrompts } from "@/actions/supabase/queries/prompt";
import {
  createPromptAnswer,
  fetchMostRecentPhase,
  fetchPhases,
  fetchPromptResponses,
  fetchPrompts,
  fetchRole,
  fetchRolePhases,
  fetchSessionGlobalPhaseIndex,
  fetchTemplateId,
  isSessionForceAdvance,
  sessionParticipants,
  sessionParticipantsBulk,
} from "@/actions/supabase/queries/sessions";
import { fetchTemplate } from "@/actions/supabase/queries/templates";
import Chat from "@/components/Chat/Chat";
import { PromptOption } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { useAnnouncements } from "@/utils/UseAnnouncements";
import NextPhaseButton from "./components/NextPhaseButton";
import PrevPhaseButton from "./components/PrevPhaseButton";
import PromptsRightPanel from "./components/PromptsRightPanel";
import ScenarioLeftPanel from "./components/ScenarioLeftPanel";
import { Main } from "./styles";

export default function SessionFlowPage() {
  const { userId: profileUserId, profile } = useProfile();
  const { sessionId, userId: paramUserId } = useParams();

  const userId = (profileUserId ?? paramUserId) as UUID | null;
  const sessionIdStr = sessionId as UUID | null;

  const [templateInfo, setTemplateInfo] = useState<Template | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);

  const [phaseIdx, setPhaseIdx] = useState(-1);

  // only used for force advance sessions
  const [maxPhaseIndex, setMaxPhaseIndex] = useState(0);

  const [roleId, setRoleId] = useState<string | null>(null);
  const [rolePhase, setRolePhase] = useState<RolePhase | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [optionsByPromptId, setOptionsByPromptId] = useState<
    Record<string, PromptOption[]>
  >({});
  const [answers, setAnswers] = useState<string[]>([]);
  const [completedPrompts, setCompletedPrompts] = useState<Set<string>>(
    new Set(),
  );
  const [isForceAdvance, setIsForceAdvance] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentPhase = phases[phaseIdx] ?? null;
  const isLastPhase = phaseIdx === phases.length - 1;
  const isFirstPhase = phaseIdx === 0;
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

      const isForce = await isSessionForceAdvance(sessionIdStr);
      setIsForceAdvance(isForce);

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

        const nonTextPromptIds = p
          .filter(pr => pr.prompt_type !== "text")
          .map(pr => pr.prompt_id);

        if (nonTextPromptIds.length > 0) {
          const options = await fetchOptionsForPrompts(nonTextPromptIds);
          const grouped: Record<string, PromptOption[]> = {};
          for (const opt of options) {
            (grouped[opt.prompt_id] ||= []).push(opt);
          }
          setOptionsByPromptId(grouped);
        } else {
          setOptionsByPromptId({});
        }
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
        const responses = await fetchPromptResponses(
          userId!,
          sessionIdStr!,
          rolePhase!.role_phase_id,
        );
        if (!responses) return;

        const ordered = sortResponsesByPromptOrder(prompts, responses);
        const completed = new Set(
          ordered
            .filter(r => r?.prompt_answer)
            .map(r => r?.prompt_id as string),
        );

        setAnswers(ordered.map(r => r?.prompt_answer ?? ""));
        setCompletedPrompts(completed);
      } catch (err) {
        console.error("Response load failed:", err);
      }
    }

    loadResponses();
  }, [userId, sessionIdStr, rolePhase, prompts, phaseIdx]);

  useEffect(() => {
    if (!userId || !sessionIdStr) return;

    async function loadPhaseIndex() {
      if (!sessionIdStr) return;
      const phaseIdx = await fetchSessionGlobalPhaseIndex(sessionIdStr);
      setMaxPhaseIndex(phaseIdx);
    }
    loadPhaseIndex();

    const sessionChannel = supabase
      .channel(`session_phase_updates_${sessionIdStr}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "session",
          filter: `session_id=eq.${sessionIdStr}`,
        },
        payload => {
          const newPhaseIndex = payload.new.phase_index;
          if (newPhaseIndex != null) setMaxPhaseIndex(newPhaseIndex);
        },
      )
      .subscribe();

    const participantSessionChannel = supabase
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
      supabase.removeChannel(sessionChannel);
      supabase.removeChannel(participantSessionChannel);
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

  function isAnswerEmpty(
    rawAnswer: string | undefined,
    promptType: string | null,
  ) {
    if (!rawAnswer) return true;
    if (promptType === "checkbox") {
      try {
        const parsed = JSON.parse(rawAnswer);
        return !Array.isArray(parsed) || parsed.length === 0;
      } catch {
        return true;
      }
    }
    return rawAnswer.trim() === "";
  }

  async function handleBlur(index: number, rawAnswer: string) {
    console.log("raw", rawAnswer);

    if (!userId || !sessionIdStr || !currentPhase || !rolePhase?.role_phase_id)
      return;

    const promptType = prompts[index].prompt_type;
    const promptId = prompts[index].prompt_id;

    console.log("raw", rawAnswer);

    if (isAnswerEmpty(rawAnswer, promptType)) {
      setCompletedPrompts(prev => {
        const next = new Set(prev);
        next.delete(promptId);
        return next;
      });
      return;
    }

    await createPromptAnswer(
      userId,
      promptId,
      sessionIdStr,
      rolePhase.role_phase_id,
      rawAnswer,
      promptType,
    );

    setCompletedPrompts(prev => new Set(prev).add(promptId));
  }

  async function submitAnswers() {
    console.log("tyring to submut");
    if (!userId || !sessionIdStr || !currentPhase || !rolePhase) return;

    const promises = answers
      .map((answer, i) => {
        if (!answer.trim()) return null;
        const promptType = prompts[i].prompt_type;
        if (isAnswerEmpty(answer, promptType)) return null;
        const promptId = prompts[i].prompt_id;
        return createPromptAnswer(
          userId,
          promptId,
          sessionIdStr,
          rolePhase.role_phase_id,
          answer,
          promptType,
        );
      })
      .filter(Boolean);

    await Promise.all(promises);
    setCompletedPrompts(
      new Set(
        prompts
          .filter((p, i) => !isAnswerEmpty(answers[i], p.prompt_type))
          .map(p => p.prompt_id),
      ),
    );
  }

  async function handleContinue() {
    if (isLastPhase) return;
    setPhaseIdx(i => i + 1);
  }

  async function handleBack() {
    if (isOverview) return;
    setPhaseIdx(i => Math.max(i - 1, -1));
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
        optionsByPromptId={optionsByPromptId}
        completedPrompts={completedPrompts}
        phaseName={phases[phaseIdx]?.phase_name ?? "Unnamed Phase"}
        isOverview={isOverview}
        onInputAnswer={handleInputAnswer}
        onBlur={handleBlur}
        backButton={
          !isOverview &&
          roleId &&
          userId &&
          sessionIdStr &&
          currentPhase && (
            <PrevPhaseButton
              userId={userId as UUID}
              roleId={roleId as UUID}
              sessionId={sessionIdStr}
              isOnOverview={isOverview}
              isFirstPhase={isFirstPhase}
              onClick={handleBack}
            />
          )
        }
        nextButton={
          !isOverview &&
          roleId &&
          userId &&
          sessionIdStr &&
          currentPhase && (
            <NextPhaseButton
              userId={userId as UUID}
              roleId={roleId as UUID}
              sessionId={sessionIdStr}
              isForceAdvance={isForceAdvance}
              forceAdvanceMaxPhaseIndex={maxPhaseIndex}
              promptsCompleted={completedPrompts.size == prompts.length}
              isLastPhase={isLastPhase}
              currentPhaseIndex={phaseIdx}
              phaseId={currentPhase.phase_id as UUID}
              onClick={submitAnswers}
            />
          )
        }
      />

      {sessionIdStr && <Chat sessionId={sessionIdStr} roleId={roleId} />}
    </Main>
  );
}
