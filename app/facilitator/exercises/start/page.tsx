"use client";

import React from "react";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import InviteComponent from "@/components/InviteComponent/InviteComponent";
import { useProfile } from "@/utils/ProfileProvider"; // Import the profile hook
import { ContentWrapper, LayoutWrapper } from "../../styles";

export default function Page() {
  const { profile } = useProfile();
  const loadData = () => {
    console.log("Invites changed! Refreshing data...");
  };

  if (!profile?.user_group_id) {
    return <div>Loading session...</div>;
  }

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <ContentWrapper>
          <h1>Start Exercise</h1>
          <InviteComponent
            user_group_id={profile.user_group_id}
            onInvitesChange={() => loadData()}
          />
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
