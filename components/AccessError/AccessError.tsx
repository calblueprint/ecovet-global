"use client";

import Link from "next/link";
import ecovetGlobal from "@/assets/images/ecovet-global-new.svg";
import { getHomePath } from "@/utils/HomePage";
import { useProfile } from "@/utils/ProfileProvider";
import ProfileBar from "../ProfileBar/ProfileBar";
import {
  ContentWrapper,
  Group,
  GroupHint,
  GroupTitle,
  ImageLogo,
  LayoutWrapper,
  LogoContainer,
  PageShell,
  ProfileContainer,
  TopNavContainer,
} from "./styles";

const AccessError = () => {
  const { profile } = useProfile();
  const homepage = getHomePath(profile);
  return (
    <PageShell>
      <TopNavContainer>
        <LogoContainer>
          <Link href={homepage} aria-label="Go to home">
            <ImageLogo src={ecovetGlobal} alt="Ecovet Global Logo" />
          </Link>
        </LogoContainer>

        <ProfileContainer>
          <ProfileBar></ProfileBar>
        </ProfileContainer>
      </TopNavContainer>
      <LayoutWrapper>
        <ContentWrapper>
          <Group>
            <GroupTitle>{"You don't have access to this page"}</GroupTitle>
            <GroupHint>
              If you believe this is a mistake, please contact your
              administrator.
            </GroupHint>
          </Group>
        </ContentWrapper>
      </LayoutWrapper>
    </PageShell>
  );
};

export default AccessError;
