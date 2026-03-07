"use client";

import React, { useState } from "react";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import { useProfile } from "@/utils/ProfileProvider";
import { ContentWrapper, LayoutWrapper, SideNavContainer } from "../styles";
import Invites from "./components/Invites";
import Participants from "./components/Participants";
import ParticipantSideBar from "./components/ParticipantSideBar";

export default function ParticipantsPage() {
  const [filterMode, setFilterMode] = useState<"all" | "invites">("all");
  const { profile } = useProfile();
  const renderComponent = () => {
    switch (filterMode) {
      case "all":
        if (!profile?.user_group_id)
          return <div>Retrieving your profile...</div>;
        return <Participants user_group_id={profile.user_group_id} />;
      case "invites":
        if (!profile?.user_group_id)
          return <div>Retrieving your profile...</div>;
        return <Invites user_group_id={profile.user_group_id} />;
    }
  };

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <SideNavContainer>
          <ParticipantSideBar
            filterMode={filterMode}
            setFilterMode={setFilterMode}
          />
        </SideNavContainer>
        <ContentWrapper>{renderComponent()}</ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
