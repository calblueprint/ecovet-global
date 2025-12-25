"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ecovetGlobal from "@/assets/images/ecovet-global-new.svg";
import {
  ButtonContainer,
  LogoContainer,
  TopNavButton,
  TopNavContainer,
} from "./styles";

const TopNavBar = () => {
  const pathname = usePathname();
  return (
    <TopNavContainer>
      <LogoContainer>
        <Image
          src={ecovetGlobal}
          alt="Ecovet Global Logo"
          height={30}
          style={{ width: "auto", objectFit: "contain" }}
        />
      </LogoContainer>
      <ButtonContainer>
        <Link href="/facilitator/template-list">
          <TopNavButton $active={pathname.startsWith("/templates")}>
            Templates
          </TopNavButton>
        </Link>
        <Link href="/facilitator/participants">
          <TopNavButton
            $active={pathname.startsWith("/facilitator/participants")}
          >
            Participants
          </TopNavButton>{" "}
        </Link>
        <Link href="/facilitator/exercises">
          <TopNavButton $active={pathname.startsWith("/facilitator/exercises")}>
            Exercises
          </TopNavButton>
        </Link>
      </ButtonContainer>
    </TopNavContainer>
  );
};

export default TopNavBar;
