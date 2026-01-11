"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UUID } from "crypto";
import supabase from "@/actions/supabase/client";
import {
  finishSession,
  participant_session_update,
} from "@/api/supabase/queries/sessions";
import { ParticipantSession } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { Button, Container, Main } from "./styles";

interface ParticipantWithProfile {
  user_id: UUID;
  role_id: UUID | null;
  session_id: UUID;
  phase_index: number;
  is_finished: boolean;
  first_name: string;
  last_name: string;
}

export default function FacilitatorSessionView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;
  const { profile } = useProfile();
  const router = useRouter();

  const [participants, setParticipants] = useState<ParticipantWithProfile[]>(
    [],
  );
  const [currentPhase, setCurrentPhase] = useState(1);
  const [allDone, setAllDone] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

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
        const psData = await participant_session_update(sessionId as UUID);

        const enriched: ParticipantWithProfile[] = [];

        for (const p of psData ?? []) {
          const { data: profileData, error } = await supabase
            .from("profile")
            .select("first_name,last_name")
            .eq("id", p.user_id)
            .single();

          if (error) throw error;

          enriched.push({
            user_id: p.user_id,
            role_id: p.role_id,
            session_id: p.session_id,
            phase_index: p.phase_index ?? 1,
            is_finished: p.is_finished,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
          });
        }

        setParticipants(enriched);

        if (enriched.length > 0) {
          setCurrentPhase(enriched[0].phase_index);
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

          const { data: profileData } = await supabase
            .from("profile")
            .select("first_name,last_name")
            .eq("id", updated.user_id)
            .single();

          setParticipants(prev =>
            prev.map(p =>
              p.user_id === updated.user_id
                ? {
                    ...p,
                    phase_index: updated.phase_index ?? 1,
                    is_finished: updated.is_finished,
                    first_name: profileData?.first_name ?? p.first_name,
                    last_name: profileData?.last_name ?? p.last_name,
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

  return (
    <Main>
      <Container>
        <h1 style={{ textAlign: "center" }}>Phase {currentPhase}</h1>
        <h3>Session ID: {sessionId}</h3>

        <div>
          <h3>Unfinished Participants</h3>
          {participants
            .filter(p => p.user_id !== profile?.id && !p.is_finished)
            .map(p => (
              <div key={p.user_id}>
                {p.first_name} {p.last_name}
              </div>
            ))}
        </div>

        <div>
          <h3>Finished Participants</h3>
          {participants
            .filter(p => p.user_id !== profile?.id && p.is_finished)
            .map(p => (
              <div key={p.user_id}>
                {p.first_name} {p.last_name}
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
