"use client";

import Image from "next/image";
import Plus from "@/assets/images/plus.svg";
import {
  SideNavButton,
  SideNavNewTemplateButton,
  SideNavTemplatesContainer,
} from "../../styles";

export default function ParticipantSideBar({
  filterMode,
  setFilterMode,
}: {
  filterMode: "all" | "invites";
  setFilterMode: (val: "all" | "invites") => void;
}) {
  return (
    <div>
      <SideNavNewTemplateButton>
        <Image src={Plus} alt="+" width={10} height={10} /> Placeholder
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
    </div>
  );
}
