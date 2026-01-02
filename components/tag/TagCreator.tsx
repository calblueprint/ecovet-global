"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UUID } from "crypto";
import {
  createTag,
  getAllTags,
  renameTag,
} from "@/actions/supabase/queries/tag";
import img from "@/assets/images/NewTagPlus.png";
import COLORS from "@/styles/colors";
import { Tag } from "@/types/schema";
import { AddNewTagPlus, NewTag, SidebarTag, StyledTagCreator } from "./styles";
import { TagComponent } from "./Tag";

type TagCreatorProps = {
  user_group_id: UUID;
  onTagClick: (tag_id: UUID) => void;
  selectedTagId: UUID | null;
  onTagRenamed?: () => void;
  onDeleteTag: (tag_id: UUID) => Promise<boolean>;
};

type ColorKey = keyof typeof COLORS;

const TAG_COLOR_ORDER: ColorKey[] = [
  "tagRed",
  "tagOrange",
  "tagYellow",
  "tagGreen",
  "tagBlue",
];

export function TagCreator({
  user_group_id,
  onTagClick,
  selectedTagId,
  onTagRenamed,
  onDeleteTag,
}: TagCreatorProps) {
  // Switch to use Tag type from schema
  const [tags, setTags] = useState<Tag[]>([]);

  // Pull data from server or DB
  async function getTags() {
    const pulledTags = await getAllTags(user_group_id);
    setTags(pulledTags);
  }

  async function addNewTag() {
    const nextColor = TAG_COLOR_ORDER[tags.length % TAG_COLOR_ORDER.length];

    const new_tag_id = await createTag({
      name: "New tag",
      user_group_id: user_group_id,
      number: 10,
      color: nextColor,
    });

    // Construct the full Tag manually
    const newTag: Tag = {
      tag_id: new_tag_id,
      name: "New tag",
      user_group_id: user_group_id,
      number: 10,
      color: nextColor,
    };

    // Add returned tag to UI state
    setTags(prev => [...prev, newTag]);
  }

  async function handleRename(tag_id: UUID, newName: string) {
    const success = await renameTag(tag_id, newName);
    if (!success) return;

    // Update state
    setTags(prev =>
      prev.map(t => (t.tag_id === tag_id ? { ...t, name: newName } : t)),
    );

    onTagRenamed?.();
  }

  async function handleDeleteTag(tag_id: UUID) {
    // Run parent delete function
    const success = await onDeleteTag(tag_id); // return boolean
    if (!success) return;

    // Remove from local state
    setTags(prev => prev.filter(t => t.tag_id !== tag_id));
  }

  useEffect(() => {
    getTags();
  }, [user_group_id, getTags]);

  return (
    <StyledTagCreator>
      <NewTag onClick={addNewTag}>
        <AddNewTagPlus>
          <Image alt="add new tag plus icon" src={img} />
        </AddNewTagPlus>
        New Tag
      </NewTag>
      {tags.map(tag => (
        <SidebarTag
          key={tag.tag_id}
          $isSelected={selectedTagId === tag.tag_id}
          onClick={() => onTagClick(tag.tag_id)}
        >
          <TagComponent
            color={tag.color as ColorKey}
            name={tag.name}
            tag_id={tag.tag_id}
            sidebar={true}
            onRename={handleRename}
            onDelete={() => handleDeleteTag(tag.tag_id)}
          />
        </SidebarTag>
      ))}
    </StyledTagCreator>
  );
}
