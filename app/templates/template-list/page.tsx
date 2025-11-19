"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UUID } from "crypto";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  assignTagToTemplate,
  getAllTags,
  getTagsForTemplate,
  removeTagFromTemplate,
} from "@/actions/supabase/queries/tag";
import { fetchAllTemplates } from "@/actions/supabase/queries/templates";
import img from "@/assets/images/NewTagPlus.png";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import { TagComponent } from "@/components/tag/Tag";
import { TagCreator } from "@/components/tag/TagCreator";
import COLORS from "@/styles/colors";
import { Tag, Template } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import {
  AddNewTagPlus,
  AssociatedTags,
  Heading3,
  MainDiv,
  NewTag,
  PageDiv,
  SearchBarStyled,
  SearchInput,
  SidebarDiv,
  SortButton,
  TemplateList,
  TemplateTag,
  TemplateTitle,
} from "./styles";

type TemplateComponent = Template & {
  associated_tags: Tag[];
};

type ColorKey = keyof typeof COLORS;

const SearchBar: React.FC = () => {
  const { profile } = useProfile();
  const user_group_id =
    profile?.user_group_id ?? ("0b73ed2d-61c3-472e-b361-edaa88f27622" as UUID);
  const [searchInput, setSearchInput] = useState("");
  const [templates, setTemplates] = useState<TemplateComponent[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<
    TemplateComponent[]
  >([]);
  const [sortKey, setSortKey] = useState<"name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedTagId, setSelectedTagId] = useState<UUID | null>(null);
  const [tagVersion, setTagVersion] = useState(0);
  const [openTagDropdownFor, setOpenTagDropdownFor] = useState<UUID | null>(
    null,
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // Fetch all templates
  useEffect(() => {
    const loadTemplates = async () => {
      const allTemplates = (await fetchAllTemplates()) || [];

      const subsetTemplates = allTemplates.filter(
        template =>
          template.user_group_id === user_group_id ||
          template.accessible_to_all === true,
      );

      // Load tags for each template
      const templatesWithTags = await Promise.all(
        subsetTemplates.map(async template => ({
          ...template,
          associated_tags: await getTagsForTemplate(template.template_id),
        })),
      );

      setTemplates(templatesWithTags);
      setFilteredTemplates(templatesWithTags);
    };
    loadTemplates();
  }, [user_group_id, tagVersion]);

  // Filter based on search.
  useEffect(() => {
    // Filter by selected tag first
    let updated = templates ?? [];

    console.log("updated ", updated.length);

    if (selectedTagId) {
      updated = updated.filter(template =>
        template.associated_tags.some(tag => tag.tag_id === selectedTagId),
      );

      console.log("updated for selected tag", selectedTagId);
    }

    console.log("updated ", updated.length);

    updated = (updated ?? []).filter(template =>
      template.template_name
        .toLowerCase()
        .includes(searchInput.trim().toLowerCase()),
    );

    console.log("updated ", updated.length);

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

    console.log("updated ", updated.length);

    setFilteredTemplates(updated);
  }, [searchInput, sortKey, sortOrder, templates, selectedTagId]);

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

  async function deleteTagComponent(template_id: UUID, tag_id: UUID) {
    // Delete tag from DB
    const success = await removeTagFromTemplate(template_id, tag_id);
    if (success) {
      console.log("Deleted tag from DB");
    } else {
      console.log("Unable to deleted tag from DB");
      return;
    }

    // Update state by removing the tag from the specific template
    setTemplates(prevTemplates =>
      prevTemplates.map(template =>
        template.template_id === template_id
          ? {
              ...template,
              associated_tags: template.associated_tags.filter(
                tag => tag.tag_id !== tag_id,
              ),
            }
          : template,
      ),
    );
  }

  async function addNewTag(template_id: UUID) {
    // If dropdown already open for template, close the dropdown
    if (openTagDropdownFor == template_id) {
      setOpenTagDropdownFor(null);
      return;
    }

    // Get all tags for the user group
    const allTags = await getAllTags(user_group_id);

    // Get current template
    const template = templates.find(t => t.template_id === template_id);
    if (!template) return;

    // Remove tags already assigned
    const alreadyAssigned = new Set(
      template.associated_tags.map(t => t.tag_id),
    );

    const filtered = allTags.filter(t => !alreadyAssigned.has(t.tag_id));

    setAvailableTags(filtered);
    setOpenTagDropdownFor(template_id);
  }

  async function handleSelectTag(template_id: UUID, tag_id: UUID) {
    const success = await assignTagToTemplate(template_id, tag_id);

    if (success) {
      // Optimistically update UI
      setTemplates(prev =>
        prev.map(t =>
          t.template_id === template_id
            ? {
                ...t,
                associated_tags: [
                  ...t.associated_tags,
                  availableTags.find(tag => tag.tag_id === tag_id)!,
                ],
              }
            : t,
        ),
      );
    }

    // close dropdown
    setOpenTagDropdownFor(null);
  }

  const handleTagFilter = (tag_id: UUID) => {
    // Toggle: click again to clear filter
    setSelectedTagId(prev => (prev === tag_id ? null : tag_id));
  };

  return (
    <PageDiv>
      <SidebarDiv>
        <TagCreator
          user_group_id={user_group_id}
          onTagClick={handleTagFilter}
          selectedTagId={selectedTagId}
          onTagRenamed={() => setTagVersion(v => v + 1)}
        />
      </SidebarDiv>
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
            <AssociatedTags>
              {template.associated_tags.map(tag => (
                <TemplateTag key={tag.tag_id}>
                  {" "}
                  <TagComponent
                    color={tag.color as ColorKey}
                    name={tag.name}
                    tag_id={tag.tag_id}
                    sidebar={false}
                    onDelete={tagId =>
                      deleteTagComponent(template.template_id, tagId)
                    }
                  />{" "}
                </TemplateTag>
              ))}

              <NewTag onClick={() => addNewTag(template.template_id)}>
                <AddNewTagPlus>
                  <Image alt="add new tag plus icon" src={img} />
                </AddNewTagPlus>
                New Tag
              </NewTag>

              {openTagDropdownFor === template.template_id && (
                <InputDropdown
                  options={
                    new Map(availableTags.map(tag => [tag.tag_id, tag.name]))
                  }
                  label="Select tag"
                  onChange={value => {
                    if (value) {
                      handleSelectTag(template.template_id, value as UUID);
                    }
                  }}
                />
              )}
            </AssociatedTags>
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
    </PageDiv>
  );
};

export default SearchBar;
