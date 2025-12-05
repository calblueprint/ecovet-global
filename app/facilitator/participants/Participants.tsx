"use client";

import React, { useCallback, useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  // fetchUserGroupById,
  fetchUserGroupMembers,
} from "@/api/supabase/queries/user-groups";
import { Profile } from "@/types/schema";
// import { useProfile } from "@/utils/ProfileProvider";
import { Heading3, MainDiv, TemplateList, TemplateTitle } from "./styles";

export default function Participants({
  user_group_id,
}: {
  user_group_id: string;
}) {
  // const { profile } = useProfile();
  // const user_group_id = "0b73ed2d-61c3-472e-b361-edaa88f27622";
  const [allUsers, setAllUsers] = useState<Profile[]>([]);

  const loadData = useCallback(async () => {
    const [groupMembers] = await Promise.all([
      fetchUserGroupMembers(user_group_id as UUID),
    ]);
    setAllUsers(groupMembers ?? []);

    console.log(groupMembers);
  }, [user_group_id]);

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
        <span>Email</span>
        <span>Role</span>
      </TemplateTitle>
      {allUsers.map(groupMember => (
        <TemplateList key={groupMember.id}>
          <span>
            {" "}
            {groupMember.first_name} {groupMember.last_name}{" "}
          </span>
          <span> {groupMember.email} </span>
          <span> {groupMember.user_type}</span>
        </TemplateList>
      ))}
    </MainDiv>
  );
}
