"use client";

import React from "react";
import Link from "next/link";
import ecovetGlobal from "@/assets/images/ecovet-global-new.svg";
import { ImageLogo, TopNavContainer } from "./styles";

const TopNavBar = () => {
  return (
    <TopNavContainer>
      <Link href="/test-page" aria-label="Go to home">
        <ImageLogo src={ecovetGlobal} alt="Ecovet Global Logo" />
      </Link>
    </TopNavContainer>
  );
};

export default TopNavBar;
