"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ecovetGlobal from "@/assets/images/ecovet-global-new.svg";
import {
  ButtonContainer,
  ImageLogo,
  LogoContainer,
  TopNavButton,
  TopNavContainer,
} from "./styles";

const TopNavBar = () => {
  const pathname = usePathname();
  return (
    <TopNavContainer>
      <LogoContainer>
        <Link href="/test-page" aria-label="Go to home">
          <ImageLogo src={ecovetGlobal} alt="Ecovet Global Logo" />
        </Link>
      </LogoContainer>
      <ButtonContainer>
        <Link href="/facilitator/template-list">
          <TopNavButton
            $active={pathname.startsWith("/facilitator/template-list")}
          >
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
