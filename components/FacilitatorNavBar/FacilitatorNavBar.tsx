"use client";

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
        <Link href="/facilitator/template-list">
          <TopNavButton
            $active={
              pathname.startsWith("/facilitator/template-list") ||
              pathname.startsWith("/templates")
            }
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
        <Link href="/participants/session-start">
          <TopNavButton
            $active={pathname.startsWith("/participants/session-start")}
          >
            Participant in a Session
          </TopNavButton>
        </Link>
        <Link href="/facilitator/exercises">
          <TopNavButton $active={pathname.startsWith("/facilitator/exercises")}>
            Exercises
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
