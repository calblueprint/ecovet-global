"use client";

import type { Template, UUID } from "@/types/schema";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil } from "lucide-react";
import {
  assignTagToTemplate,
  createTag,
  deleteTag,
  getAllTags,
  removeTagFromTemplate,
} from "@/actions/supabase/queries/tag";
import { fetchTemplatesWithTags } from "@/actions/supabase/queries/templates";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import { Tag } from "@/components/Tag/TagCreator";
import { TagAutocomplete } from "@/components/TagAutoComplete/TagAutoComplete";
import COLORS from "@/styles/colors";
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
import TemplateSideBar from "./components/TemplateSidebar";
import {
  AssociatedTags,
  EditIconWrapper,
  NameColumn,
  RowActions,
  TemplateRow,
} from "./styles";

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

  const [sortKey, setSortKey] = useState<"name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedTagIds, setSelectedTagIds] = useState<UUID[] | null>([]);
  const [openTagDropdownFor, setOpenTagDropdownFor] = useState<UUID | null>(
    null,
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagVersion, setTagVersion] = useState(0);

  useEffect(() => {
    if (!user_group_id) return;

    const load = async () => {
      const [allTemplates, allTags] = await Promise.all([
        fetchTemplatesWithTags(),
        getAllTags(user_group_id),
      ]);
      setTemplates(allTemplates || []);
      setAvailableTags(allTags);
    };

    load();
  }, [user_group_id, tagVersion]);

  const filteredTemplates = useMemo(() => {
    let updated = [...templates];

    if (filterMode === "all") {
      updated = updated.filter(
        t => t.accessible_to_all || t.user_group_id === user_group_id,
      );
    } else if (filterMode === "your") {
      updated = updated.filter(t => t.user_group_id === user_group_id);
    } else {
      updated = updated.filter(t => t.accessible_to_all);
    }

    if (selectedTagIds) {
      if (selectedTagIds.length > 0) {
        updated = updated.filter(t =>
          t.associated_tags.some(tag => selectedTagIds.includes(tag.tag_id)),
        );
      }
    } // update to multiselect

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

    return updated;
  }, [
    templates,
    filterMode,
    selectedTagIds,
    searchInput,
    sortKey,
    sortOrder,
    user_group_id,
  ]);

  const toggleSort = (key: "name" | "date") => {
    if (sortKey === key) {
      setSortOrder(o => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

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

      setSelectedTagIds(prev =>
        prev ? prev.filter(tag => tag !== tag_id) : null,
      );
    }

    return true;
  }

  async function addNewTag(template_id: UUID) {
    if (openTagDropdownFor === template_id) {
      setOpenTagDropdownFor(null);
      return;
    }

    const allTags = await getAllTags(user_group_id);

    setAvailableTags(allTags);
    setOpenTagDropdownFor(template_id);
  }

  async function handleCreateAndAssign(template_id: UUID, name: string) {
    const newTagId = await createTag({
      name,
      user_group_id,
      color: "yellow",
      number: 0,
    });

    if (newTagId) {
      const newlyCreatedTag: Tag = {
        tag_id: newTagId as UUID,
        name: name ?? "No Name",
        color: "yellow",
        number: 0,
        user_group_id: user_group_id,
      };

      setAvailableTags(prev => [...prev, newlyCreatedTag]);

      const currentTags =
        templates.find(t => t.template_id === template_id)?.associated_tags ||
        [];
      const nextIds = new Set([
        ...currentTags.map(t => t.tag_id),
        newlyCreatedTag.tag_id,
      ]);

      await handleMultiTagChange(template_id, nextIds);
      setTagVersion(v => v + 1);
    }
  }

  async function handleClearAllTags(template_id: UUID) {
    const currentTemplate = templates.find(t => t.template_id === template_id);
    if (!currentTemplate) return;

    // remove from database
    const deletePromises = currentTemplate.associated_tags.map(tag =>
      removeTagFromTemplate(template_id, tag.tag_id),
    );
    await Promise.all(deletePromises);

    // update local state
    setTemplates(prev =>
      prev.map(t =>
        t.template_id === template_id ? { ...t, associated_tags: [] } : t,
      ),
    );
  }

  async function handleMultiTagChange(
    template_id: UUID,
    nextTagIds: Set<UUID>,
  ) {
    const currentTemplate = templates.find(t => t.template_id === template_id);
    if (!currentTemplate) return;

    const currentTagIds = new Set(
      currentTemplate.associated_tags.map(tag => tag.tag_id),
    );

    for (const id of nextTagIds) {
      if (!currentTagIds.has(id)) await assignTagToTemplate(template_id, id);
    }
    for (const id of currentTagIds) {
      if (!nextTagIds.has(id)) await removeTagFromTemplate(template_id, id);
    }

    const updatedAssociatedTags = availableTags.filter((tag: Tag) =>
      nextTagIds.has(tag.tag_id),
    );

    setTemplates(prev =>
      prev.map(t =>
        t.template_id === template_id
          ? { ...t, associated_tags: updatedAssociatedTags }
          : t,
      ),
    );
  }

  // NO LONGER USING, REPLACED WITH handleMultiTagChange()
  async function handleSelectTag(
    template_id: UUID,
    tag_id: UUID,
    passedTag?: Tag,
  ) {
    const success = await assignTagToTemplate(template_id, tag_id);
    if (!success) return;

    const tag = passedTag || availableTags.find(t => t.tag_id === tag_id);

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
            onDeleteConfirmed={deleteTagComponent}
            user_group_id={user_group_id}
            selectedTagIds={selectedTagIds}
            onTagRenamed={() => setTagVersion(v => v + 1)}
          />
        </SideNavContainer>

        <ContentWrapper>
          <PageDiv>
            <MainDiv>
              <Heading3>Browse templates</Heading3>

              <SearchBarStyled>
                <SearchInput
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search templates..."
                />
              </SearchBarStyled>

              <TagAutocomplete
                availableTags={availableTags}
                selectedTagIds={new Set(selectedTagIds)}
                onSelect={(id: UUID) =>
                  setSelectedTagIds(prev => {
                    if (prev === null) return [id];
                    if (prev.includes(id)) return prev;
                    return [...prev, id];
                  })
                }
                onRemove={tagId =>
                  setSelectedTagIds(prev =>
                    prev !== null ? prev.filter(id => id !== tagId) : null,
                  )
                }
                onCreate={name =>
                  setAvailableTags(prev => [
                    ...prev,
                    {
                      name,
                      color: "tagYellow",
                      tag_id: "67",
                      user_group_id: "6767",
                      number: 67,
                    },
                  ])
                }
              />
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
                <span>Tags</span>
              </GeneralTitle>

              {filteredTemplates.map(t => (
                <TemplateRow key={t.template_id}>
                  <NameColumn>
                    <span
                      onClick={() =>
                        router.replace(
                          `/facilitator/exercises/start?templateId=${t.template_id}`,
                        )
                      }
                    >
                      {t.template_name}
                    </span>
                  </NameColumn>

                  <div>
                    {new Date(t.timestamp).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  <AssociatedTags>
                    <TagAutocomplete
                      availableTags={availableTags}
                      selectedTagIds={
                        new Set(t.associated_tags.map(tag => tag.tag_id))
                      }
                      onSelect={tagId =>
                        handleMultiTagChange(
                          t.template_id,
                          new Set([
                            ...t.associated_tags.map(tag => tag.tag_id),
                            tagId,
                          ]),
                        )
                      }
                      onRemove={tagId =>
                        handleMultiTagChange(
                          t.template_id,
                          new Set(
                            t.associated_tags
                              .map(tag => tag.tag_id)
                              .filter(id => id !== tagId),
                          ),
                        )
                      }
                      onCreate={name =>
                        handleCreateAndAssign(t.template_id, name)
                      }
                    />
                  </AssociatedTags>

                  <RowActions className="row-actions">
                    <EditIconWrapper
                      onClick={e => {
                        e.stopPropagation();
                        router.push(
                          `/templates?templateId=${t.template_id}&fromTemplateList=true`,
                        );
                      }}
                    >
                      <Pencil size={16} />
                    </EditIconWrapper>
                  </RowActions>
                </TemplateRow>
              ))}
            </MainDiv>
          </PageDiv>
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
