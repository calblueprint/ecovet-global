"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  SideNavButton,
  SideNavNewTemplateButton,
  SideNavTemplatesContainer,
} from "@/app/admin/styles";
import Plus from "@/assets/images/plus.svg";

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
        onClick={() => router.push("/invites/add-user-groups")}
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
      </SideNavTemplatesContainer>
    </div>
  );
}
