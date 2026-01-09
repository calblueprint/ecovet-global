"use client";

import React, { useState } from "react";
import Participants from "@/app/facilitator/participants/Participants";
import NavBar from "@/components/NavBar/NavBar";
import { useProfile } from "@/utils/ProfileProvider";
import { ContentWrapper, LayoutWrapper, SideNavContainer } from "../styles";
import UserGroupDetails from "./UserGroupDetails";
import UserGroups from "./UserGroups";
import UserGroupSideBar from "./UserGroupSideBar";

export default function AdminPage() {
  const [filterMode, setFilterMode] = useState<
    "all" | "invites" | "usergroups"
  >("all");
  const [selectedUserGroupId, setSelectedUserGroupId] = useState<string | null>(
    null,
  );
  const { profile } = useProfile();
  const renderComponent = () => {
    switch (filterMode) {
      case "all":
        return (
          <UserGroups
            onSelectGroup={(id: string) => {
              setSelectedUserGroupId(id);
              setFilterMode("usergroups");
            }}
          />
        );
      case "invites":
        if (!profile?.user_group_id)
          return <div>Retrieving your profile...</div>;
        return <Participants user_group_id={profile.user_group_id} />;
      case "usergroups":
        if (!selectedUserGroupId) return <div>Please select a user group.</div>;
        return (
          <UserGroupDetails
            user_group_id={selectedUserGroupId}
            onBack={() => {
              setSelectedUserGroupId(null);
              setFilterMode("all");
            }}
          />
        );
    }
  };

  return (
    <>
      <NavBar />
      <LayoutWrapper>
        <SideNavContainer>
          <UserGroupSideBar
            filterMode={filterMode}
            setFilterMode={setFilterMode}
          />
        </SideNavContainer>
        <ContentWrapper>{renderComponent()}</ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
