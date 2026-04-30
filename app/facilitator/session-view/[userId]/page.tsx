"use client";

import type { ParticipantDetailBundle } from "@/actions/supabase/queries/sessions";
import type {
  ParticipantSessionWithProfile,
  Phase,
  PromptWithResponse,
  RolePhase,
  UUID,
} from "@/types/schema";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import LinearProgress from "@mui/material/LinearProgress";
import supabase from "@/actions/supabase/client";
import { fetchParticipantDetailBundle } from "@/actions/supabase/queries/sessions";
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
  rolePhaseId: UUID;
  prompts: PromptWithResponse[];
};

export default function ParticipantDetailView() {
  const { userId } = useParams<{ userId: string }>();
  const { userId: facilitatorUserId } = useProfile();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;
  const router = useRouter();

  const [bundle, setBundle] = useState<ParticipantDetailBundle | null>(null);
  const [phasePrompts, setPhasePrompts] = useState<PhasePromptData[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<UUID | null>(null);
  const [openWarning, setOpenWarning] = useState(false);
  const [sending, setSending] = useState(false);
  const userSelectedRef = useRef(false);

  function buildPhasePrompts(b: ParticipantDetailBundle): PhasePromptData[] {
    const rolePhasesByPhaseId = new Map(b.rolePhases);
    const promptsByRolePhase = new Map(b.promptsByRolePhase);

    return b.phases.flatMap(phase => {
      const rp = rolePhasesByPhaseId.get(phase.phase_id as UUID);
      if (!rp) return [];
      return [
        {
          phaseId: phase.phase_id as UUID,
          phaseName: phase.phase_name ?? "Unknown Phase",
          rolePhaseId: rp.role_phase_id as UUID,
          prompts: promptsByRolePhase.get(rp.role_phase_id as UUID) ?? [],
        },
      ];
    });
  }

  useEffect(() => {
    if (!sessionId || !userId) return;
    let cancelled = false;

    fetchParticipantDetailBundle(sessionId as UUID, userId as UUID).then(
      result => {
        if (cancelled) return;
        if ("error" in result) {
          console.error("Failed to load:", result.error);
          return;
        }

        setBundle(result);
        setPhasePrompts(buildPhasePrompts(result));

        if (!userSelectedRef.current) {
          const dbPhaseIndex = result.participant.phase_index ?? 0;
          const arrayIdx = dbPhaseIndex - 1;
          const currentPhaseId =
            arrayIdx >= 0 ? result.phases[arrayIdx]?.phase_id : null;
          setSelectedPhaseId(
            (currentPhaseId as UUID) ??
              (result.phases[0]?.phase_id as UUID) ??
              null,
          );
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [sessionId, userId]);

  useEffect(() => {
    if (!bundle || !sessionId || !userId) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const debouncedRefetch = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        const result = await fetchParticipantDetailBundle(
          sessionId as UUID,
          userId as UUID,
        );
        if ("error" in result) return;
        setBundle(result);
        setPhasePrompts(buildPhasePrompts(result));
      }, 500);
      // wait 500 ms before reloading prompts
    };

    const channel = supabase
      .channel(`participant-detail-${userId}-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prompt_response",
          filter: `session_id=eq.${sessionId}`,
        },
        () => debouncedRefetch(),
      )
      .subscribe();

    return () => {
      if (timer) clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [bundle, sessionId, userId]);

  // ---- Derived UI state ----
  const dbPhaseIndex = bundle?.participant.phase_index ?? 0;
  const currentPhaseArrayIdx = dbPhaseIndex - 1;
  const currentPhase =
    currentPhaseArrayIdx >= 0 ? bundle?.phases[currentPhaseArrayIdx] : null;
  const currentPhaseName = currentPhase?.phase_name ?? "Not started";

  const name = bundle
    ? `${bundle.participant.profile?.first_name ?? ""} ${
        bundle.participant.profile?.last_name ?? ""
      }`.trim()
    : "";
  const roleName = bundle?.participant.role?.role_name ?? "Unknown role";

  const selectedPhase = phasePrompts.find(p => p.phaseId === selectedPhaseId);
  const totalPrompts = selectedPhase?.prompts.length ?? 0;
  const donePrompts = selectedPhase
    ? selectedPhase.prompts.filter(
        p => p.answer || p.options?.some(o => o.selected),
      ).length
    : 0;
  const percent =
    totalPrompts > 0 ? Math.round((donePrompts / totalPrompts) * 100) : 0;

  const handleNudgeConfirm = async () => {
    if (!sessionId || !bundle) return;
    try {
      setSending(true);
      setOpenWarning(false);
      await sendEmailReminder(bundle.email, sessionId);
    } catch (err) {
      console.error("Error sending nudge:", err);
    } finally {
      setSending(false);
    }
  };

  if (!bundle) return <div>Loading...</div>;

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
              $selected={phase.phaseId === selectedPhaseId}
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
            ← Back
          </SilverText>

          <Header>
            <Heading3>
              {name}, {roleName} <SilverHeading3>(Responses)</SilverHeading3>
            </Heading3>
            <NudgeButton
              async={bundle.isAsync}
              onClick={() => setOpenWarning(true)}
              disabled={sending}
            >
              {sending ? "Sending..." : "Nudge"}
            </NudgeButton>
          </Header>

          <ParticipantInformation>
            <b>Participant Information</b>
            <InfoGrid>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{bundle.email}</InfoValue>
              <InfoLabel>Role</InfoLabel>
              <InfoValue>{roleName}</InfoValue>
              <InfoLabel>Current Phase</InfoLabel>
              <InfoValue>{currentPhaseName}</InfoValue>
              <InfoLabel>Answered</InfoLabel>
              <InfoValue>
                <InfoBox>
                  <span>
                    {donePrompts} / {totalPrompts}
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

          {selectedPhase && (
            <PromptCard key={selectedPhase.phaseId}>
              <h3>{selectedPhase.phaseName}</h3>
              {selectedPhase.prompts.map((prompt, j) => (
                <PromptWrapper key={prompt.promptId ?? j}>
                  <PromptQuestionNumber>{j + 1} →</PromptQuestionNumber>
                  <PromptQuestionText>
                    Question: {prompt.question}
                  </PromptQuestionText>
                  {prompt.options && prompt.options.length > 0 ? (
                    <OptionList>
                      {prompt.options.map(opt => (
                        <OptionRow key={opt.optionId} $selected={opt.selected}>
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
          )}
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
