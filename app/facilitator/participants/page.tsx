"use client";

import type { Invite, UUID } from "@/types/schema";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tabs from "@mui/material/Tabs";
import { fetchInvites } from "@/actions/supabase/queries/invites";
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
  const [status, setStatus] = useState<"Accepted" | "Pending">("Accepted");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();

  const loadData = useCallback(async () => {
    if (!profile?.user_group_id) return;

    const [data] = await Promise.all([
      fetchInvites(profile.user_group_id as UUID),
    ]);

    const formattedData: Participant[] = (data || []).map((item: Invite) => ({
      id: item.invite_id,
      name: null, // don't see name in the supabase so currently not including it
      email: item.email,
      role: item.user_type,
      last_active: null, // same with last active
      invite_accepted: item.status, // This controls the tab placement
    }));
    setParticipants(formattedData);
  }, [profile?.user_group_id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchesStatus =
        status === "Accepted" ? p.invite_accepted : !p.invite_accepted;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (p.name?.toLowerCase() ?? "").includes(q) ||
        (p.email?.toLowerCase() ?? "").includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [participants, status, searchQuery]);

  // handler for when a user clicks a tab
  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: "Accepted" | "Pending",
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
              <StyledTab label="Accepted" value="Accepted" />
              <StyledTab label="Pending" value="Pending" />
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
