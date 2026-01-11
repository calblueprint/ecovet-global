"use client";

import React from "react";
import Link from "next/link";
import ecovetGlobal from "@/assets/images/ecovet-global-new.svg";
import { ImageLogo, LogoContainer, TopNavContainer } from "./styles";

const TopNavBar = () => {
  return (
    <TopNavContainer>
      <LogoContainer>
        <Link href="/test-page" aria-label="Go to home">
          <ImageLogo src={ecovetGlobal} alt="Ecovet Global Logo" />
        </Link>
      </LogoContainer>
    </TopNavContainer>
  );
};

export default TopNavBar;
