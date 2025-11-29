"use client";

import React, { useCallback, useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  fetchUserGroupById,
  fetchUserGroupMembers,
} from "@/api/supabase/queries/user-groups";
import { Profile } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { Heading3, MainDiv, TemplateList, TemplateTitle } from "./styles";

export default function Participants() {
  const { profile } = useProfile();
  const user_group_id = profile?.user_group_id;
  const [allParticipants, setAllParticipants] = useState<Profile[]>([]);

  const loadData = useCallback(async () => {
    const [groupMembers] = await Promise.all([
      fetchUserGroupById(user_group_id as UUID),
      fetchUserGroupMembers(user_group_id as UUID),
    ]);

    categorizeMembers(groupMembers || []);

    console.log(groupMembers);
  }, [user_group_id]);

  function categorizeMembers(members: Profile[]) {
    const participants = members.filter(m => m.user_type === "Participant");

    setAllParticipants(participants);
  }

  useEffect(() => {
    if (user_group_id) {
      loadData();
    }
  }, [user_group_id, loadData]);

  return (
    <MainDiv>
      <Heading3>Participants</Heading3>
      <TemplateTitle>
        <span>Name </span>
        <span>Role</span>
      </TemplateTitle>
      {allParticipants.map(participant => (
        <TemplateList key={participant.id}>
          <span>
            {" "}
            {participant.first_name} + {participant.last_name}{" "}
          </span>
          <span> {participant.org_role}</span>
        </TemplateList>
      ))}
    </MainDiv>
  );
}
