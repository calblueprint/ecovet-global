"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ecovetGlobal from "@/assets/images/ecovet-global-new.svg";
import { LogoContainer, TopNavContainer } from "./styles";

const TopNavBar = () => {
  const pathname = usePathname();
  return (
    <TopNavContainer>
      <Link href="/test-page" aria-label="Go to home">
        <Image
          src={ecovetGlobal}
          alt="Ecovet Global Logo"
          height={30}
          style={{ width: "auto", objectFit: "contain", cursor: "pointer" }}
        />
      </Link>
    </TopNavContainer>
  );
};

export default TopNavBar;
