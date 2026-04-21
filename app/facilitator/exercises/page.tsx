"use client";

import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import type { Session } from "@/types/schema";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Tabs from "@mui/material/Tabs";
import { fetchSessionsbyUserGroup } from "@/actions/supabase/queries/sessions";
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
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("active");
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!profile?.user_group_id) return;

    (async () => {
      const data =
        (await fetchSessionsbyUserGroup(profile.user_group_id!)) ?? [];
      setSessions(data);
    })();
  }, [profile]);

  const activeSessions = sessions.filter(s => !s.is_finished);
  const pastSessions = sessions.filter(s => s.is_finished === true);
  const displayedSessions = (
    activeTab === "active" ? activeSessions : pastSessions
  ).filter(s =>
    (s.session_name ?? "")
      .toLowerCase()
      .includes(searchInput.trim().toLowerCase()),
  );

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: ActiveTab,
  ) => {
    setActiveTab(newValue);
  };

  function handleRowClick(session: Session) {
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
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.59399 4.9751C7.59399 5.00849 7.58498 5.04171 7.5686 5.0708C7.56052 5.08508 7.55061 5.09814 7.53931 5.10986L7.50024 5.14111L2.0979 8.37646V8.37744C2.06862 8.39435 2.03502 8.40366 2.00122 8.40381C1.96746 8.4039 1.93391 8.39507 1.90454 8.37842C1.87517 8.36168 1.85045 8.33721 1.83325 8.30811C1.81605 8.27887 1.80628 8.24534 1.80591 8.21143V1.73877C1.80628 1.70485 1.81605 1.67133 1.83325 1.64209C1.85045 1.61298 1.87517 1.58852 1.90454 1.57178C1.93391 1.55513 1.96746 1.54629 2.00122 1.54639C2.01811 1.54646 2.03485 1.54885 2.05103 1.55322L2.0979 1.57275L7.50024 4.80908C7.52866 4.82632 7.55223 4.85048 7.5686 4.87939C7.58498 4.90849 7.59399 4.94171 7.59399 4.9751Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1.14286"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Start Exercise
              </StartExerciseButton>
            </TabControlsWrapper>

            <SearchBarStyled>
              <SearchIconWrapper>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_search_fac)">
                    <path
                      d="M8.75 8.75L6.9375 6.9375M7.91667 4.58333C7.91667 6.42428 6.42428 7.91667 4.58333 7.91667C2.74238 7.91667 1.25 6.42428 1.25 4.58333C1.25 2.74238 2.74238 1.25 4.58333 1.25C6.42428 1.25 7.91667 2.74238 7.91667 4.58333Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_search_fac">
                      <rect width="10" height="10" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </SearchIconWrapper>
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
                    onClick={() => handleRowClick(session)}
                  >
                    <StyledTd>
                      {session.session_name ?? "Unnamed Session"}
                    </StyledTd>
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
                            "Loading..."
                          ) : (
                            <PdfLabel>
                              View PDF
                              <PdfArrow
                                width="0.65rem"
                                height="0.65rem"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_3667_21991)">
                                  <path
                                    d="M1 5H9M9 5L5 1M9 5L5 9"
                                    stroke="#4B4A49"
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_3667_21991">
                                    <rect width="10" height="10" fill="white" />
                                  </clipPath>
                                </defs>
                              </PdfArrow>
                            </PdfLabel>
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
