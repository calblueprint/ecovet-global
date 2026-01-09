"use client";

import { useCallback, useEffect, useState } from "react";
import { UUID } from "crypto";
import { fetchInvites } from "@/api/supabase/queries/invites";
import {
  fetchUserGroupById,
  fetchUserGroupMembers,
} from "@/api/supabase/queries/user-groups";
import { Invite, Profile, UserGroup } from "@/types/schema";
import {
  GeneralList,
  GeneralTitle,
  Heading3,
  Heading4,
  MainDiv,
  SideNavNewTemplateButton,
} from "../styles";

export default function UserGroupDetails({
  user_group_id,
  onBack,
}: {
  user_group_id: string;
  onBack?: () => void;
}) {
  const [userGroup, setUserGroup] = useState<UserGroup | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [allFacilitators, setAllFacilitators] = useState<Profile[]>([]);
  const [allParticipants, setAllParticipants] = useState<Profile[]>([]);

  const loadData = useCallback(async () => {
    const [userGroupDetails, groupMembers, groupInvites] = await Promise.all([
      fetchUserGroupById(user_group_id as UUID),
      fetchUserGroupMembers(user_group_id as UUID),
      fetchInvites(user_group_id as UUID),
    ]);

    setUserGroup(userGroupDetails || null);
    setInvites(groupInvites || []);
    categorizeMembers(groupMembers || []);

    console.log(groupMembers);
    console.log(groupInvites);
  }, [user_group_id]);

  function categorizeMembers(members: Profile[]) {
    const facilitators = members.filter(m => m.user_type === "Facilitator");
    const participants = members.filter(m => m.user_type === "Participant");

    setAllFacilitators(facilitators);
    setAllParticipants(participants);
  }

  useEffect(() => {
    if (user_group_id) loadData();
  }, [user_group_id, loadData]);

  return (
    <MainDiv>
      <Heading3>Group Details: {userGroup?.user_group_name}</Heading3>

      <Heading4>Facilitators</Heading4>
      <GeneralTitle>
        <span>Name</span>
      </GeneralTitle>
      {allFacilitators.map(mem => (
        <GeneralList key={mem.id}>
          <span>
            {mem.first_name} {mem.last_name}
          </span>
        </GeneralList>
      ))}

      <Heading4>Participants</Heading4>
      <GeneralTitle>
        <span>Name</span>
      </GeneralTitle>
      {allParticipants.map(mem => (
        <GeneralList key={mem.id}>
          <span>
            {mem.first_name} {mem.last_name}
          </span>
        </GeneralList>
      ))}

      <Heading4>Invites</Heading4>
      <GeneralTitle>
        <span>Email</span>
      </GeneralTitle>
      {invites.map(inv => (
        <GeneralList key={inv.invite_id}>
          <span>{inv.email}</span>
        </GeneralList>
      ))}
    </MainDiv>
  );
}
