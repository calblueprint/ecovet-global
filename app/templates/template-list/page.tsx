"use client";

import React, { useState } from "react";
import TopNavBar from "@/components/NavBar";
import SearchBar from "./SearchBar";
import { ContentWrapper, LayoutWrapper } from "./styles";
import TemplateSideBar from "./TemplateSidebar";

export default function TemplateListPage() {
  const [filterMode, setFilterMode] = useState<"all" | "your" | "browse">(
    "all",
  );

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <TemplateSideBar
          filterMode={filterMode}
          setFilterMode={setFilterMode}
        />

        <ContentWrapper>
          <SearchBar filterMode={filterMode} />
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
