"use server";

import type { Tag, Template, UUID } from "@/types/schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type CreateTagParams = {
  name: string;
  user_group_id: string;
  number: number;
  color: string;
};

export async function createTag(params: CreateTagParams): Promise<UUID> {
  const supabase = await getSupabaseServerClient();
  // inserts a new tag into the tag table, returns the tag_id
  const { name, user_group_id, number, color } = params;

  const { data, error } = await supabase
    .from("tag")
    .insert({
      name,
      user_group_id,
      number,
      color,
    })
    .select("tag_id")
    .single();

  if (error) {
    throw new Error(`Error creating tag: ${error.message}`);
  }

  return data.tag_id;
}
export async function deleteTag(tag_id: UUID): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("tag").delete().eq("tag_id", tag_id);

  if (error) {
    throw new Error(`Error deleting tag: ${error.message}`);
  }

  return true;
}

export async function getAllTags(user_group_id: UUID): Promise<Tag[]> {
  const supabase = await getSupabaseServerClient();
  // Fetches all tags and numbers for your user-group-id (for populating dropdowns)
  const { data, error } = await supabase
    .from("tag")
    .select("*")
    .eq("user_group_id", user_group_id);

  if (error) {
    throw new Error(`Error fetching tags: ${error.message}`);
  }

  return data;
}

export async function assignTagToTemplate(
  templateId: UUID,
  tagId: UUID,
): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  // Adds a new row to template_tag
  const { error } = await supabase.from("template_tag").insert({
    template_id: templateId,
    tag_id: tagId,
  });

  if (error) {
    throw new Error(`Error assigning tag: ${error.message}`);
  }

  return true;
}

export async function removeTagFromTemplate(
  templateId: UUID,
  tagId: UUID,
): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  // Deletes a row from template_tag
  const { error } = await supabase
    .from("template_tag")
    .delete()
    .eq("tag_id", tagId)
    .eq("template_id", templateId);

  if (error) {
    throw new Error(`Error removing tag: ${error.message}`);
  }

  return true;
}

export async function renameTag(
  tag_id: UUID,
  new_name: string,
): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("tag")
    .update({ name: new_name })
    .eq("tag_id", tag_id);

  if (error) {
    console.error("Error updating tag:", error.message);
    return false;
  }

  return true;
}
