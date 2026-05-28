"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UUID } from "crypto";
import supabase from "@/actions/supabase/client";
import {
  fetchRoleBySessionId,
  fetchSessionById,
} from "@/actions/supabase/queries/profile";
import { fetchTemplateNameBySession } from "@/actions/supabase/queries/sessions";
import AccessError from "@/components/AccessError/AccessError";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import ParticipantsNavBar from "@/components/ParticipantsNavBar/ParticipantsNavBar";
import { useProfile } from "@/utils/ProfileProvider";
import { Button, Container, Heading2, Label, Main } from "./styles";

export default function ParticipantWaitingPage() {
  const { profile } = useProfile();

  const [status, setStatus] = useState("Waiting for session to start...");
  const [sessionName, setSessionName] = useState("");
  const [sessionExists, setSessionExists] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const processedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    async function handleSession(sessionId: string) {
      if (processedSessionRef.current === sessionId) return;

      processedSessionRef.current = sessionId;

      const template_name = await fetchTemplateNameBySession(sessionId);

      setSessionName(template_name ?? "no name");
      setSessionId(sessionId);

      const role_data = await fetchRoleBySessionId(
        sessionId as UUID,
        profile?.id as UUID,
      );

      const role_name = role_data?.role_name ?? "participant";
      setStatus(`You were invited as a  ${role_name} in:`);
      setSessionExists(true);
    }

    async function initialLoad() {
      if (!profile) return;
      console.log(profile.id);
      const data = await fetchSessionById(profile.id);

      if (data) {
        await handleSession(data);
      }
    }

    initialLoad();

    const channel = supabase
      .channel(`profile-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "participant_session",
          filter: `user_id=eq.${profile.id}`,
        },
        payload => {
          console.log(payload);

          const newSessionId = payload.new.session_id;

          if (!newSessionId) {
            processedSessionRef.current = null;
            setSessionExists(false);
            setSessionName("");
            setSessionId("");
            setStatus("Waiting for session to start...");
            return;
          }

          handleSession(newSessionId);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, profile]);

  const parAccess = profile?.user_type === "Participant";
  const facAccess = profile?.user_type === "Facilitator";

  if (!parAccess && !facAccess) {
    return <AccessError />;
  }

  return (
    <div>
      {parAccess ? <ParticipantsNavBar /> : <TopNavBar />}

      <Main>
        <Container>
          <Heading2>{status}</Heading2>

          {sessionName && <Label>{"Excercise: " + sessionName}</Label>}

          {sessionExists && profile?.id && (
            <Link
              href={`/participants/scenario-overview/${sessionId}/${profile?.id}`}
            >
              <Button>Start Exercise</Button>
            </Link>
          )}
        </Container>
      </Main>
    </div>
  );
}
