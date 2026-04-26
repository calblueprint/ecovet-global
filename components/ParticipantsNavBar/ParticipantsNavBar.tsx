"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ecovetGlobal from "@/assets/images/ecovet-global-new.svg";
import ProfileBar from "../ProfileBar/ProfileBar";
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
        <Link href="/participants/session-start">
          <TopNavButton
            $active={pathname.startsWith("/participants/session-start")}
          >
            Current Exercises
          </TopNavButton>
        </Link>
        <Link href="/participants/past-exercises">
          <TopNavButton
            $active={pathname.startsWith("/participants/past-exercises")}
          >
            Past Exercises
          </TopNavButton>{" "}
        </Link>
      </ButtonContainer>
      <ProfileBar></ProfileBar>
    </TopNavContainer>
  );
};

export default TopNavBar;
