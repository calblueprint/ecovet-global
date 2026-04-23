"use client";

import type { UserGroup } from "@/types/schema";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { fetchUserGroups } from "@/actions/supabase/queries/user-groups";
import {
  Heading3,
  SearchInput2,
  SideNavButton,
  SideNavNewTemplateButton,
  SideNavTemplatesContainer,
} from "@/app/admin/styles";
import Plus from "@/assets/images/plus.svg";

export default function UserGroupSideBar({
  selectedUserGroupId,
  setSelectedUserGroupId,
  onAddClick,
}: {
  selectedUserGroupId: string | null;
  setSelectedUserGroupId: (id: string) => void;
  onAddClick: () => void;
}) {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadUserGroups() {
      const data = await fetchUserGroups();
      if (data) setUserGroups(data);
    }

    loadUserGroups();
  }, []);

  const filteredGroups = useMemo(() => {
    return userGroups.filter(group =>
      group.user_group_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [userGroups, search]);

  return (
    <SideNavTemplatesContainer>
      <Heading3>Organizations</Heading3>

      <SearchInput2
        type="text"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filteredGroups.map(group => (
        <SideNavButton
          key={group.user_group_id}
          $selected={selectedUserGroupId === group.user_group_id}
          onClick={() => setSelectedUserGroupId(group.user_group_id)}
        >
          {group.user_group_name}
        </SideNavButton>
      ))}

      <SideNavNewTemplateButton onClick={onAddClick}>
        <Image src={Plus} alt="+" width={10} height={10} /> Add Organization
      </SideNavNewTemplateButton>
    </SideNavTemplatesContainer>
  );
}
