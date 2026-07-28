"use client";

import type { Template, UUID } from "@/types/schema";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import {
  Archive,
  ArchiveRestore,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";
import {
  assignTagToTemplate,
  createTag,
  deleteTag,
  getAllTags,
  removeTagFromTemplate,
} from "@/actions/supabase/queries/tag";
import {
  copyTemplate,
  fetchTemplatesWithTags,
  setTemplateArchived,
} from "@/actions/supabase/queries/templates";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import { Tag } from "@/components/Tag/TagCreator";
import { TagAutocomplete } from "@/components/TagAutoComplete/TagAutoComplete";
import WarningModal, {
  WarningAction,
} from "@/components/WarningModal/WarningModal";
import { useProfile } from "@/utils/ProfileProvider";
import {
  GeneralTitle,
  Heading3,
  LayoutWrapper,
  MainDiv,
  PageDiv,
  SearchBarStyled,
  SearchInput,
  SideNavContainer,
  SortButton,
} from "../../app/facilitator/styles";
import {
  ArchivedToggle,
  AssociatedTags,
  ContentWrapper,
  DateColumn,
  EditIconWrapper,
  FilterPlusSearch,
  LoadingScreen,
  NameColumn,
  RowActions,
  SearchWrapper,
  TemplateRow,
} from "./styles";
import TemplateSideBar from "./TemplateSideBar";

type TemplateWithTags = Template & {
  associated_tags: Tag[];
};

export default function TemplateListPage({
  navBar = <TopNavBar />,
  showSidebar = true,
}: {
  navBar?: React.ReactNode;
  showSidebar?: boolean;
} = {}) {
  const router = useRouter();
  const { profile } = useProfile();
  const user_group_id = profile?.user_group_id as UUID;
  const adminAccess = profile?.user_type === "Admin";
  const loading = !user_group_id;
  const [filterMode, setFilterMode] = useState<
    "All" | "Your" | "Browse" | "Archived"
  >("All");
  const [searchInput, setSearchInput] = useState("");
  const [templates, setTemplates] = useState<TemplateWithTags[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState<UUID | null>(null);

  const [sortKey, setSortKey] = useState<"name" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedTagIds, setSelectedTagIds] = useState<UUID[] | null>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagVersion, setTagVersion] = useState(0);

  const [copyConfirm, setCopyConfirm] = useState<TemplateWithTags | null>(null);
  const [copying, setCopying] = useState(false);

  const [archiveConfirm, setArchiveConfirm] = useState<TemplateWithTags | null>(
    null,
  );
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    if (!user_group_id) return;

    const load = async () => {
      setTemplatesLoading(true);
      try {
        const [allTemplates, allTags] = await Promise.all([
          fetchTemplatesWithTags(user_group_id),
          getAllTags(user_group_id),
        ]);
        setTemplates(allTemplates || []);
        setAvailableTags(allTags);
      } finally {
        setTemplatesLoading(false);
      }
    };

    load();
  }, [user_group_id, tagVersion]);

  const filteredTemplates = useMemo(() => {
    let updated = [...templates];

    if (filterMode === "Archived") {
      // Only archived templates the viewer is allowed to see/restore.
      updated = updated.filter(
        t =>
          t.archived &&
          (t.accessible_to_all || t.user_group_id === user_group_id),
      );
    } else {
      // Every non-archived view hides archived templates by default.
      updated = updated.filter(t => !t.archived);

      if (filterMode === "All") {
        updated = updated.filter(
          t => t.accessible_to_all || t.user_group_id === user_group_id,
        );
      } else if (filterMode === "Your") {
        updated = updated.filter(t => t.user_group_id === user_group_id);
      } else {
        updated = updated.filter(t => t.accessible_to_all);
      }
    }

    if (selectedTagIds) {
      if (selectedTagIds.length > 0) {
        updated = updated.filter(t =>
          t.associated_tags.some(tag => selectedTagIds.includes(tag.tag_id)),
        );
      }
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

  const isAdminTemplate = (t: TemplateWithTags) => Boolean(t.accessible_to_all);

  // You manage a template if your group owns it, or you're an admin
  const canManageTemplate = (t: TemplateWithTags) =>
    t.user_group_id === user_group_id ||
    (adminAccess && Boolean(t.accessible_to_all));

  // A shared template you don't manage stays copy-to-edit only
  const isLockedTemplate = (t: TemplateWithTags) =>
    isAdminTemplate(t) && !canManageTemplate(t);

  const handleOpenTemplate = (t: TemplateWithTags) => {
    if (isLockedTemplate(t)) return;

    const params = new URLSearchParams({
      templateId: t.template_id,
      fromTemplateList: "true",
    });
    if (t.accessible_to_all) params.set("isAdmin", "true");

    router.push(`/templates?${params.toString()}`);
  };

  const handleCopyConfirm = async (action: WarningAction) => {
    if (action === "cancel" || !copyConfirm) {
      setCopyConfirm(null);
      return;
    }

    setCopying(true);
    try {
      const newId = await copyTemplate(copyConfirm.template_id, user_group_id);
      if (newId) {
        router.push(`/templates?templateId=${newId}&fromTemplateList=true`);
      }
    } catch (err) {
      console.error("Copy failed", err);
    } finally {
      setCopying(false);
      setCopyConfirm(null);
    }
  };

  const handleArchiveConfirm = async (action: WarningAction) => {
    if (action === "cancel" || !archiveConfirm) {
      setArchiveConfirm(null);
      return;
    }

    const target = archiveConfirm;
    const nextArchived = !target.archived;

    setArchiving(true);
    try {
      const ok = await setTemplateArchived(
        target.template_id,
        nextArchived,
        user_group_id,
        adminAccess,
      );
      if (ok) {
        setTemplates(prev =>
          prev.map(t =>
            t.template_id === target.template_id
              ? { ...t, archived: nextArchived }
              : t,
          ),
        );
      }
    } catch (err) {
      console.error("Archive failed", err);
    } finally {
      setArchiving(false);
      setArchiveConfirm(null);
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

  async function handleCreateAndAssign(template_id: UUID, name: string) {
    const newTagId = await createTag({
      name,
      user_group_id,
      number: 0,
    });

    if (newTagId) {
      const newlyCreatedTag: Tag = {
        tag_id: newTagId as UUID,
        name: name ?? "No Name",
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

  async function handleViewTemplatePdf(templateId: UUID) {
    setPdfLoading(templateId);
    try {
      const res = await fetch(`/api/reports/template/${templateId}`);
      const json = await res.json();
      if (json.url) {
        window.open(json.url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setPdfLoading(null);
    }
  }

  return loading ? (
    <LoadingScreen>
      <CircularProgress color="inherit" aria-label="Loading…" />
    </LoadingScreen>
  ) : (
    <>
      {navBar}

      <LayoutWrapper>
        {showSidebar && (
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
        )}

        <ContentWrapper $admin={!showSidebar}>
          <PageDiv>
            <MainDiv>
              <Heading3>{filterMode} templates</Heading3>
              <FilterPlusSearch>
                <SearchBarStyled>
                  <SearchWrapper>
                    <SearchInput
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                      placeholder="Search templates..."
                    />
                  </SearchWrapper>
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
                  showBorder={true}
                />

                {!showSidebar && (
                  <ArchivedToggle
                    $active={filterMode === "Archived"}
                    onClick={() =>
                      setFilterMode(prev =>
                        prev === "Archived" ? "All" : "Archived",
                      )
                    }
                  >
                    {filterMode === "Archived"
                      ? "Active templates"
                      : "Archived"}
                  </ArchivedToggle>
                )}
              </FilterPlusSearch>
              {templatesLoading ? (
                <LoadingScreen>
                  <CircularProgress
                    color="inherit"
                    aria-label="Loading templates…"
                  />
                </LoadingScreen>
              ) : (
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
              )}

              {filteredTemplates.map(t => {
                const isLocked = isLockedTemplate(t);

                return (
                  <TemplateRow key={t.template_id} $disabled={isLocked}>
                    <NameColumn
                      onClick={() => handleOpenTemplate(t)}
                      title={
                        isLocked
                          ? "You cannot edit this template. View content through downloading the PDF."
                          : undefined
                      }
                    >
                      {t.template_name}
                    </NameColumn>
                    <DateColumn onClick={() => handleOpenTemplate(t)}>
                      <div>
                        {new Date(t.timestamp).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </DateColumn>

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
                          setCopyConfirm(t);
                        }}
                        title="Make a copy"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="6"
                            y="6"
                            width="10"
                            height="10"
                            rx="1.5"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M4 12V5a1 1 0 011-1h7"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </EditIconWrapper>

                      <EditIconWrapper
                        onClick={e => {
                          e.stopPropagation();
                          handleViewTemplatePdf(t.template_id);
                        }}
                        title="Download PDF"
                        style={{
                          opacity: pdfLoading === t.template_id ? 0.5 : 1,
                          pointerEvents:
                            pdfLoading === t.template_id ? "none" : "auto",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0)">
                            <path
                              d="M2.5 8.33334H7.5"
                              stroke="currentColor"
                              strokeWidth="0.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4.99984 1.66666V6.66666M4.99984 6.66666L6.45817 5.20832M4.99984 6.66666L3.5415 5.20832"
                              stroke="currentColor"
                              strokeWidth="0.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0">
                              <rect width="10" height="10" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </EditIconWrapper>

                      {canManageTemplate(t) && (
                        <EditIconWrapper
                          onClick={e => {
                            e.stopPropagation();
                            setArchiveConfirm(t);
                          }}
                          title={t.archived ? "Unarchive" : "Archive"}
                        >
                          {t.archived ? (
                            <ArchiveRestore size={18} />
                          ) : (
                            <Archive size={18} />
                          )}
                        </EditIconWrapper>
                      )}
                    </RowActions>
                  </TemplateRow>
                );
              })}
            </MainDiv>
          </PageDiv>
        </ContentWrapper>
      </LayoutWrapper>

      <WarningModal
        open={copyConfirm !== null}
        onClose={handleCopyConfirm}
        title="Make a copy"
        caption={`Create an editable copy of "${copyConfirm?.template_name ?? "this template"}" for your group?`}
        noCancel={false}
        confirmLabel="Make a copy"
        loading={copying}
      />

      <WarningModal
        open={archiveConfirm !== null}
        onClose={handleArchiveConfirm}
        title={
          archiveConfirm?.archived ? "Unarchive template" : "Archive template"
        }
        caption={
          archiveConfirm?.archived
            ? `Restore "${archiveConfirm?.template_name ?? "this template"}" to your active templates?`
            : `Archive "${archiveConfirm?.template_name ?? "this template"}"? It will be hidden from your template lists. You can restore it from Archived.`
        }
        noCancel={false}
        confirmLabel={archiveConfirm?.archived ? "Unarchive" : "Archive"}
        loading={archiving}
      />
    </>
  );
}
