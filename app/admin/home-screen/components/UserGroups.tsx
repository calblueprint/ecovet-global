"use client";

import type { UserGroup } from "@/types/schema";
import { useEffect, useState } from "react";
import { fetchUserGroups } from "@/actions/supabase/queries/user-groups";
import {
  GeneralListUser,
  GeneralTitle,
  Heading3,
  MainDiv,
  NumUsers,
} from "@/app/admin/styles";

export default function UserGroups({
  onSelectGroup,
}: {
  onSelectGroup?: (userGroupId: string) => void;
}) {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);

  useEffect(() => {
    async function loadUserGroups() {
      const fetched = await fetchUserGroups();
      if (fetched) setUserGroups(fetched);
    }
    loadUserGroups();
  }, []);

  return (
    <MainDiv>
      <Heading3>User Groups</Heading3>

      <GeneralTitle>
        <span>Group</span>
        <span>Members</span>
      </GeneralTitle>

      {userGroups.map(group => (
        <GeneralListUser
          key={group.user_group_id}
          onClick={() => onSelectGroup?.(group.user_group_id)}
          role="button"
          tabIndex={0}
        >
          <span>{group.user_group_name}</span>
          <NumUsers>{group.num_users}</NumUsers>
        </GeneralListUser>
      ))}
    </MainDiv>
  );
}
