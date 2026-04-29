"use client";

import type { PDFSession, Session } from "@/types/schema";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Tabs from "@mui/material/Tabs";
import { fetchSessionsbyUserGroup } from "@/actions/supabase/queries/sessions";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import FacilitatorNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import { useProfile } from "@/utils/ProfileProvider";
import {
  ContentWrapper,
  EmptyMessage,
  LayoutWrapper,
  PageTitle,
  PdfArrow,
  PdfButton,
  PdfLabel,
  SearchBarStyled,
  SearchIconWrapper,
  SearchInput,
  StartExerciseButton,
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

export default function FacilitatorExercisesPage() {
  const { profile } = useProfile();
  const router = useRouter();
  const [sessions, setSessions] = useState<PDFSession[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("active");
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!profile?.user_group_id) return;

    (async () => {
      if (!profile.user_group_id) return;
      const data =
        (await fetchSessionsbyUserGroup(profile.user_group_id)) ?? [];

      const enriched = data.map(s => {
        const displayName = s.session_name
          ? s.session_name
          : (() => {
              const tn = s.template?.template_name ?? "Untitled";
              const dateStr = s.created_at
                ? new Date(s.created_at).toLocaleDateString("en-CA")
                : "";
              return `${tn}_${dateStr}`;
            })();
        return { ...s, displayName };
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
    if (activeTab === "active") {
      router.push(`/facilitator/session-view?sessionId=${session.session_id}`);
    } else {
      router.push(`/sessions/session-finish/${session.session_id}`);
    }
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
      <FacilitatorNavBar />

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
              <StartExerciseButton
                onClick={() => router.push("/facilitator/exercises/start")}
              >
                Start Exercise
              </StartExerciseButton>
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
                <StyledTh>
                  {activeTab === "active" ? "In Progress Report" : "Report"}
                </StyledTh>
              </tr>
            </StyledTableHead>
            <tbody>
              {displayedSessions.length === 0 ? (
                <tr>
                  <EmptyMessage colSpan={4}>
                    No {activeTab === "active" ? "active" : "past"} sessions
                    found.
                  </EmptyMessage>
                </tr>
              ) : (
                displayedSessions.map(session => (
                  <StyledTableRow
                    key={session.session_id}
                    onClick={() => handleRowClick(session)}
                  >
                    <StyledTd>{session.displayName}</StyledTd>
                    <StyledTd>
                      <SyncBadge>
                        {session.is_async ? "Async" : "Sync"}
                      </SyncBadge>
                    </StyledTd>
                    <StyledTd>{formatDate(session.created_at)}</StyledTd>
                    <StyledTd>
                      <PdfButton
                        onClick={e => {
                          e.stopPropagation();
                          handleViewPdf(session.session_id);
                        }}
                        disabled={pdfLoading === session.session_id}
                      >
                        {pdfLoading === session.session_id ? (
                          "Loading..."
                        ) : (
                          <PdfLabel>View PDF</PdfLabel>
                        )}
                      </PdfButton>
                    </StyledTd>
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
