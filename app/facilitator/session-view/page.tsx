"use client";

import type { FacilitatorSessionBundle } from "@/actions/supabase/queries/sessions";
import type {
  ParticipantSession,
  ParticipantSessionWithProfile,
  PromptWithResponse,
  UUID,
} from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import supabase from "@/actions/supabase/client";
import { fetchEmailByUserId } from "@/actions/supabase/queries/profile";
import {
  fetchFacilitatorSessionBundle,
  finishSession,
  setSessionGlobalPhaseIndex,
} from "@/actions/supabase/queries/sessions";
import { sendEmailReminder } from "@/actions/supabase/send-email";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import TopNavBar from "@/components/NavBar/NavBar";
import NudgeWarningModal from "@/components/NudgeWarningModal/NudgeWarningModal";
import { useProfile } from "@/utils/ProfileProvider";
import { AnnouncementRoom, sendAnnouncement } from "@/utils/UseAnnouncements";
import {
  Button,
  Container,
  ContentWrapper,
  Heading2,
  Heading3,
  HeadingBox,
  LayoutWrapper,
  MainDiv,
  NormalText,
  NudgeButton,
  ParticipantTable,
  PhaseInformation,
  PhaseStats,
  PhaseStatsLeft,
  PhaseTitle,
  SilverText,
  StatItem,
  TableCell,
  TableCellBold,
  TableHeader,
  TableRow,
} from "./styles";

type ParticipantPromptData = Record<
  UUID,
  { done: number; total: number; prompts: PromptWithResponse[] }
>;

export default function FacilitatorSessionView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID;
  const { userId, profile } = useProfile();
  const router = useRouter();

  const [bundle, setBundle] = useState<FacilitatorSessionBundle | null>(null);
  const [participants, setParticipants] = useState<
    ParticipantSessionWithProfile[]
  >([]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [promptData, setPromptData] = useState<ParticipantPromptData>({});
  const [isAdvancing, setIsAdvancing] = useState(false);

  const [openWarning, setOpenWarning] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedUID, setSelectedUID] = useState<string>("");

  const [announcementMessage, setAnnouncementMessage] = useState<string>("");
  const [announcementType, setAnnouncementType] = useState<
    "everyone" | "role" | "user" | null
  >("everyone");
  const [announcementRoom, setAnnouncementRoom] = useState<AnnouncementRoom>({
    to: "everyone",
    sessionId: sessionId ?? "unknown session",
  });

  function applyBundle(b: FacilitatorSessionBundle) {
    setBundle(b);
    setParticipants(b.participants);
    setCurrentPhase(b.sessionPhaseIndex);
    const data: ParticipantPromptData = {};
    for (const [userId, info] of b.participantPrompts) {
      data[userId] = info;
    }
    setPromptData(data);
  }

  useEffect(() => {
    if (!sessionId || !profile?.id) return;
    let cancelled = false;

    fetchFacilitatorSessionBundle(sessionId, profile.id as UUID).then(
      result => {
        if (cancelled) return;
        if ("error" in result) {
          console.error("Failed to load:", result.error);
          return;
        }
        applyBundle(result);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [sessionId, profile?.id]);

  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`participant-session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participant_session",
          filter: `session_id=eq.${sessionId}`,
        },
        payload => {
          const updated = payload.new as ParticipantSession;
          setParticipants(prev =>
            prev.map(p =>
              p.user_id === updated.user_id
                ? {
                    ...p,
                    phase_index: updated.phase_index ?? 0,
                    is_finished: updated.is_finished,
                  }
                : p,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "session",
          filter: `session_id=eq.${sessionId}`,
        },
        payload => {
          const updated = payload.new;
          if (updated.phase_index != null) {
            setCurrentPhase(updated.phase_index);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !profile?.id) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const debouncedRefetch = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        const result = await fetchFacilitatorSessionBundle(
          sessionId,
          profile.id as UUID,
        );
        if ("error" in result) return;
        applyBundle(result);
      }, 500);
    };

    const channel = supabase
      .channel(`prompt-response-${sessionId}`)
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
  }, [sessionId, profile?.id]);

  const phases = bundle?.phases ?? [];
  const isForceAdvance = bundle?.isForceAdvance ?? false;
  const isAsync = bundle?.isAsync ?? false;
  const isLastPhase = currentPhase >= phases.length;
  const arrayPhaseObject = phases[currentPhase - 1];

  const allDone =
    participants.length > 0 && participants.every(p => p.is_finished);

  const completedCount = participants.filter(p => {
    const data = promptData[p.user_id];
    return data && data.total > 0 && data.done === data.total;
  }).length;

  const totalParticipants = participants.length;

  const roleOptions = participants.map((p): [string, string] => [
    p.role_id ?? "unknown role",
    p.role?.role_name ?? "unknown role",
  ]);
  const userOptions = participants.map((p): [string, string] => [
    p.user_id,
    `${p.profile.first_name} ${p.profile.last_name}`,
  ]);

  // ---- Handlers ----
  function sendSessionAnnouncement(to: AnnouncementRoom, message: string) {
    sendAnnouncement({
      room: to,
      userId: userId ?? "unknown user",
      username: profile?.first_name ?? "Unknown User",
      message,
      sessionId: sessionId,
    });
  }

  async function endGame() {
    try {
      await finishSession(sessionId);
      router.push(`/sessions/session-finish/${sessionId}`);
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  }

  async function advancePhase() {
    if (!sessionId || isAdvancing) return;
    setIsAdvancing(true);

    if (!isLastPhase) {
      if (isForceAdvance) {
        await setSessionGlobalPhaseIndex(sessionId, currentPhase + 1);
        const { error } = await supabase.rpc("advance_phase", {
          p_session_id: sessionId,
          p_current_phase_num: currentPhase,
        });
        if (error) {
          console.error("Failed to advance phase:", error);
          setIsAdvancing(false);
          return;
        }
      }
    } else {
      try {
        await finishSession(sessionId);
        router.push(`/sessions/session-finish/${sessionId}`);
      } catch (err) {
        console.error("Failed to finish session:", err);
      }
    }

    setIsAdvancing(false);
  }

  const isEmailValid = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleConfirm = async () => {
    if (!selectedUID || !sessionId) return;
    try {
      setSending(true);
      const data = await fetchEmailByUserId(selectedUID);
      const em = data?.email as string;
      if (!isEmailValid(em)) {
        console.log("No valid email entered.");
        return;
      }
      setOpenWarning(false);
      await sendEmailReminder(em, sessionId);
    } catch (error) {
      console.error("Error sending nudge:", error);
    } finally {
      setSending(false);
    }
  };

  if (!bundle) return <div>Loading session...</div>;

  return (
    <>
      <TopNavBar />
      <NudgeWarningModal
        open={openWarning}
        onCancel={() => setOpenWarning(false)}
        onConfirm={handleConfirm}
      />
      <LayoutWrapper>
        <ContentWrapper>
          <MainDiv>
            <HeadingBox>
              <Heading3>{bundle.sessionName}</Heading3>
              <Heading2>{bundle.templateName}</Heading2>
            </HeadingBox>

            {isForceAdvance && (
              <PhaseInformation>
                <PhaseTitle>Phase Information</PhaseTitle>
                <PhaseStats>
                  <PhaseStatsLeft>
                    <StatItem>
                      <SilverText>Current Phase:</SilverText>{" "}
                      <NormalText>
                        {arrayPhaseObject?.phase_name ??
                          "Waiting for Phase 1..."}
                      </NormalText>
                    </StatItem>
                    <StatItem>
                      <SilverText>
                        Participants Complete{" "}
                        <NormalText>
                          {completedCount} / {totalParticipants}
                        </NormalText>
                      </SilverText>
                    </StatItem>
                  </PhaseStatsLeft>

                  <StatItem
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Button onClick={advancePhase} disabled={isAdvancing}>
                      {isLastPhase
                        ? isAdvancing
                          ? "Finishing..."
                          : "Finish Session"
                        : isAdvancing
                          ? "Advancing..."
                          : "Force to Next Phase"}
                    </Button>
                  </StatItem>
                </PhaseStats>
              </PhaseInformation>
            )}

            <Container>
              <div>
                <ParticipantTable>
                  <TableHeader>
                    <span>Name</span>
                    <span></span>
                    <span>Role</span>
                    <span>Phase</span>
                    <span>Progress</span>
                  </TableHeader>

                  {participants.map(p => {
                    const data = promptData[p.user_id];
                    const percent =
                      data && data.total > 0
                        ? Math.round((data.done / data.total) * 100)
                        : 0;
                    const arrayIdx = p.phase_index - 1;
                    const participantPhase = phases[arrayIdx];

                    return (
                      <TableRow
                        key={p.user_id}
                        onClick={() =>
                          router.push(
                            `/facilitator/session-view/${p.user_id}?sessionId=${sessionId}`,
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <TableCellBold>
                          {p.profile?.first_name} {p.profile?.last_name}
                        </TableCellBold>
                        <TableCell>
                          <NudgeButton
                            className="nudge-button"
                            onClick={e => {
                              e.stopPropagation();
                              e.preventDefault();
                              setSelectedUID(p.user_id);
                              setOpenWarning(true);
                            }}
                            async={isAsync}
                          >
                            Nudge
                          </NudgeButton>
                        </TableCell>
                        <TableCell>{p.role?.role_name}</TableCell>
                        <TableCell>
                          {participantPhase?.phase_name ?? "Not Started"}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <span
                              style={{
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                              }}
                            >
                              {percent}% Complete
                            </span>
                            <LinearProgress
                              variant="determinate"
                              value={percent}
                              sx={{ flex: 1 }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </ParticipantTable>
              </div>

              <input
                placeholder="Type announcement..."
                value={announcementMessage}
                onChange={e => setAnnouncementMessage(e.target.value)}
              />

              <InputDropdown
                label="Participant user"
                options={new Set(["everyone", "role", "user"])}
                placeholder="Select type of announcement"
                onChange={type => {
                  setAnnouncementType(type as "everyone" | "role" | "user");
                  if (type == "everyone") {
                    setAnnouncementRoom({
                      to: "everyone",
                      sessionId: sessionId ?? "unknown session",
                    });
                  }
                }}
              />

              {announcementType != "everyone" && (
                <InputDropdown
                  label="Participant user"
                  options={
                    new Map(
                      announcementType == "role" ? roleOptions : userOptions,
                    )
                  }
                  placeholder="Select thing to send to"
                  onChange={id => {
                    if (announcementType == "role") {
                      setAnnouncementRoom({
                        to: "role",
                        sessionId: sessionId ?? "unknown session",
                        roleId: id ?? "unknown role",
                      });
                    } else if (announcementType == "user") {
                      setAnnouncementRoom({
                        to: "user",
                        sessionId: sessionId ?? "unknown session",
                        userId: id ?? "unknown user",
                      });
                    }
                  }}
                />
              )}

              <button
                onClick={() =>
                  sendSessionAnnouncement(announcementRoom, announcementMessage)
                }
              >
                Send announcement
              </button>

              {allDone && (
                <h3 style={{ marginTop: "1rem" }}>
                  All participants are finished
                </h3>
              )}
            </Container>

            <Button onClick={endGame}>End Game</Button>
          </MainDiv>
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
