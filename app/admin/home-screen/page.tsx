"use client";

import { useCallback, useEffect, useState } from "react";
import { UUID } from "crypto";
import { fetchUserGroupById } from "@/actions/supabase/queries/profile";
import InviteComponent from "@/components/InviteComponent/InviteComponent";
import NavBar from "@/components/NavBar/NavBar";
import { UserGroup } from "@/types/schema";
import {
  CenterColumn,
  ContentWrapper,
  LayoutWrapper,
  MainArea,
  PageHeading,
  PageShell,
  RightColumn,
  RightColumnStack,
  SideNavContainer,
} from "../styles";
import AdminParticipants from "./components/UserGroupMembers";
import UserGroupPDFs from "./components/UserGroupPDFs";
import UserGroupSideBar from "./components/UserGroupSideBar";

export default function AdminPage() {
  const [selectedUserGroupId, setSelectedUserGroupId] = useState<string | null>(
    null,
  );
  const [userGroup, setUserGroup] = useState<UserGroup | null>(null);

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
    <PageShell>
      <NavBar />

      <LayoutWrapper>
        <SideNavContainer>
          <UserGroupSideBar
            selectedUserGroupId={selectedUserGroupId}
            setSelectedUserGroupId={setSelectedUserGroupId}
          />
        </SideNavContainer>

        <ContentWrapper>
          <PageHeading>{userGroup?.user_group_name}</PageHeading>

          {selectedUserGroupId && userGroup && (
            <MainArea>
              <CenterColumn>
                <UserGroupPDFs userGroup={selectedUserGroupId} />
              </CenterColumn>

              <RightColumn>
                <RightColumnStack>
                  <InviteComponent
                    user_group_id={selectedUserGroupId}
                    onInvitesChange={() => {
                      console.log("Invites changed!");
                    }}
                    isAdminDashboard={true}
                  />
                  <AdminParticipants user_group_id={selectedUserGroupId} />
                </RightColumnStack>
              </RightColumn>
            </MainArea>
          )}
        </ContentWrapper>
      </LayoutWrapper>
    </PageShell>
  );
}
