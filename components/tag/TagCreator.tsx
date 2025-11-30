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

    // const pulledTags = [
    //     {
    //       tag_id: "092fa7b1-7509-4f09-86e6-62a5223113cb" as UUID,
    //       name: "meow",
    //       user_group_id: "0b73ed2d-61c3-472e-b361-edaa88f27622" as UUID,
    //       number: 1, // (number of templates with this tag)
    //       color: "teal" // might want to change to check COLOR type
    //     },
    //     {
    //       tag_id: "092fa7b1-7509-4f09-86e6-62a5223113cd" as UUID,
    //       name: "meow1",
    //       user_group_id: "0b73ed2d-61c3-472e-b361-edaa88f27622" as UUID,
    //       number: 1, // (number of templates with this tag)
    //       color: "orange" // might want to change to check COLOR type
    //     }
    // ];

    setTags(pulledTags);
  }

  async function addNewTag() {
    const new_tag_id = await createTag({
      name: "New tag",
      user_group_id: user_group_id,
      number: 10,
      color: "teal",
    });

    // Construct the full Tag manually
    const newTag: Tag = {
      tag_id: new_tag_id,
      name: "New tag",
      user_group_id: user_group_id,
      number: 10,
      color: "teal",
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
  }, []);

  return (
    <StyledTagCreator>
      <NewTag onClick={addNewTag}>
        <AddNewTagPlus>
          <Image alt="add new tag plus icon" src={img} />
        </AddNewTagPlus>
        New Tag
      </NewTag>
      {tags.map(tag => (
        <SidebarTag key={tag.tag_id} $isSelected={selectedTagId === tag.tag_id}>
          <TagComponent
            color={tag.color as ColorKey}
            name={tag.name}
            tag_id={tag.tag_id}
            sidebar={true}
            onClick={() => onTagClick(tag.tag_id)}
            onRename={handleRename}
            onDelete={() => handleDeleteTag(tag.tag_id)}
          />
        </SidebarTag>
      ))}
    </StyledTagCreator>
  );
}
