"use client";

import type { Invite, Participant, UUID } from "@/types/schema";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tabs from "@mui/material/Tabs";
import { fetchInvites } from "@/actions/supabase/queries/invites";
import { getProfilesByEmails } from "@/actions/supabase/queries/profile";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import InviteComponent from "@/components/InviteComponent/InviteComponent";
import { useProfile } from "@/utils/ProfileProvider";
import ParticipantsList from "./components/ParticipantsList";
import {
  ContentWrapper,
  LayoutWrapper,
  ListControlsWrapper,
  ParticipantsSearchInput,
  ParticipantsSearchWrapper,
  StyledTab,
} from "./styles";

export default function ParticipantsPage() {
  const [status, setStatus] = useState<"Accepted" | "Pending">("Accepted");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();

  const loadData = useCallback(async () => {
    if (!profile?.user_group_id) return;

    const data = await fetchInvites(profile.user_group_id as UUID);
    if (!data) return;

    const emails = data.map(item => item.email).filter(Boolean) as string[];
    const profiles = await getProfilesByEmails(emails);
    const profileByEmail = Object.fromEntries(profiles.map(p => [p.email, p]));

    const formattedData: Participant[] = data.map((item: Invite) => {
      const p = profileByEmail[item.email ?? ""];
      return {
        id: item.invite_id,
        name: p
          ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || null
          : null,
        email: item.email,
        role: item.user_type,
        last_active: null,
        invite_accepted: item.status === "Accepted",
      };
    });

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

          <ParticipantsList participants={filteredParticipants} />
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
