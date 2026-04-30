"use client";

import type { PDFSession, Session } from "@/types/schema";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import { fetchSessionsbyUserGroup } from "@/actions/supabase/queries/sessions";
import ParticipantNavBar from "@/components/ParticipantsNavBar/ParticipantsNavBar";
import { useProfile } from "@/utils/ProfileProvider";
import {
  ContentWrapper,
  EmptyMessage,
  LayoutWrapper,
  PageTitle,
  PdfButton,
  SearchBarStyled,
  SearchInput,
  StyledTab,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTd,
  StyledTh,
  SyncBadge,
  TabControlsWrapper,
  TabSection,
} from "./styles";

type ActiveTab = "active" | "past";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ParticipantPastSessionsPage() {
  const { profile } = useProfile();
  const router = useRouter();
  const [sessions, setSessions] = useState<PDFSession[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("active");
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!profile?.user_group_id) return;
    const userGroupId = profile.user_group_id;

    (async () => {
      if (!profile.user_group_id) return;
      const data =
        (await fetchSessionsbyUserGroup(profile.user_group_id)) ?? [];

      const enriched = data.map(s => {
        const tn = s.template?.template_name ?? "Untitled";
        const dateStr = s.created_at
          ? new Date(s.created_at).toLocaleDateString("en-CA")
          : "";
        return { ...s, displayName: `${tn}_${dateStr}` };
      });

      setSessions(enriched);
    })();
  }, [profile?.user_group_id]);

  const activeSessions = sessions.filter(s => !s.is_finished);
  const pastSessions = sessions.filter(s => s.is_finished === true);
  const displayedSessions = (
    activeTab === "active" ? activeSessions : pastSessions
  ).filter(s =>
    s.displayName.toLowerCase().includes(searchInput.trim().toLowerCase()),
  );

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: ActiveTab,
  ) => {
    setActiveTab(newValue);
  };

  function handleRowClick(session: PDFSession) {
    if (activeTab === "active" && profile?.id) {
      router.push(
        `/participants/scenario-overview/${session.session_id}/${profile.id}`,
      );
    }
    // past rows are not clickable for participants
  }

  async function handleViewPdf(sessionId: string) {
    setPdfLoading(sessionId);
    try {
      const res = await fetch(`/api/reports/session/${sessionId}`);
      const json = await res.json();
      if (json.url) {
        window.open(json.url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setPdfLoading(null);
    }
  }

  return (
    <>
      <ParticipantNavBar />

      <LayoutWrapper>
        <ContentWrapper>
          <PageTitle>Sessions</PageTitle>

          <TabSection>
            <TabControlsWrapper>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="session status tabs"
              >
                <StyledTab label="Active" value="active" />
                <StyledTab label="Past" value="past" />
              </Tabs>
            </TabControlsWrapper>

            <SearchBarStyled>
              <SearchInput
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search sessions..."
              />
            </SearchBarStyled>
          </TabSection>

          <StyledTable>
            <StyledTableHead>
              <tr>
                <StyledTh>Name</StyledTh>
                <StyledTh>Sync Mode</StyledTh>
                <StyledTh>
                  {activeTab === "active" ? "Date Started" : "Date Completed"}
                </StyledTh>
                {activeTab === "past" && <StyledTh>Report</StyledTh>}
              </tr>
            </StyledTableHead>
            <tbody>
              {displayedSessions.length === 0 ? (
                <tr>
                  <EmptyMessage colSpan={activeTab === "past" ? 4 : 3}>
                    No {activeTab === "active" ? "active" : "past"} sessions
                    found.
                  </EmptyMessage>
                </tr>
              ) : (
                displayedSessions.map(session => (
                  <StyledTableRow
                    key={session.session_id}
                    $clickable={activeTab === "active"}
                    onClick={() => handleRowClick(session)}
                  >
                    <StyledTd>{session.displayName}</StyledTd>
                    <StyledTd>
                      <SyncBadge>
                        {session.is_async ? "Async" : "Sync"}
                      </SyncBadge>
                    </StyledTd>
                    <StyledTd>{formatDate(session.created_at)}</StyledTd>
                    {activeTab === "past" && (
                      <StyledTd>
                        <PdfButton
                          onClick={e => {
                            e.stopPropagation();
                            handleViewPdf(session.session_id);
                          }}
                          disabled={pdfLoading === session.session_id}
                        >
                          {pdfLoading === session.session_id ? (
                            <CircularProgress
                              color="inherit"
                              aria-label="Loading…"
                            />
                          ) : (
                            "View PDF"
                          )}
                        </PdfButton>
                      </StyledTd>
                    )}
                  </StyledTableRow>
                ))
              )}
            </tbody>
          </StyledTable>
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
