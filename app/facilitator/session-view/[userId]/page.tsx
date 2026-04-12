"use client";

import type { UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  fetchPhases,
  fetchPromptsWithResponses,
  fetchRolePhasesBatch,
  fetchTemplateId,
  sessionParticipants,
} from "@/actions/supabase/queries/sessions";
import { Button } from "../styles";

type PromptData = { question: string; answer: string | null };

type PhasePromptData = {
  phaseId: UUID;
  phaseName: string | null;
  prompts: PromptData[];
};

export default function ParticipantDetailView() {
  const { userId } = useParams<{ userId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;

  const [name, setName] = useState("");
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [phaseIds, setPhaseIds] = useState<UUID[]>([]);
  const [phasePrompts, setPhasePrompts] = useState<PhasePromptData[]>([]);
  const [done, setDone] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState<UUID | null>(null);
  const router = useRouter();

  async function getAllPhaseIds(templateId: UUID): Promise<UUID[] | null> {
    const { data, error } = await supabase
      .from("phase")
      .select("phase_id")
      .eq("template_id", templateId);

    if (error) throw error;

    return data?.map(p => p.phase_id) ?? null;
  }

  async function fetchRolePhaseClent(roleId: UUID, phaseId: UUID) {
    const { data, error } = await supabase
      .from("role_phase")
      .select("*")
      .eq("role_id", roleId)
      .eq("phase_id", phaseId)
      .single();

    if (error) throw error;

    return data;
  }

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

    const roleId = participant.role_id;
    const templateIdData = await fetchTemplateId(sessionId);
    const templateId = templateIdData?.template_id;

    if (!templateId) return;
    const phaseIds = await getAllPhaseIds(templateId);

    if (!phaseIds) return;

    const allPhasePrompts: PhasePromptData[] = [];
    for (const phaseId of phaseIds) {
      const rolePhase = await fetchRolePhaseClent(roleId, phaseId);
      if (!rolePhase) continue;

      const prompts = await fetchPromptsWithResponses(
        rolePhase.role_phase_id,
        userId as UUID,
        sessionId,
      );

      const phase = phases.find(p => p.phase_id === phaseId);

      allPhasePrompts.push({
        phaseId,
        phaseName: phase?.phase_name ?? "Unknown Phase",
        prompts,
      });
    }

    setPrompts(promptData);
    setDone(promptData.filter(p => p.answer).length);
    setLoading(false);
    setRoleId(roleId);
    setPhaseIds(phaseIds);
    setPhasePrompts(allPhasePrompts);
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
      <div>RoleID: {roleId}</div>
      <div>PhaseIds: {phaseIds.join(", ")}</div>
      <h2>{name}</h2>
      <p>
        {done}/{prompts.length} responses
      </p>
      <ul>
        {phasePrompts.map((phase, i) => (
          <div key={phase.phaseId}>
            <h3>{phase.phaseName}</h3>
            <ul>
              {phase.prompts.map((prompt, j) => (
                <li key={j}>
                  <div>
                    <b>Question: </b> {prompt.question}
                  </div>
                  <div>
                    <b>Answer: </b> {prompt.answer ?? <i>No response</i>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
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
