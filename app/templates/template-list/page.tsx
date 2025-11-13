"use client";

import React, { useEffect, useState } from "react";
import { fetchAllTemplates } from "@/actions/supabase/queries/templates";
import { useProfile } from "@/utils/ProfileProvider";

type Template = {
  template_id: string;
  template_name: string;
  user_group_id: string;
  accessible_to_all: boolean;
  objective: string;
  summary: string;
  setting: string;
  current_activity: string;
};

const SearchBar: React.FC = () => {
  const { profile } = useProfile();
  const user_group_id = profile?.user_group_id ?? "";
  const [searchInput, setSearchInput] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);

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
    if (searchInput.trim().length === 0) {
      setFilteredTemplates(templates);
      return;
    }

    const filtered = templates.filter(template => {
      const matchesName = template.template_name
        .trim()
        .toLowerCase()
        .includes(searchInput.toLowerCase());
      const matchesGroup =
        template.user_group_id === user_group_id ||
        template.accessible_to_all === true;

      return matchesName && matchesGroup;
    });

    setFilteredTemplates(filtered);
  }, [searchInput, templates, user_group_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={searchInput}
        onChange={handleChange}
        placeholder="Search templates..."
        className="border rounded p-2 w-full mb-4"
      />
      <ul>
        {filteredTemplates.map(template => (
          <li key={template.template_id}>{template.template_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
