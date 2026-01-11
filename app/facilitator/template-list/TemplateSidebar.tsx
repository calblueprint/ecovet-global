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

export default function TemplateSideBar({
  filterMode,
  setFilterMode,
}: {
  filterMode: "all" | "your" | "browse";
  setFilterMode: (val: "all" | "your" | "browse") => void;
}) {
  const router = useRouter();

  return (
    <div>
      <SideNavNewTemplateButton onClick={() => router.push("/templates")}>
        <Image src={Plus} alt="+" width={10} height={10} /> New Template
      </SideNavNewTemplateButton>
      <SideNavTemplatesContainer>
        <SideNavButton
          selected={filterMode === "all"}
          onClick={() => setFilterMode("all")}
        >
          All Templates
        </SideNavButton>
        <SideNavButton
          selected={filterMode === "your"}
          onClick={() => setFilterMode("your")}
        >
          Your Templates
        </SideNavButton>
        <SideNavButton
          selected={filterMode === "browse"}
          onClick={() => setFilterMode("browse")}
        >
          Browse Templates
        </SideNavButton>
      </SideNavTemplatesContainer>
    </div>
  );
}
