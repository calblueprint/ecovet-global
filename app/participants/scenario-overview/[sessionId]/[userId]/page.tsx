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
  sessionParticipantsBulk,
} from "@/actions/supabase/queries/sessions";
import { fetchTemplate } from "@/actions/supabase/queries/templates";
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
  const isFirstPhase = phaseIdx === 0;
  const isOverview = phaseIdx === -1;

  const { everyoneAnnouncements, roleAnnouncements, userAnnouncements } =
    useAnnouncements({
      sessionId: sessionIdStr ?? "unknown session id",
      userId: userId ?? "unknown user id",
      username: profile?.first_name ?? "Unknown Users",
      roleId: roleId ?? "unknown role id",
    });

  useEffect(() => {
    if (everyoneAnnouncements.chatMessages.length == 0) return;

    const message =
      everyoneAnnouncements.chatMessages[
        everyoneAnnouncements.chatMessages.length - 1
      ].message;
    alert("New @everyone message: " + message);
  }, [everyoneAnnouncements.chatMessages]);

  useEffect(() => {
    if (roleAnnouncements.chatMessages.length == 0) return;

    const message =
      roleAnnouncements.chatMessages[roleAnnouncements.chatMessages.length - 1]
        .message;
    alert("New @role message: " + message);
  }, [roleAnnouncements.chatMessages]);

  useEffect(() => {
    if (userAnnouncements.chatMessages.length == 0) return;

    const message =
      userAnnouncements.chatMessages[userAnnouncements.chatMessages.length - 1]
        .message;
    alert("New @user message: " + message);
  }, [userAnnouncements.chatMessages]);

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
        setAnswers(ordered.map(r => r?.prompt_answer ?? ""));
        setCompletedPrompts(
          new Set(
            ordered
              .filter(r => r?.prompt_answer)
              .map(r => r?.prompt_id as string),
          ),
        );
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
    if (
      !answer ||
      !userId ||
      !sessionIdStr ||
      !currentPhase ||
      !rolePhase?.role_phase_id
    )
      return;
    const promptId = prompts[index].prompt_id;

    await createPromptAnswer(
      userId,
      promptId,
      sessionIdStr,
      rolePhase.role_phase_id,
      answer,
    );

    setCompletedPrompts(prev => new Set(prev).add(promptId));
  }

  async function submitAnswers() {
    if (!userId || !sessionIdStr || !currentPhase || !rolePhase) return;

    const promises = answers
      .map((answer, i) => {
        if (!answer.trim()) return null;
        const promptId = prompts[i].prompt_id;
        return createPromptAnswer(
          userId,
          promptId,
          sessionIdStr,
          rolePhase.role_phase_id,
          answer,
        );
      })
      .filter(Boolean);

    await Promise.all(promises);
    setCompletedPrompts(new Set(prompts.map(p => p.prompt_id)));
  }

  async function handleContinue() {
    if (isLastPhase) return;
    setPhaseIdx(i => i + 1);
  }

  async function handleBack() {
    if (isOverview) return;
    setPhaseIdx(i => i - 1);
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
              promptsCompleted={completedPrompts.size == prompts.length}
              isLastPhase={isLastPhase}
              currentPhaseIndex={phaseIdx}
              phaseId={currentPhase.phase_id as UUID}
              onClick={submitAnswers}
            />
          )
        }
      />
    </Main>
  );
}
