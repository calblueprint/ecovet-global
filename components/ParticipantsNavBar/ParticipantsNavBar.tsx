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
        <Link href="/participants/session-start">
          <TopNavButton
            $active={pathname.startsWith("/participants/session-start")}
          >
            Current Exercises
          </TopNavButton>
        </Link>
        <Link href="/participant/past-exercises">
          <TopNavButton
            $active={pathname.startsWith("/participant/past-exercises")}
          >
            Past Exercises
          </TopNavButton>{" "}
        </Link>
      </ButtonContainer>
    </TopNavContainer>
  );
};

export default TopNavBar;
