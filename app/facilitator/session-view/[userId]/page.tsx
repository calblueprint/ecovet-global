"use client";

import type { UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  fetchPhases,
  fetchPromptsWithResponses,
  fetchRolePhasesBatch,
  sessionParticipants,
} from "@/actions/supabase/queries/sessions";
import { Button } from "../styles";

type PromptData = { question: string; answer: string | null };

export default function ParticipantDetailView() {
  const { userId } = useParams<{ userId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;

  const [name, setName] = useState("");
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [done, setDone] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function loadData() {
    if (!sessionId || !userId) return;

    const participants = await sessionParticipants(sessionId);
    const participant = participants.find(p => p.user_id === userId);
    if (!participant) return;

    setName(
      `${participant.profile?.first_name} ${participant.profile?.last_name}`,
    );

    const phases = await fetchPhases(sessionId);
    const phaseIndex = participant.phase_index ?? 0;
    const currentPhase = phases[phaseIndex];
    if (!currentPhase || !participant.role_id) return;

    const rolePhaseMap = await fetchRolePhasesBatch(
      [participant.role_id],
      currentPhase.phase_id,
    );
    const rolePhase = rolePhaseMap.get(participant.role_id);
    if (!rolePhase) return;

    const promptData = await fetchPromptsWithResponses(
      rolePhase.role_phase_id,
      userId as UUID,
      sessionId,
    );

    setPrompts(promptData);
    setDone(promptData.filter(p => p.answer).length);
    setLoading(false);
  }

  useEffect(() => {
    loadData();

    // Live updates when responses change
    const channel = supabase
      .channel(`participant-detail-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prompt_response",
          filter: `session_id=eq.${sessionId}`,
        },
        () => loadData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <h2>{name}</h2>
      <p>
        {done}/{prompts.length} responses
      </p>

      <ul>
        {prompts.map((prompt, i) => (
          <li key={i}>
            <div>
              <b>Q:</b> {prompt.question}
            </div>
            <div>
              <b>A:</b> {prompt.answer ?? <i>No response</i>}
            </div>
          </li>
        ))}
      </ul>

      <Button
        onClick={() =>
          router.push(`/facilitator/session-view?sessionId=${sessionId}`)
        }
      >
        {" "}
        Back{" "}
      </Button>
    </main>
  );
}
