"use client";

import type { Phase, PromptWithResponse, UUID } from "@/types/schema";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import supabase from "@/actions/supabase/client";
import { getProfileById } from "@/actions/supabase/queries/profile";
import {
  fetchPhases,
  fetchPromptsWithResponses,
  fetchRoleName,
  fetchRolePhases,
  fetchRolePhasesBatch,
  fetchTemplateId,
  getAllPhaseIds,
  sessionParticipants,
} from "@/actions/supabase/queries/sessions";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import { Heading3, SilverHeading3, SilverText } from "../styles";
import {
  ContentDiv,
  InfoBox,
  InfoGrid,
  InfoLabel,
  InfoValue,
  LoadingScreen,
  OptionList,
  OptionRow,
  PageLayout,
  ParticipantInformation,
  PhaseList,
  PromptAnswer,
  PromptCard,
  PromptQuestionNumber,
  PromptQuestionText,
  PromptWrapper,
  RadioCircle,
  Sidebar,
} from "./styles";

type PhasePromptData = {
  phaseId: UUID;
  phaseName: string | null;
  prompts: PromptWithResponse[];
};

export default function ParticipantDetailView() {
  const { userId } = useParams<{ userId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<PromptWithResponse[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<UUID | null>(null);
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
  const userSelectedRef = useRef(false);

  async function loadData() {
    if (!sessionId || !userId) return;

    const participants = await sessionParticipants(sessionId);
    const participant = participants.find(p => p.user_id === userId);
    if (!participant) return;

    const email = await getProfileById(userId);
    setEmail(email.email);

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
      const rolePhase = await fetchRolePhases(roleId, phaseId);
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
    setDone(
      promptData.filter(p => p.answer || p.options?.some(o => o.selected))
        .length,
    );
    setLoading(false);
    setRoleId(roleId);
    setPhaseIds(phaseIds);
    setPhasePrompts(allPhasePrompts);
    if (!userSelectedRef.current) {
      const currentPhaseId = phases[phaseIndex]?.phase_id;
      const defaultId =
        allPhasePrompts.find(p => p.phaseId === currentPhaseId)?.phaseId ??
        allPhasePrompts[0]?.phaseId ??
        null;
      setSelectedPhaseId(defaultId);
    }
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

  if (loading)
    return (
      <LoadingScreen>
        <CircularProgress color="inherit" aria-label="Loading…" />
      </LoadingScreen>
    );

  return (
    <>
      <TopNavBar />

      <PageLayout>
        <Sidebar>
          <h3>Phases</h3>
          {phasePrompts.map(phase => (
            <PhaseList
              key={phase.phaseId}
              onClick={() => {
                userSelectedRef.current = true;
                setSelectedPhaseId(phase.phaseId);
              }}
            >
              {phase.phaseName}
            </PhaseList>
          ))}
        </Sidebar>
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
          <Heading3>
            {name}, {roleName} <SilverHeading3>(Responses)</SilverHeading3>
          </Heading3>
          <ParticipantInformation>
            <b>Participant Information</b>
            <InfoGrid>
              <InfoLabel>Email</InfoLabel> <InfoValue>{email}</InfoValue>
              <InfoLabel>Role</InfoLabel> <InfoValue>{roleName}</InfoValue>
              <InfoLabel>Current Phase</InfoLabel>
              <InfoValue>{currentPhaseName ?? "N/A"}</InfoValue>
              <InfoLabel>Answered</InfoLabel>{" "}
              <InfoValue>
                <InfoBox>
                  <span>
                    {done} / {prompts.length}
                  </span>
                  <span style={{ whiteSpace: "nowrap", fontSize: "14px" }}>
                    {percent}% Complete
                  </span>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{ flex: 1, width: "100%" }}
                  />
                </InfoBox>
              </InfoValue>
            </InfoGrid>
          </ParticipantInformation>

          {phasePrompts
            .filter(phase => phase.phaseId === selectedPhaseId)
            .map(phase => (
              <PromptCard key={phase.phaseId}>
                <h3>{phase.phaseName}</h3>
                {phase.prompts.map((prompt, j) => (
                  <PromptWrapper key={j}>
                    <PromptQuestionNumber>{j + 1} →</PromptQuestionNumber>
                    <PromptQuestionText>
                      Question: {prompt.question}
                    </PromptQuestionText>{" "}
                    {prompt.options && prompt.options.length > 0 ? (
                      <OptionList>
                        {prompt.options.map(opt => (
                          <OptionRow
                            key={opt.optionId}
                            $selected={opt.selected}
                          >
                            <RadioCircle $selected={opt.selected} />
                            <span>{opt.text}</span>
                          </OptionRow>
                        ))}
                      </OptionList>
                    ) : (
                      <PromptAnswer>
                        {prompt.answer ?? "No response"}
                      </PromptAnswer>
                    )}
                  </PromptWrapper>
                ))}
              </PromptCard>
            ))}
        </ContentDiv>
      </PageLayout>
    </>
  );
}
