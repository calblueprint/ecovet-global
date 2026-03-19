"use client";

import type { ParticipantSession, Phase, UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { current } from "immer";
import supabase from "@/actions/supabase/client";
import {
  fetchPhases,
  finishSession,
  getPromptIdDylan,
  getRespondedPromptsDylan2,
  getRolePhaseId,
  SessionParticipant,
  sessionParticipants,
} from "@/actions/supabase/queries/sessions";
import { useProfile } from "@/utils/ProfileProvider";
import { Button, Container, Main } from "./styles";

export default function FacilitatorSessionView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;
  const { profile } = useProfile();
  const router = useRouter();
  const [phases, setPhases] = useState<Phase[]>([]);
  const [currentPhase, setCurrentPhase] = useState(1);
  const currentPhaseObject = phases[currentPhase - 1];
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [allDone, setAllDone] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [promptCounts, setPromptCounts] = useState<
    Record<string, { done: number; total: number }>
  >({});

  async function advancePhase() {
    if (!sessionId || isAdvancing) return;

    setIsAdvancing(true);

    const { data, error } = await supabase.rpc("advance_phase", {
      p_session_id: sessionId,
      p_current_phase_num: currentPhase,
    });

    if (error) {
      console.error("Failed to advance phase:", error);
      setIsAdvancing(false);
      return;
    }

    if (!data) {
      try {
        await finishSession(sessionId);
        router.push("/sessions/session-finish/");
      } catch (err) {
        console.error("Failed to finish session:", err);
      }
    }

    setIsAdvancing(false);
  }

  useEffect(() => {
    if (!sessionId) return;

    async function loadParticipants() {
      try {
        const psData = await sessionParticipants(sessionId as UUID);

        setParticipants(psData);
        console.log("Participants:", psData);

        if (psData && psData.length > 0) {
          setCurrentPhase(psData[0].phase_index ?? 1);
        }
      } catch (err) {
        console.error("Failed to load participants:", err);
      }
    }

    loadParticipants();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`participant-session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participant_session",
          filter: `session_id=eq.${sessionId}`,
        },
        async payload => {
          const updated = payload.new as ParticipantSession;

          setParticipants(prev =>
            prev.map(p =>
              p.user_id === updated.user_id
                ? {
                    ...p,
                    phase_index: updated.phase_index ?? 1,
                    is_finished: updated.is_finished,
                  }
                : p,
            ),
          );

          setCurrentPhase(updated.phase_index ?? 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(() => {
    if (!profile?.id || participants.length === 0) return;

    const nonFacilitators = participants.filter(p => p.user_id !== profile.id);

    setAllDone(nonFacilitators.every(p => p.is_finished));
  }, [participants, profile?.id]);

  useEffect(() => {
    if (!sessionId) return;

    async function loadPhases() {
      try {
        const phasesData = await fetchPhases(sessionId as UUID);
        setPhases(phasesData);
        console.log("Phases loaded", phasesData);
      } catch (err) {
        console.error("Failed to load phases", err);
      }
    }

    loadPhases();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    if (participants.length === 0) return;
    if (phases.length === 0) return;
    if (!currentPhaseObject) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function loadCounts() {
      const counts: Record<string, { done: number; total: number }> = {};

      try {
        const phaseId2 = currentPhaseObject?.phase_id;
        console.log("SessionId", sessionId);
        console.log("CurrentPhase", currentPhase - 1);
        if (!phaseId2) return;

        for (const p of participants) {
          if (!p.role_id) continue;

          try {
            const phaseId2 = currentPhaseObject?.phase_id;
            // console.log("SessionId", sessionId);
            // console.log("CurrentPhase", currentPhase - 1);
            // console.log("CurrentPhase typeof", typeof currentPhase);
            // console.log("CurrentPhaseObject", currentPhaseObject);
            // console.log("PhaseId from getPhaseId", phaseId);
            // console.log("PhaseId from currentPhaseInd", phaseId2);
            // console.log("phaseId2", phaseId2);

            // 1. get rolePhaseId from roleId + phaseId
            const rolePhaseId = await getRolePhaseId(
              p.role_id,
              phaseId2 as UUID,
            );
            console.log("RoleId", p.role_id);
            console.log("RolePhaseId", rolePhaseId);

            if (!rolePhaseId) continue;

            // 2. get total prompts
            const promptIds = await getPromptIdDylan(rolePhaseId);
            console.log("PromptIds", promptIds);
            const totalPrompts = promptIds?.length ?? 0;

            // 3. get responded count
            const doneResponses = await getRespondedPromptsDylan2(
              promptIds as UUID[],
              sessionId as UUID,
              phaseId2 as UUID,
            );
            console.log("PromptIds for getRespondedPromptsDylan2", promptIds);
            console.log("SessionId for getRespondedPromptsDylan2", sessionId);
            console.log("PhaseId2 for getRespondedPromptsDylan2", phaseId2);
            console.log("DoneResponses", doneResponses);
            counts[String(p.user_id)] = {
              total: totalPrompts,
              done: doneResponses,
            };
          } catch (err) {
            console.error(`Failed to load counts for user ${p.user_id}`, err);
          }
        }

        setPromptCounts(counts);
      } catch (err) {
        console.error("loadCounts error", err);
      }
    }

    loadCounts();

    // realtime subscription for prompt_response
    channel = supabase
      .channel(`prompt-response-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prompt_response",
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          loadCounts();
        },
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [sessionId, participants, currentPhase, phases]);

  return (
    <Main>
      <Container>
        <h1 style={{ textAlign: "center" }}>Phase {currentPhase}</h1>
        <h3>Session ID: {sessionId}</h3>

        <div>
          <h3>Unfinished Participants</h3>
          {participants
            .filter(p => p.user_id !== profile?.id && !p.is_finished)
            .map(p => {
              const counts = promptCounts[String(p.user_id)];

              return (
                <div key={p.user_id}>
                  {p.profile?.first_name} {p.profile?.last_name}{" "}
                  {counts
                    ? `(${counts.done}/${counts.total} responses)`
                    : "(Loading counts...)"}
                </div>
              );
            })}
        </div>

        <div>
          <h3>Finished Participants</h3>
          {participants
            .filter(p => p.user_id !== profile?.id && p.is_finished)
            .map(p => (
              <div key={p.user_id}>
                {p.profile?.first_name} {p.profile?.last_name}
              </div>
            ))}
        </div>

        <Button onClick={advancePhase} disabled={isAdvancing}>
          {isAdvancing ? "Advancing..." : "Force Advance"}
        </Button>

        {allDone && (
          <h3 style={{ marginTop: "1rem" }}>All participants are finished</h3>
        )}
      </Container>
    </Main>
  );
}
