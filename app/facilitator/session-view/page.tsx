"use client";

import type { ParticipantSession, UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  fetchCountPrompts,
  fetchCountResponses,
  finishSession,
  getPhaseId,
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

  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [currentPhase, setCurrentPhase] = useState(1);
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
    if (participants.length === 0) return;
    //if (Object.keys(promptCounts).length > 0) return;
    async function loadCounts() {
      const counts: Record<string, { done: number; total: number }> = {};

      try {
        const phaseId = await getPhaseId(sessionId as UUID);
        console.log(phaseId);
        if (!phaseId) return;

        for (const p of participants) {
          if (!p.role_id) continue;

          try {
            const rolePhaseId = await getRolePhaseId(
              sessionId as UUID,
              p.role_id,
            );

            if (!rolePhaseId) continue;

            const totalPrompts = await fetchCountPrompts(rolePhaseId);

            const doneResponses = await fetchCountResponses(
              p.user_id,
              sessionId as UUID,
              phaseId as UUID,
            );

            counts[String(p.user_id)] = {
              total: totalPrompts ?? 0,
              done: doneResponses ?? 0,
            };

            console.log(p.profile?.first_name, totalPrompts, doneResponses);
            console.log("Total Responses", totalPrompts);
            console.log("Done Responses", doneResponses);
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
  }, [sessionId, currentPhase, participants]);
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
