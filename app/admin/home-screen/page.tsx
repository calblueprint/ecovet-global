"use client";

import { useCallback, useEffect, useState } from "react";
import { UUID } from "crypto";
import { fetchUserGroupById } from "@/actions/supabase/queries/profile";
import NavBar from "@/components/NavBar/NavBar";
import { UserGroup } from "@/types/schema";
import {
  ContentWrapper,
  Heading3,
  InviteWrapper,
  LayoutWrapper,
  SideNavContainer,
} from "../styles";
import AddUserGroup from "./components/AddUserGroup";
import InviteComponent from "./components/InviteComponent";
import AdminParticipants from "./components/UserGroupMembers";
import UserGroupSideBar from "./components/UserGroupSideBar";

export default function AdminPage() {
  const [selectedUserGroupId, setSelectedUserGroupId] = useState<string | null>(
    null,
  );
  const [userGroup, setUserGroup] = useState<UserGroup | null>(null);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!selectedUserGroupId) return;

    try {
      const userGroupDetails = await fetchUserGroupById(
        selectedUserGroupId as UUID,
      );
      setUserGroup(userGroupDetails || null);
    } catch (error) {
      console.error("Failed to fetch group details:", error);
    }
  }, [selectedUserGroupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <NavBar />

      <LayoutWrapper>
        <SideNavContainer>
          <UserGroupSideBar
            selectedUserGroupId={selectedUserGroupId}
            setSelectedUserGroupId={setSelectedUserGroupId}
            onAddClick={() => setIsAddGroupOpen(true)}
          />
        </SideNavContainer>
        <ContentWrapper>
          <Heading3>{userGroup?.user_group_name}</Heading3>
        </ContentWrapper>

        <InviteWrapper>
          {!selectedUserGroupId ? (
            <div></div>
          ) : (
            <div>
              <InviteComponent user_group_id={selectedUserGroupId || ""} />
              <AdminParticipants user_group_id={selectedUserGroupId} />
            </div>
          )}
        </InviteWrapper>
      </LayoutWrapper>
      {isAddGroupOpen && (
        <AddUserGroup onClose={() => setIsAddGroupOpen(false)} />
      )}
    </>
  );
}
