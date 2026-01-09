"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Plus from "@/assets/images/plus.svg";
import {
  SideNavButton,
  SideNavNewTemplateButton,
  SideNavTemplatesContainer,
} from "../styles";

export default function UserGroupSideBar({
  filterMode,
  setFilterMode,
}: {
  filterMode: "all" | "invites" | "usergroups";
  setFilterMode: (val: "all" | "invites" | "usergroups") => void;
}) {
  const router = useRouter();
  return (
    <div>
      <SideNavNewTemplateButton
        onClick={() => router.push("/user-groups/add-user-groups")}
      >
        <Image src={Plus} alt="+" width={10} height={10} /> New Invite
      </SideNavNewTemplateButton>
      <SideNavTemplatesContainer>
        <SideNavButton
          selected={filterMode === "all"}
          onClick={() => setFilterMode("all")}
        >
          All User Groups
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
