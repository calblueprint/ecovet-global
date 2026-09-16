"use client";

import type { UserGroup } from "@/types/schema";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import {
  deleteUserGroup,
  fetchUserGroups,
} from "@/actions/supabase/queries/user-groups";
import {
  Heading3,
  SearchInput2,
  SideNavButton,
  SideNavNewTemplateButton,
  SideNavTemplatesContainer,
} from "@/app/admin/styles";
import cross from "@/assets/images/DeleteTagCross.svg";
import Plus from "@/assets/images/plus.svg";
import WarningModal, {
  WarningAction,
} from "@/components/WarningModal/WarningModal";
import AddUserGroups from "./AddUserGroup";
import { Buttons, DeleteButton, UserGroupArea } from "./styles";

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
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setGroupToDelete(id);
  };

  const handleWarningClose = async (action: WarningAction) => {
    const id = groupToDelete;
    setGroupToDelete(null);

    if (action !== "confirm" || !id) return;

    try {
      await deleteUserGroup(id);
      setUserGroups(prev => prev.filter(g => g.user_group_id !== id));
    } catch (err) {
      console.error("Failed to delete user group:", err);
    }
  };

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
        <UserGroupArea key={group.user_group_id}>
          <SideNavButton
            $selected={selectedUserGroupId === group.user_group_id}
            onClick={() => setSelectedUserGroupId(group.user_group_id)}
          >
            {group.user_group_name}
          </SideNavButton>
          <DeleteButton
            aria-label={`Delete ${group.user_group_name}`}
            onClick={() => handleDelete(group.user_group_id)}
          >
            <Image src={cross} alt="cross" />
          </DeleteButton>
        </UserGroupArea>
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
      <WarningModal
        open={groupToDelete !== null}
        onClose={handleWarningClose}
      />
    </SideNavTemplatesContainer>
  );
}
