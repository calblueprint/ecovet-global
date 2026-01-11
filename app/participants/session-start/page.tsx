"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!profile?.id) return;

    async function initialLoad() {
      if (!profile?.id) return;
      const data = await fetchSessionById(profile.id);

      if (data?.session_id) {
        const sessionName = await fetchSessionName(data.session_id);
        setSessionName(sessionName.session_name);
        setStatus(`You were invited as a participant in:`);
        setSessionExists(true);
      }
    }

    initialLoad();

    const channel = supabase
      .channel(`profile-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profile",
          filter: `id=eq.${profile.id}`,
        },
        payload => {
          const sessionId = payload.new?.session_id;
          console.log("Received profile update:", payload);

          if (!sessionId) {
            setStatus("Waiting for session to start...");
            return;
          }

          (async () => {
            const sessionName = await fetchSessionName(sessionId);
            setSessionName(sessionName.session_name);
            setStatus(`You were invited as a participant in:`);
          })();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  return (
    <>
      <ParticipantsNavBar />
      <Main>
        <Container>
          <Heading2>{status}</Heading2>

          {sessionName && <Label>{sessionName}</Label>}
          {sessionExists && <Button>Start Session</Button>}
        </Container>
      </Main>
    </>
  );
}
