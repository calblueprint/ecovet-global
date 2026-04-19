"use client";

import type { Phase, UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import supabase from "@/actions/supabase/client";
import {
  fetchPhases,
  fetchPromptsWithResponses,
  fetchRoleName,
  fetchRolePhasesBatch,
  fetchTemplateId,
  sessionParticipants,
} from "@/actions/supabase/queries/sessions";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import {
  AnnouncementsPanel,
  Button,
  ContentDiv,
  InfoGrid,
  InfoLabel,
  InfoValue,
  PageLayout,
  ParticipantInformation,
  PromptAnswer,
  PromptCard,
  PromptQuestionNumber,
  PromptQuestionText,
  PromptText,
  PromptWrapper,
  SilverText,
} from "../styles";

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
  const [email, setEmail] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [phaseIds, setPhaseIds] = useState<UUID[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [currentPhaseName, setCurrentPhaseName] = useState<string | null>(null);
  const [phasePrompts, setPhasePrompts] = useState<PhasePromptData[]>([]);
  const [done, setDone] = useState(0);
  const percent =
    prompts.length > 0 ? Math.round((done / prompts.length) * 100) : 0;
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState<UUID | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
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

  async function fetchEmail(id: UUID): Promise<string | null> {
    const { data, error } = await supabase
      .from("profile")
      .select("email")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data?.email ?? null;
  }

  async function loadData() {
    if (!sessionId || !userId) return;

    const participants = await sessionParticipants(sessionId);
    const participant = participants.find(p => p.user_id === userId);
    if (!participant) return;

    const email = await fetchEmail(userId);
    setEmail(email);

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
    const roleName = await fetchRoleName(roleId);
    setRoleName(roleName);
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

    setPhases(phases);
    setCurrentPhaseName(phases[phaseIndex]?.phase_name ?? null);
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
    <>
      <TopNavBar />
      <PageLayout>
        <AnnouncementsPanel>{/* Announcements content */}</AnnouncementsPanel>
        <ContentDiv>
          <SilverText
            onClick={() =>
              router.push(`/facilitator/session-view?sessionId=${sessionId}`)
            }
            style={{ cursor: "pointer" }}
          >
            {" "}
            ← Back
          </SilverText>
          <h3>
            {name}, {roleName} <SilverText>(Responses)</SilverText>
          </h3>
          <ParticipantInformation>
            <b>Participant Information</b>
            <InfoGrid>
              <InfoLabel>Email</InfoLabel> <InfoValue>{email}</InfoValue>
              <InfoLabel>Role</InfoLabel> <InfoValue>{roleName}</InfoValue>
              <InfoLabel>Current Phase</InfoLabel>
              <InfoValue>{currentPhaseName ?? "N/A"}</InfoValue>
              <InfoLabel>Answered</InfoLabel>{" "}
              <InfoValue>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    width: "auto",
                    maxWidth: "300px",
                    justifyContent: "",
                  }}
                >
                  <span>
                    {done} / {prompts.length}
                  </span>
                  <span style={{ whiteSpace: "nowrap", fontSize: "14px" }}>
                    {percent}% Complete
                  </span>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </InfoValue>
            </InfoGrid>
          </ParticipantInformation>

          {phasePrompts.map((phase, i) => (
            <PromptCard key={phase.phaseId}>
              <h3>{phase.phaseName}</h3>
              {phase.prompts.map((prompt, j) => (
                <PromptWrapper key={j}>
                  <PromptQuestionNumber>{j + 1} →</PromptQuestionNumber>
                  <PromptQuestionText>
                    Question: {prompt.question}
                  </PromptQuestionText>{" "}
                  <PromptAnswer>
                    {prompt.answer ?? <i>No response</i>}
                  </PromptAnswer>
                </PromptWrapper>
              ))}
            </PromptCard>
          ))}
          <Button
            onClick={() =>
              router.push(`/facilitator/session-view?sessionId=${sessionId}`)
            }
          >
            {" "}
            Back{" "}
          </Button>
        </ContentDiv>
      </PageLayout>
    </>
  );
}
