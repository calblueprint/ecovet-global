"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { fetchAllTemplates } from "@/actions/supabase/queries/templates";
import { useProfile } from "@/utils/ProfileProvider";
import {
  Heading3,
  MainDiv,
  SearchBarStyled,
  SearchInput,
  SortButton,
  TemplateList,
  TemplateTitle,
} from "./styles";

type Template = {
  template_id: string;
  template_name: string;
  user_group_id: string;
  accessible_to_all: boolean;
  objective: string;
  summary: string;
  setting: string;
  current_activity: string;
  timestamp: string;
  temporary_tags: boolean;
};

const SearchBar: React.FC = () => {
  const { profile } = useProfile();
  const user_group_id = profile?.user_group_id ?? "";
  const [searchInput, setSearchInput] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [sortKey, setSortKey] = useState<"name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch all templates
  useEffect(() => {
    const loadTemplates = async () => {
      const allTemplates = (await fetchAllTemplates()) || [];

      const subsetTemplates = allTemplates.filter(
        template =>
          template.user_group_id === user_group_id ||
          template.accessible_to_all === true,
      );
      setTemplates(subsetTemplates);
      setFilteredTemplates(subsetTemplates);
    };
    loadTemplates();
  }, [user_group_id]);

  // Filter based on search.
  useEffect(() => {
    const updated = (templates ?? []).filter(template =>
      template.template_name
        .toLowerCase()
        .includes(searchInput.trim().toLowerCase()),
    );

    updated.sort((a, b) => {
      if (sortKey === "name") {
        const result = a.template_name.localeCompare(b.template_name);
        return sortOrder === "asc" ? result : -result;
      } else {
        const result =
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        return sortOrder === "asc" ? result : -result;
      }
    });

    setFilteredTemplates(updated);
  }, [searchInput, sortKey, sortOrder, templates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const toggleSort = (key: "name" | "date") => {
    if (sortKey === key) {
      setSortOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <MainDiv>
      <SearchBarStyled>
        <SearchInput
          type="text"
          value={searchInput}
          onChange={handleChange}
          placeholder="Search templates..."
          style={{ fontSize: "12px", fontWeight: "500" }}
        />
      </SearchBarStyled>
      <Heading3>Browse templates</Heading3>
      <TemplateTitle>
        <span>
          Name{" "}
          <SortButton onClick={() => toggleSort("name")}>
            {sortKey === "name" ? (
              sortOrder === "asc" ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )
            ) : (
              <ArrowUp size={16} />
            )}
          </SortButton>{" "}
        </span>
        <span>Tags</span>
        <span>
          Created{" "}
          <SortButton onClick={() => toggleSort("date")}>
            {" "}
            {sortKey === "date" ? (
              sortOrder === "asc" ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )
            ) : (
              <ArrowUp size={16} />
            )}
          </SortButton>
        </span>
      </TemplateTitle>
      {filteredTemplates.map(template => (
        <TemplateList key={template.template_id}>
          <span> {template.template_name} </span>
          <span> {template.temporary_tags} </span>
          <span>
            {" "}
            {new Date(template.timestamp).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </TemplateList>
      ))}
    </MainDiv>
  );
};

export default SearchBar;
