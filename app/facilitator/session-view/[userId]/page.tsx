"use client";

import type {
  ParticipantSessionWithProfile,
  Phase,
  PromptWithResponse,
  UUID,
} from "@/types/schema";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import LinearProgress from "@mui/material/LinearProgress";
import supabase from "@/actions/supabase/client";
import {
  fetchEmailByUserId,
  getProfileById,
} from "@/actions/supabase/queries/profile";
import {
  fetchIsSessionAsync,
  fetchPhases,
  fetchPromptsWithResponses,
  fetchRoleName,
  fetchRolePhases,
  fetchRolePhasesBatch,
  fetchTemplateId,
  getAllPhaseIds,
  sessionParticipants,
} from "@/actions/supabase/queries/sessions";
import { sendEmailReminder } from "@/actions/supabase/send-email";
import Announcements from "@/components/Chat/Announcements";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import NudgeWarningModal from "@/components/NudgeWarningModal/NudgeWarningModal";
import { useProfile } from "@/utils/ProfileProvider";
import { Heading3, SilverHeading3, SilverText } from "../styles";
import {
  ContentDiv,
  Header,
  InfoBox,
  InfoGrid,
  InfoLabel,
  InfoValue,
  NudgeButton,
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
  const { userId: facilitatorUserId } = useProfile();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState<string>("");
  const [prompts, setPrompts] = useState<PromptWithResponse[]>([]);
  const [participants, setParticipants] = useState<
    ParticipantSessionWithProfile[]
  >([]);

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
  const [isAsync, setIsAsync] = useState<boolean>(false);

  const [openWarning, setOpenWarning] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const userSelectedRef = useRef(false);

  const handleNudgeConfirm = async () => {
    if (!userId || !sessionId) return;
    try {
      setSending(true);
      setOpenWarning(false);
      await sendEmailReminder(email, sessionId);
    } catch (err) {
      console.error("Error sending nudge:", err);
    } finally {
      setSending(false);
    }
  };

  async function loadIsAsync() {
    if (!sessionId) return;
    const is_async = await fetchIsSessionAsync(sessionId);
    console.log(is_async);
    setIsAsync(is_async ? is_async : false);
  }

  async function loadData() {
    if (!sessionId || !userId) return;

    const participants = await sessionParticipants(sessionId);
    setParticipants(participants.filter(p => p.user_id !== facilitatorUserId));

    const participant = participants.find(p => p.user_id === userId);
    if (!participant) return;

    const email = await getProfileById(userId);
    if (!email.email) {
      setEmail("no email");
      return;
    }
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
    setRoleName(roleName.role_name);
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
    loadIsAsync();

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
      <NudgeWarningModal
        open={openWarning}
        onCancel={() => setOpenWarning(false)}
        onConfirm={handleNudgeConfirm}
      />

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
          <Header>
            <Heading3>
              {name}, {roleName} <SilverHeading3>(Responses)</SilverHeading3>
            </Heading3>
            <NudgeButton
              async={isAsync}
              onClick={() => setOpenWarning(true)}
              disabled={sending}
            >
              {sending ? "Sending..." : "Nudge"}
            </NudgeButton>
          </Header>
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

        {sessionId && (
          <Announcements
            sessionId={sessionId}
            participants={participants}
            defaultRoom={{ to: "user", userId, sessionId }}
          />
        )}
      </PageLayout>
    </>
  );
}
