"use client";

import { useEffect, useState } from "react";
import supabase from "@/actions/supabase/client";
import { fetchSessionById } from "@/api/supabase/queries/profile";
import { fetchTemplateId } from "@/api/supabase/queries/sessions";
import { useProfile } from "@/utils/ProfileProvider";
import {
  Button,
  Container,
  Heading2,
  Heading3,
  Input,
  InputDiv,
  InputFields,
  IntroText,
  Label,
  Main,
  WelcomeTag,
} from "./styles";

export default function ParticipantWaitingPage() {
  const { profile } = useProfile();
  const [status, setStatus] = useState("Waiting for session to start...");

  useEffect(() => {
    if (!profile?.id) return;

    async function initialLoad() {
      if (!profile?.id) return;
      const data = await fetchSessionById(profile.id);

      if (data?.session_id) {
        const template = await fetchTemplateId(data.session_id);
        setStatus(
          `Session has just started with templateId: ${template.template_id}`,
        );
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
            const template = await fetchTemplateId(sessionId);
            setStatus(
              `Session has just started with templateId: ${template.template_id}`,
            );
          })();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  return (
    <Main>
      <Heading2>{status}</Heading2>
    </Main>
  );
}
