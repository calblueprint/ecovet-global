"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import supabase from "@/actions/supabase/client";
import { fetchSessionById } from "@/api/supabase/queries/profile";
import { fetchSessionName } from "@/api/supabase/queries/sessions";
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

      const session = await fetchSessionName(sessionId);

      setSessionId(sessionId);
      setSessionName(session.session_name);
      setStatus(`You were invited as a participant.`);
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

  return (
    <div>
      <ParticipantsNavBar />
      <Main>
        <Container>
          <Heading2>{status}</Heading2>

          {sessionName && <Label>{sessionName}</Label>}

          {sessionExists && (
            <Link
              href={{
                pathname: "/participants/session-flow",
                query: { sessionId },
              }}
            >
              <Button>Start Session</Button>
            </Link>
          )}
        </Container>
      </Main>
    </div>
  );
}
