"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UUID } from "crypto";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  assignTagToTemplate,
  deleteTag,
  getAllTags,
  getTagsForTemplate,
  removeTagFromTemplate,
} from "@/api/supabase/queries/tag";
import { fetchAllTemplates } from "@/api/supabase/queries/templates";
import img from "@/assets/images/NewTagPlus.png";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import { TagComponent } from "@/components/Tag/Tag";
import { TagCreator } from "@/components/Tag/TagCreator";
import COLORS from "@/styles/colors";
import { Tag, Template } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import {
  ContentWrapper,
  GeneralList,
  GeneralTitle,
  Heading3,
  LayoutWrapper,
  MainDiv,
  PageDiv,
  SearchBarStyled,
  SearchInput,
  SideNavContainer,
  SortButton,
} from "../styles";
import { AddNewTagPlus, AssociatedTags, NewTag, TemplateTag } from "./styles";
import TemplateSideBar from "./TemplateSidebar";

type TemplateWithTags = Template & {
  associated_tags: Tag[];
};

type ColorKey = keyof typeof COLORS;

export default function TemplateListPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const user_group_id = profile?.user_group_id as UUID;
  const loading = !user_group_id;
  const [filterMode, setFilterMode] = useState<"all" | "your" | "browse">(
    "all",
  );
  const [searchInput, setSearchInput] = useState("");
  const [templates, setTemplates] = useState<TemplateWithTags[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<
    TemplateWithTags[]
  >([]);

  const [sortKey, setSortKey] = useState<"name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedTagId, setSelectedTagId] = useState<UUID | null>(null);
  const [openTagDropdownFor, setOpenTagDropdownFor] = useState<UUID | null>(
    null,
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagVersion, setTagVersion] = useState(0);

  /** Fetch templates + tags */
  useEffect(() => {
    if (!user_group_id) return;

    const load = async () => {
      console.log(user_group_id);
      const allTemplates = (await fetchAllTemplates()) || [];

      let subset = allTemplates;

      if (filterMode === "all") {
        subset = allTemplates.filter(
          t => t.accessible_to_all || t.user_group_id === user_group_id,
        );
      } else if (filterMode === "your") {
        subset = allTemplates.filter(t => t.user_group_id === user_group_id);
      } else {
        subset = allTemplates.filter(t => t.accessible_to_all);
      }

      const withTags = await Promise.all(
        subset.map(async t => ({
          ...t,
          associated_tags: await getTagsForTemplate(
            t.template_id,
            user_group_id,
          ),
        })),
      );

      setTemplates(withTags);
      setFilteredTemplates(withTags);
    };

    load();
  }, [filterMode, user_group_id, tagVersion]);

  /** Search + tag filter + sort */
  useEffect(() => {
    let updated = [...templates];

    if (selectedTagId) {
      updated = updated.filter(t =>
        t.associated_tags.some(tag => tag.tag_id === selectedTagId),
      );
    }

    updated = updated.filter(t =>
      t.template_name?.toLowerCase().includes(searchInput.trim().toLowerCase()),
    );

    updated.sort((a, b) => {
      if (sortKey === "name") {
        const r = (a.template_name ?? "").localeCompare(b.template_name ?? "");
        return sortOrder === "asc" ? r : -r;
      }
      const r =
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sortOrder === "asc" ? r : -r;
    });

    setFilteredTemplates(updated);
  }, [templates, searchInput, sortKey, sortOrder, selectedTagId]);

  const toggleSort = (key: "name" | "date") => {
    if (sortKey === key) {
      setSortOrder(o => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  /** Tag actions */
  async function deleteTagComponent(tag_id: UUID, template_id?: UUID) {
    if (template_id) {
      const success = await removeTagFromTemplate(template_id, tag_id);
      if (!success) return false;

      setTemplates(prev =>
        prev.map(t =>
          t.template_id === template_id
            ? {
                ...t,
                associated_tags: t.associated_tags.filter(
                  tag => tag.tag_id !== tag_id,
                ),
              }
            : t,
        ),
      );
    } else {
      const success = await deleteTag(tag_id);
      if (!success) return false;

      setTemplates(prev =>
        prev.map(t => ({
          ...t,
          associated_tags: t.associated_tags.filter(
            tag => tag.tag_id !== tag_id,
          ),
        })),
      );

      setSelectedTagId(prev => (prev === tag_id ? null : prev));
    }

    return true;
  }

  async function addNewTag(template_id: UUID) {
    if (openTagDropdownFor === template_id) {
      setOpenTagDropdownFor(null);
      return;
    }

    const allTags = await getAllTags(user_group_id);
    const template = templates.find(t => t.template_id === template_id);
    if (!template) return;

    const assigned = new Set(template.associated_tags.map(t => t.tag_id));
    setAvailableTags(allTags.filter(t => !assigned.has(t.tag_id)));
    setOpenTagDropdownFor(template_id);
  }

  async function handleSelectTag(template_id: UUID, tag_id: UUID) {
    const success = await assignTagToTemplate(template_id, tag_id);
    if (!success) return;

    const tag = availableTags.find(t => t.tag_id === tag_id);
    if (!tag) return;

    setTemplates(prev =>
      prev.map(t =>
        t.template_id === template_id
          ? { ...t, associated_tags: [...t.associated_tags, tag] }
          : t,
      ),
    );

    setOpenTagDropdownFor(null);
  }

  return loading ? (
    <MainDiv>Loading profile...</MainDiv>
  ) : (
    <>
      <TopNavBar />

      <LayoutWrapper>
        <SideNavContainer>
          <TemplateSideBar
            filterMode={filterMode}
            setFilterMode={setFilterMode}
          />
          <TagCreator
            user_group_id={user_group_id}
            selectedTagId={selectedTagId}
            onTagClick={(id: UUID) =>
              setSelectedTagId(prev => (prev === id ? null : id))
            }
            onTagRenamed={() => setTagVersion(v => v + 1)}
            onDeleteTag={deleteTagComponent}
          />
        </SideNavContainer>

        <ContentWrapper>
          <PageDiv>
            <MainDiv>
              <SearchBarStyled>
                <SearchInput
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search templates..."
                />
              </SearchBarStyled>

              <Heading3>Browse templates</Heading3>

              <GeneralTitle>
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
                      <ArrowUpDown size={16} />
                    )}
                  </SortButton>
                </span>
                <span>Tags</span>
                <span>
                  Created{" "}
                  <SortButton onClick={() => toggleSort("date")}>
                    {sortKey === "date" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )
                    ) : (
                      <ArrowUpDown size={16} />
                    )}
                  </SortButton>
                </span>
              </GeneralTitle>

              {filteredTemplates.map(t => (
                <GeneralList key={t.template_id}>
                  <div
                    onClick={() => router.replace(`/sessions/${t.template_id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {t.template_name}
                  </div>

                  <AssociatedTags>
                    {t.associated_tags.map(tag => (
                      <TemplateTag key={tag.tag_id}>
                        <TagComponent
                          name={tag.name}
                          color={tag.color as ColorKey}
                          tag_id={tag.tag_id}
                          sidebar={false}
                          onDelete={(id: UUID) =>
                            deleteTagComponent(id, t.template_id)
                          }
                        />
                      </TemplateTag>
                    ))}

                    {openTagDropdownFor === t.template_id && (
                      <InputDropdown
                        label="Select tag"
                        options={
                          new Map(
                            availableTags.map(tag => [tag.tag_id, tag.name]),
                          )
                        }
                        onChange={value =>
                          value && handleSelectTag(t.template_id, value as UUID)
                        }
                      />
                    )}
                    <NewTag onClick={() => addNewTag(t.template_id)}>
                      <AddNewTagPlus>
                        <Image src={img} alt="Add tag" />
                      </AddNewTagPlus>
                      New Tag
                    </NewTag>
                  </AssociatedTags>

                  <div>
                    {new Date(t.timestamp).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </GeneralList>
              ))}
            </MainDiv>
          </PageDiv>
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
