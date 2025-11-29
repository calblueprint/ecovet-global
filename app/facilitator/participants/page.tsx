"use client";

import React, { useState } from "react";
import TopNavBar from "@/components/NavBar";
import Invites from "./Invites";
import Participants from "./Participants";
import ParticipantSideBar from "./ParticipantSideBar";
import { ContentWrapper, LayoutWrapper } from "./styles";

export default function ParticipantsPage() {
  const [filterMode, setFilterMode] = useState<"all" | "invites">("all");
  const renderComponent = () => {
    switch (filterMode) {
      case "all":
        return <Participants />;
      case "invites":
        return <Invites />;
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
