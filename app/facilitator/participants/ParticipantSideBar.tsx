"use client";

import React from "react";
import {
  SideNavButton,
  SideNavContainer,
  SideNavNewTemplateButton,
  SideNavTemplatesContainer,
} from "./styles";

export default function ParticipantSideBar({
  filterMode,
  setFilterMode,
}: {
  filterMode: "all" | "invites";
  setFilterMode: (val: "all" | "invites") => void;
}) {
  return (
    <SideNavContainer>
      <SideNavNewTemplateButton> + Send Invite </SideNavNewTemplateButton>
      <SideNavTemplatesContainer>
        <SideNavButton
          selected={filterMode === "all"}
          onClick={() => setFilterMode("all")}
        >
          All Participants
        </SideNavButton>
        <SideNavButton
          selected={filterMode === "invites"}
          onClick={() => setFilterMode("invites")}
        >
          Your Invites
        </SideNavButton>
      </SideNavTemplatesContainer>
    </SideNavContainer>
  );
}
