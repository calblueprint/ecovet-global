"use client";

import type { ParticipantSession, Phase, UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  fetchPhases,
  fetchPromptsWithResponses,
  fetchRolePhases,
  finishSession,
  isSessionForceAdvance,
  SessionParticipant,
  sessionParticipants,
} from "@/actions/supabase/queries/sessions";
import { useProfile } from "@/utils/ProfileProvider";
import { Button, Container, Main } from "./styles";

type PromptCounts = Record<UUID, { done: number; total: number }>;
type PromptData = {
  question: string;
  answer: string | null;
};

type ParticipantPromptData = Record<
  UUID,
  {
    done: number;
    total: number;
    prompts: PromptData[];
  }
>;

export default function FacilitatorSessionView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;
  const { profile } = useProfile();
  const router = useRouter();

  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [allDone, setAllDone] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isForceAdvance, setIsForceAdvance] = useState(false);
  const isLastPhase = currentPhase >= phases.length - 1;
  const currentPhaseObject = phases[currentPhase];
  const [promptData, setPromptData] = useState<ParticipantPromptData>({});

  useEffect(() => {
    if (!sessionId) return;

    async function loadParticipants() {
      try {
        const psData = await sessionParticipants(sessionId as UUID);
        setParticipants(psData);
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
        console.error("Failed to check if session is force advance:", err);
      }
    }

    async function loadPhases() {
      try {
        const phasesData = await fetchPhases(sessionId as UUID);
        setPhases(phasesData);
      } catch (err) {
        console.error("Failed to load phases:", err);
      }
    }

    loadParticipants();
    checkIfForceAdvance();
    loadPhases();
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

  useEffect(() => {
    if (!sessionId) return;
    if (participants.length === 0) return;
    if (phases.length === 0) return;
    if (!currentPhaseObject) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function loadDataForParticipant(
      p: SessionParticipant,
      phaseIndex: number,
    ) {
      if (!p.role_id) return null;

      const phaseId = phases[phaseIndex]?.phase_id;
      if (!phaseId) return null;

      const rolePhase = await fetchRolePhases(p.role_id, phaseId);
      if (!rolePhase) return null;

      const prompts = await fetchPromptsWithResponses(
        rolePhase.role_phase_id,
        p.user_id,
        sessionId as UUID,
      );

      const total = prompts.length;
      const done = prompts.filter(p => p.answer).length;

      return {
        total,
        done,
        prompts,
      };
    }

    async function loadCounts() {
      console.log("loadCounts sessionId:", sessionId);
      console.log("loadCounts participants:", participants.length);
      console.log(
        "loadCounts currentPhaseObject:",
        currentPhaseObject?.phase_id,
      );
      const data: ParticipantPromptData = {};

      await Promise.all(
        participants.map(async p => {
          try {
            const phaseIndex = isForceAdvance
              ? currentPhase
              : (p.phase_index ?? 0);

            const result = await loadDataForParticipant(p, phaseIndex);

            if (result) {
              data[p.user_id] = result;
            }
          } catch (err) {
            console.error(`Failed for user ${p.user_id}`, err);
          }
        }),
      );

      setPromptData(data);
    }

    loadCounts();

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
          console.log("prompt_response subscription fired");
          loadCounts();
        },
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [sessionId, participants, currentPhase, phases, isForceAdvance]);

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
        <h3>Session ID: {sessionId}</h3>
        {!isForceAdvance ? (
          <div>
            <h3>Participants</h3>
            {participants
              .filter(p => p.user_id !== profile?.id)
              .map(p => {
                const data = promptData[p.user_id];

                return (
                  <div key={p.user_id}>
                    <strong>
                      {p.profile?.first_name} {p.profile?.last_name}
                    </strong>

                    {data ? (
                      <>
                        <div>
                          ({data.done}/{data.total} responses)
                        </div>

                        <ul>
                          {data.prompts.map((prompt, i) => (
                            <li key={i}>
                              <div>
                                <b>Q:</b> {prompt.question}
                              </div>
                              <div>
                                <b>A:</b> {prompt.answer ?? <i> No response</i>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <div>(Loading...)</div>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <>
            <h1 style={{ textAlign: "center" }}>Phase {currentPhase}</h1>
            <div>
              <h3>Unfinished Participants</h3>
              {participants
                .filter(p => p.user_id !== profile?.id && !p.is_finished)
                .map(p => {
                  const data = promptData[p.user_id];
                  return (
                    <div key={p.user_id}>
                      {p.profile?.first_name} {p.profile?.last_name}{" "}
                      {data
                        ? `(${data.done}/${data.total} responses)`
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
