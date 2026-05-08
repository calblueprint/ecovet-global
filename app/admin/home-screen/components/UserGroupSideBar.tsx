"use client";

import type { UserGroup } from "@/types/schema";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchUserGroups } from "@/actions/supabase/queries/user-groups";
import {
  Heading3,
  SearchInput2,
  SideNavButton,
  SideNavNewTemplateButton,
  SideNavTemplatesContainer,
} from "@/app/admin/styles";
import Plus from "@/assets/images/plus.svg";
import AddUserGroups from "./AddUserGroup";
import { Buttons, Groups, Header, HeaderSide } from "./styles";

export default function UserGroupSideBar({
  selectedUserGroupId,
  setSelectedUserGroupId,
}: {
  selectedUserGroupId: string | null;
  setSelectedUserGroupId: (id: string) => void;
}) {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [search, setSearch] = useState("");
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const router = useRouter();

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

      <Buttons>
        <SideNavNewTemplateButton
          onClick={() => router.push("/templates?isAdmin=true")}
        >
          <Image src={Plus} alt="+" width={10} height={10} /> New Template
        </SideNavNewTemplateButton>

        <SideNavNewTemplateButton onClick={() => setIsAddGroupOpen(true)}>
          <Image src={Plus} alt="+" width={10} height={10} /> Add Organization
        </SideNavNewTemplateButton>
      </Buttons>
      {isAddGroupOpen && (
        <AddUserGroups
          onClose={() => setIsAddGroupOpen(false)}
          onCreated={newGroup => {
            setUserGroups(prev => [...prev, newGroup]);
            setSelectedUserGroupId(newGroup.user_group_id);
          }}
        />
      )}
    </SideNavTemplatesContainer>
  );
}
