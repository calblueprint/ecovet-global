"use client";

import type { Invite, Participant, UUID } from "@/types/schema";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tabs from "@mui/material/Tabs";
import { deleteInvite, fetchInvites } from "@/actions/supabase/queries/invites";
import {
  deleteProfile,
  getProfilesByEmails,
} from "@/actions/supabase/queries/profile";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import InviteComponent from "@/components/InviteComponent/InviteComponent";
import WarningModal from "@/components/WarningModal/WarningModal";
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
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Participant | null>(null);
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
        id: p ? p.id : null,
        invite_id: item.invite_id,
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

  const handleDeleteRow = (participant: Participant) => {
    setPendingDelete(participant);
    setWarningModalOpen(true);
  };

  const handleModalClose = async (shouldDelete: boolean) => {
    setWarningModalOpen(false);
    if (shouldDelete && pendingDelete) {
      if (pendingDelete.invite_accepted && pendingDelete.id) {
        console.log("deleting profile: ", pendingDelete);
        await deleteProfile(pendingDelete.id as UUID);
      } else {
        console.log("deleting invite: ", pendingDelete);
        await deleteInvite(pendingDelete.invite_id as UUID);
      }
      await loadData();
    }
    setPendingDelete(null);
  };

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
          <ParticipantsList
            participants={filteredParticipants}
            onDeleteRow={handleDeleteRow}
          />
        </ContentWrapper>
      </LayoutWrapper>

      <WarningModal open={warningModalOpen} onClose={handleModalClose} />
    </>
  );
}
