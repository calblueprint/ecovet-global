"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ecovetGlobal from "@/assets/images/ecovet-global-new.svg";
import { getHomePath } from "@/utils/HomePage";
import { useProfile } from "@/utils/ProfileProvider";
import ProfileBar from "../ProfileBar/ProfileBar";
import {
  ButtonContainer,
  ImageLogo,
  LogoContainer,
  ProfileContainer,
  TopNavButton,
  TopNavContainer,
} from "./styles";

const TopNavBar = () => {
  const pathname = usePathname();
  const { profile } = useProfile();
  const homepage = getHomePath(profile);
  return (
    <TopNavContainer>
      <LogoContainer>
        <Link href={homepage} aria-label="Go to home">
          <ImageLogo src={ecovetGlobal} alt="Ecovet Global Logo" />
        </Link>
      </LogoContainer>
      <ButtonContainer>
        <Link href="/admin/home-screen">
          <TopNavButton $active={pathname.startsWith("/admin/home-screen")}>
            User Group Dashboard
          </TopNavButton>
        </Link>
        <Link href="/admin/template-list">
          <TopNavButton $active={pathname.startsWith("/admin/template-list")}>
            Browse and Edit Templates
          </TopNavButton>
        </Link>
      </ButtonContainer>

      <ProfileContainer>
        <ProfileBar></ProfileBar>
      </ProfileContainer>
    </TopNavContainer>
  );
};

export default TopNavBar;
