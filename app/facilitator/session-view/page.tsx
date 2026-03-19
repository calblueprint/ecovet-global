"use client";

import type { ParticipantSession, UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  fetchPhases,
  finishSession,
  isSessionForceAdvance,
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
  const [currentPhase, setCurrentPhase] = useState(0);
  const [totalPhases, setTotalPhases] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isForceAdvance, setIsForceAdvance] = useState(false);
  const isLastPhase = currentPhase >= totalPhases - 1;

  useEffect(() => {
    if (!sessionId) return;

    async function loadParticipants() {
      try {
        const psData = await sessionParticipants(sessionId as UUID);

        setParticipants(psData);
        console.log("Participants:", psData);

        if (psData && psData.length > 0) {
          setCurrentPhase(psData[0].phase_index ?? 0);
        }
      } catch (err) {
        console.error("Failed to load participants:", err);
      }
    }

    async function checkIfForceAdvance() {
      try {
        const isForce = await isSessionForceAdvance(sessionId as UUID);
        setIsForceAdvance(isForce);
      } catch (err) {
        console.error("Failed to check if session is async:", err);
      }
    }

    async function getTotalPhases() {
      try {
        const phases = await fetchPhases(sessionId as UUID);
        setTotalPhases(phases.length);
      } catch (err) {
        console.error("Failed to check if session is async:", err);
      }
    }

    loadParticipants();
    checkIfForceAdvance();
    getTotalPhases();
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
          console.log("Received participant session update:", updated);

          setParticipants(prev =>
            prev.map(p =>
              p.user_id === updated.user_id
                ? {
                    ...p,
                    phase_index: updated.phase_index ?? 0,
                    is_finished: updated.is_finished,
                  }
                : p,
            ),
          );

          setCurrentPhase(updated.phase_index ?? 0);
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

  async function advancePhase() {
    if (!sessionId || isAdvancing) return;

    setIsAdvancing(true);

    if (!isLastPhase) {
      const { data, error } = await supabase.rpc("advance_phase", {
        p_session_id: sessionId,
        p_current_phase_num: currentPhase,
      });

      if (error) {
        console.error("Failed to advance phase:", error);
        setIsAdvancing(false);
        return;
      }
    } else {
      try {
        await finishSession(sessionId);
        router.push("/sessions/session-finish/");
      } catch (err) {
        console.error("Failed to finish session:", err);
      }
    }

    setIsAdvancing(false);
  }

  return (
    <Main>
      <Container>
        <h1 style={{ textAlign: "center" }}>Phase {currentPhase}</h1>
        <h3>Session ID: {sessionId}</h3>

        {!isForceAdvance ? (
          <div>
            <h3>Participants</h3>
            {participants
              .filter(p => p.user_id !== profile?.id)
              .map(p => (
                <div key={p.user_id}>
                  {p.profile?.first_name} {p.profile?.last_name}{" "}
                  {p.is_finished // only set to true on final phase for async sessions
                    ? "(Finished)"
                    : `Phase ${(p.phase_index ?? 0) + 1}`}
                </div>
              ))}
          </div>
        ) : (
          <>
            <div>
              <h3>Unfinished Participants</h3>
              {participants
                .filter(p => p.user_id !== profile?.id && !p.is_finished)
                .map(p => (
                  <div key={p.user_id}>
                    {p.profile?.first_name} {p.profile?.last_name}{" "}
                  </div>
                ))}
            </div>

            <div>
              <h3>Finished Participants</h3>
              {participants
                .filter(p => p.user_id !== profile?.id && p.is_finished)
                .map(p => (
                  <div key={p.user_id}>
                    {p.profile?.first_name} {p.profile?.last_name}{" "}
                    {isForceAdvance && `(Phase ${p.phase_index})`}
                  </div>
                ))}
            </div>
          </>
        )}

        {isForceAdvance && (
          <Button onClick={advancePhase} disabled={isAdvancing}>
            {isLastPhase
              ? isAdvancing
                ? "Finishing..."
                : "Finish Session"
              : isAdvancing
                ? "Advancing..."
                : "Force Advance"}
          </Button>
        )}

        {allDone && (
          <h3 style={{ marginTop: "1rem" }}>All participants are finished</h3>
        )}
      </Container>
    </Main>
  );
}
