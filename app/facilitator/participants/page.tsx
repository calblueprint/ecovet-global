"use client";

import React, { useState } from "react";
import TopNavBar from "@/components/NavBar";
import { useProfile } from "@/utils/ProfileProvider";
import Invites from "./Invites";
import Participants from "./Participants";
import ParticipantSideBar from "./ParticipantSideBar";
import { ContentWrapper, LayoutWrapper } from "./styles";

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
        // if (!profile?.user_group_id)
        //   return <div>Retrieving your profile...</div>;
        return (
          <Invites user_group_id={"0b73ed2d-61c3-472e-b361-edaa88f27622"} />
        );
    }
  };

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <ParticipantSideBar
          filterMode={filterMode}
          setFilterMode={setFilterMode}
        />
        <ContentWrapper>{renderComponent()}</ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
