"use client";

import React from "react";
import Link from "next/link";
import ecovetGlobal from "@/assets/images/ecovet-global-new.svg";
import ProfileBar from "../ProfileBar/ProfileBar";
import {
  ImageLogo,
  LogoContainer,
  ProfileContainer,
  TopNavContainer,
} from "./styles";

const TopNavBar = () => {
  return (
    <TopNavContainer>
      <LogoContainer>
        <Link href="/test-page" aria-label="Go to home">
          <ImageLogo src={ecovetGlobal} alt="Ecovet Global Logo" />
        </Link>
      </LogoContainer>
      <ProfileContainer>
        <ProfileBar></ProfileBar>
      </ProfileContainer>
    </TopNavContainer>
  );
};

export default TopNavBar;
