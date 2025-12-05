"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Plus from "@/assets/images/plus.svg";
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
  const router = useRouter();
  return (
    <SideNavContainer>
      <SideNavNewTemplateButton
        onClick={() => router.push("/invites/add-participants")}
      >
        {" "}
        <Image src={Plus} alt="+" width={12} height={12} /> Send Invite{" "}
      </SideNavNewTemplateButton>
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
