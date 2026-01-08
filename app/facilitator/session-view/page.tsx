"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UUID } from "crypto";
import supabase from "@/actions/supabase/client";
import { participant_session_update } from "@/api/supabase/queries/sessions";
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
  const sessionId = searchParams.get("sessionId");
  const { profile } = useProfile();

  const [participants, setParticipants] = useState<ParticipantWithProfile[]>(
    [],
  );
  const [allDone, setAllDone] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const hasAdvancedRef = useRef(false);
  const router = useRouter();

  async function advancePhase() {
    const { error, data } = await supabase.rpc("advance_phase", {
      p_session_id: sessionId,
      p_current_phase_num: currentPhase,
    });

    if (error) {
      console.error("Failed to advance phase:", error);
    } else if (!data) {
      router.push("/sessions/session-finish/");
    }
  }

  useEffect(() => {
    if (!sessionId) return;

    async function loadParticipants() {
      try {
        const psData = await participant_session_update(sessionId as UUID);

        const participantsWithProfiles: ParticipantWithProfile[] = [];

        for (const p of psData ?? []) {
          const { data: profileData, error: profileError } = await supabase
            .from("profile")
            .select("first_name,last_name")
            .eq("id", p.user_id)
            .single();

          if (profileError) throw profileError;

          participantsWithProfiles.push({
            user_id: p.user_id,
            role_id: p.role_id,
            session_id: p.session_id,
            phase_index: p.phase_index,
            is_finished: p.is_finished,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
          });
        }

        setParticipants(participantsWithProfiles);

        if (participantsWithProfiles.length > 0) {
          setCurrentPhase(participantsWithProfiles[0].phase_index);
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
      .channel(`participant-is-finished-updates-sesh_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participant_session",
          filter: `session_id=eq.${sessionId}`,
        },
        async payload => {
          const updatedRow = payload.new as ParticipantSession;

          const { data: profileData } = await supabase
            .from("profile")
            .select("first_name,last_name")
            .eq("id", updatedRow.user_id)
            .single();

          const updatedParticipant: ParticipantWithProfile = {
            user_id: updatedRow.user_id,
            role_id: updatedRow.role_id,
            session_id: updatedRow.session_id,
            phase_index: updatedRow.phase_index ?? 1,
            is_finished: updatedRow.is_finished,
            first_name: profileData?.first_name,
            last_name: profileData?.last_name,
          };

          setParticipants(prev =>
            prev.map(p =>
              p.user_id === updatedParticipant.user_id ? updatedParticipant : p,
            ),
          );

          setCurrentPhase(updatedParticipant.phase_index);
        },
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [sessionId]);

  useEffect(() => {
    hasAdvancedRef.current = false;
  }, [currentPhase]);

  useEffect(() => {
    if (!allDone || hasAdvancedRef.current || !sessionId) return;

    hasAdvancedRef.current = true;

    advancePhase();
  }, [allDone, sessionId, currentPhase]);

  // Check if all participants, but not facilitator are done
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
          <h3>Unfinished Participants:</h3>
          {participants
            .filter(p => p.user_id !== profile?.id && !p.is_finished)
            .map(p => (
              <div key={p.user_id}>{`${p.first_name} ${p.last_name}`}</div>
            ))}
        </div>

        <div>
          <h3>Finished Participants:</h3>
          {participants
            .filter(p => p.user_id !== profile?.id && p.is_finished)
            .map(p => (
              <div key={p.user_id}>{`${p.first_name} ${p.last_name}`}</div>
            ))}
        </div>
        <Button onClick={advancePhase}>Force Advance</Button>

        {allDone && <h3>All participants are finished!</h3>}
      </Container>
    </Main>
  );
}
