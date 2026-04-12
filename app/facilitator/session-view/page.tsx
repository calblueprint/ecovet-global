"use client";

import type {
  ParticipantSession,
  ParticipantSessionWithProfile,
  Phase,
  UUID,
} from "@/types/schema";
import { useEffect, useState } from "react";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import supabase from "@/actions/supabase/client";
import {
  fetchPhases,
  fetchPromptsWithResponses,
  fetchRolePhases,
  fetchRolePhasesBatch,
  fetchTemplateNameBySession,
  finishSession,
  isSessionForceAdvance,
  SessionParticipant,
  sessionParticipants,
} from "@/actions/supabase/queries/sessions";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import { useProfile } from "@/utils/ProfileProvider";
import { AnnouncementRoom, sendAnnouncement } from "@/utils/UseAnnouncements";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import { useProfile } from "@/utils/ProfileProvider";
import {
  Button,
  Container,
  ContentWrapper,
  Heading3,
  HeadingBox,
  LayoutWrapper,
  MainDiv,
  NormalText,
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

type PromptCounts = Record<UUID, { done: number; total: number }>;
type PromptData = {
  question: string;
  answer: string | null;
};

type ParticipantPromptData = Record<
  UUID,
  {
    done: number;
    total: number;
    prompts: PromptData[];
  }
>;

export default function FacilitatorSessionView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as UUID | null;
  const { userId, profile } = useProfile();
  const router = useRouter();

  const [participants, setParticipants] = useState<
    ParticipantSessionWithProfile[]
  >([]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [allDone, setAllDone] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isForceAdvance, setIsForceAdvance] = useState(false);
  const isLastPhase = currentPhase >= phases.length - 1;
  const currentPhaseObject = phases[currentPhase];
  const [promptData, setPromptData] = useState<ParticipantPromptData>({});
  const [templateName, setTemplateName] = useState<string | null>(null);

  const [announcementMessage, setAnnouncementMessage] = useState<string>("");
  const [announcementType, setAnnouncementType] = useState<
    "everyone" | "role" | "user" | null
  >("everyone");
  const [announcementRoom, setAnnouncementRoom] = useState<AnnouncementRoom>({
    to: "everyone",
    sessionId: sessionId ?? "unknown session",
  });
  const roleOptions = participants.map((p): [string, string] => [
    p.role_id ?? "unknown role",
    p.role?.role_name ?? "unknown role",
  ]);
  const userOptions = participants.map((p): [string, string] => [
    p.user_id,
    `${p.profile.first_name} ${p.profile.last_name}`,
  ]);

  useEffect(() => {
    if (!sessionId) return;
    if (!profile) return;

    async function loadParticipants() {
      try {
        const psData = await sessionParticipants(sessionId as UUID);
        setParticipants(psData.filter(p => p.user_id !== profile?.id));
        if (psData && psData.length > 0) {
          setCurrentPhase(psData[0].phase_index ?? 0);
        }
      } catch (err) {
        console.error("Failed to load participants:", err);
      }
    }

    async function checkIfForceAdvance() {
      try {
        const isForce = await isSessionForceAdvance(sessionId as UUID);
        setIsForceAdvance(isForce);
      } catch (err) {
        console.error("Failed to check if session is force advance:", err);
      }
    }

    async function loadPhases() {
      try {
        const phasesData = await fetchPhases(sessionId as UUID);
        setPhases(phasesData);
      } catch (err) {
        console.error("Failed to load phases:", err);
      }
    }

    async function loadTemplateName() {
      try {
        const name = await fetchTemplateNameBySession(sessionId as UUID);
        setTemplateName(name);
      } catch (err) {
        console.error("Failed to load template name:", err);
      }
    }

    loadParticipants();
    checkIfForceAdvance();
    loadPhases();
    
    // TODO: check this call from the merge
    loadTemplateName();

  }, [sessionId, profile]);

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
        async payload => {
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

          setCurrentPhase(updated.phase_index ?? 0);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(() => {
    if (!profile?.id || participants.length === 0) return;
    setAllDone(participants.every(p => p.is_finished));
  }, [participants, profile?.id]);

  useEffect(() => {
    if (!sessionId) return;
    if (participants.length === 0) return;
    if (phases.length === 0) return;
    if (!currentPhaseObject) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function loadDataForParticipant(
      p: SessionParticipant,
      phaseIndex: number,
    ) {
      if (!p.role_id) return null;

      const phaseId = phases[phaseIndex]?.phase_id;
      if (!phaseId) return null;

      const rolePhase = await fetchRolePhases(p.role_id, phaseId);
      if (!rolePhase) return null;

      const prompts = await fetchPromptsWithResponses(
        rolePhase.role_phase_id,
        p.user_id,
        sessionId as UUID,
      );

      const total = prompts.length;
      const done = prompts.filter(p => p.answer).length;

      return {
        total,
        done,
        prompts,
      };
    }

    async function loadCounts() {
      console.log("loadCounts sessionId:", sessionId);
      console.log("loadCounts participants:", participants.length);
      const phaseId = currentPhaseObject?.phase_id;
      console.log("loadCounts currentPhaseObject:", phaseId);
      const roleIds = participants
        .map(p => p.role_id)
        .filter(Boolean) as UUID[];

      const rolePhaseMap = await fetchRolePhasesBatch(roleIds, phaseId);

      const data: ParticipantPromptData = {};

      await Promise.all(
        participants.map(async p => {
          try {
            const phaseIndex = isForceAdvance
              ? currentPhase
              : (p.phase_index ?? 0);

            if (!p.role_id) return;

            const rolePhase = rolePhaseMap.get(p.role_id);
            if (!rolePhase) return;

            const prompts = await fetchPromptsWithResponses(
              rolePhase.role_phase_id,
              p.user_id,
              sessionId as UUID,
            );

            data[p.user_id] = {
              total: prompts.length,
              done: prompts.filter(prompt => prompt.answer).length,
              prompts,
            };
          } catch (err) {
            console.error(`Failed for user ${p.user_id}`, err);
          }
        }),
      );

      setPromptData(data);
    }

    loadCounts();

    channel = supabase
      .channel(`prompt-response-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prompt_response",
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          console.log("prompt_response subscription fired");
          loadCounts();
        },
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [sessionId, participants, currentPhase, phases, isForceAdvance]);

  function sendSessionAnnouncement(to: AnnouncementRoom, message: string) {
    sendAnnouncement({
      room: to,
      userId: userId ?? "unknown user",
      username: profile?.first_name ?? "Unknown User",
      message,
    });
  }

  async function advancePhase() {
    if (!sessionId || isAdvancing) return;
    setIsAdvancing(true);

    if (!isLastPhase) {
      const { data, error } = await supabase.rpc("advance_phase", {
        p_session_id: sessionId,
        p_current_phase_num: currentPhase,
      });

      if (error) {
        console.error("Failed to advance phase:", error);
        setIsAdvancing(false);
        return;
      }
    } else {
      try {
        await finishSession(sessionId);
        router.push("/sessions/session-finish/");
      } catch (err) {
        console.error("Failed to finish session:", err);
      }
    }

    setIsAdvancing(false);
  }

  console.log("isForceAdvance:", isForceAdvance);
  console.log("participants:", participants);
  console.log("profile:", profile?.id);
  console.log("Template Name:", templateName);

  const completedCount = participants
    .filter(p => p.user_id !== profile?.id)
    .filter(p => {
      const data = promptData[p.user_id];
      return data && data.total > 0 && data.done === data.total;
    }).length;

  const totalParticipants = participants.filter(
    p => p.user_id !== profile?.id,
  ).length;

  return (
    <>
      <TopNavBar />

      <LayoutWrapper>
        <ContentWrapper>
          <MainDiv>
            <HeadingBox>
              <Heading3>{templateName}</Heading3>
            </HeadingBox>
            {isForceAdvance && (
              <PhaseInformation>
                <PhaseTitle>Phase Information</PhaseTitle>
                <PhaseStats>
                  <PhaseStatsLeft>
                    <StatItem>
                      {" "}
                      <SilverText> Current Phase:</SilverText>{" "}
                      <NormalText>
                        {" "}
                        {phases[currentPhase]?.phase_name}{" "}
                      </NormalText>
                    </StatItem>
                    <StatItem>
                      {" "}
                      <SilverText>
                        Participants Complete{" "}
                        <NormalText>
                          {" "}
                          {completedCount} / {totalParticipants}
                        </NormalText>
                      </SilverText>{" "}
                    </StatItem>
                  </PhaseStatsLeft>

                  <StatItem
                    style={{
                      display: "flex",
                      alignItems: "align-right",
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
                    <span>Role</span>
                    <span>Progress</span>
                  </TableHeader>

                  {participants
                    .filter(p => p.user_id !== profile?.id)
                    .map(p => {
                      console.log("SessionID:", sessionId);
                      console.log("participant object:", p);
                      console.log("first_name:", p.profile?.first_name);
                      console.log("last_name:", p.profile?.last_name);
                      console.log("user_id:", p.user_id);
                      const data = promptData[p.user_id];
                      const percent =
                        data && data.total > 0
                          ? Math.round((data.done / data.total) * 100)
                          : 0;
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
                          <TableCell>{p.role?.role_name}</TableCell>
                          <TableCell>
                            {data ? (
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
                            ) : (
                              <span>(Loading...)</span>
                            )}
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
          label={`Participant user`}
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
            label={`Participant user`}
            options={
              new Map(announcementType == "role" ? roleOptions : userOptions)
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
          click to send to {}
        </button>

              {allDone && (
                <h3 style={{ marginTop: "1rem" }}>
                  All participants are finished
                </h3>
              )}
            </Container>
            
            
          </MainDiv>
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
