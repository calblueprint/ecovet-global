"use client";

import React, { useEffect, useMemo, useState } from "react";
import Tabs from "@mui/material/Tabs";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import InviteComponent from "@/components/InviteComponent/InviteComponent";
import { useProfile } from "@/utils/ProfileProvider";
import {
  ContentWrapper,
  LayoutWrapper,
  ListControlsWrapper,
  ParticipantsSearchInput,
  ParticipantsSearchWrapper,
  StyledTab,
} from "../styles";
import ParticipantsList, { Participant } from "./components/ParticipantsList";

export default function ParticipantsPage() {
  const [status, setStatus] = useState<"active" | "pending">("active");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();

  const loadData = async () => {
    // TODO: Fetch the participants data here and setParticipants()
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchesStatus =
        status === "active" ? p.invite_accepted : !p.invite_accepted;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [participants, status, searchQuery]);

  // handler for when a user clicks a tab
  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: "active" | "pending",
  ) => {
    setStatus(newValue);
  };

  if (!profile?.user_group_id) {
    return <div>Loading! Give it a sec...</div>;
  }

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <ContentWrapper>
          <InviteComponent
            user_group_id={profile.user_group_id}
            onInvitesChange={() => loadData()}
          />
          <ListControlsWrapper>
            <Tabs
              value={status}
              onChange={handleTabChange}
              aria-label="participant status tabs"
            >
              <StyledTab label="Active" value="active" />
              <StyledTab label="Pending" value="pending" />
            </Tabs>

            <ParticipantsSearchWrapper>
              <ParticipantsSearchInput
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </ParticipantsSearchWrapper>
          </ListControlsWrapper>

          {/* 3. Filtered list component */}
          <ParticipantsList participants={filteredParticipants} />
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
