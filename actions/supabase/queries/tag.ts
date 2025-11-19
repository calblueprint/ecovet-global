import { UUID } from "crypto";
import { Tag, Template } from "@/types/schema";
import supabase from "../client";

export type CreateTagParams = {
  name: string;
  user_group_id: string;
  number: number;
  color: string;
};

export async function createTag(params: CreateTagParams): Promise<UUID> {
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
  const { error } = await supabase.from("tag").delete().eq("tag_id", tag_id);

  if (error) {
    throw new Error(`Error deleting tag: ${error.message}`);
  }

  return true;
}

export async function getAllTags(user_group_id: UUID): Promise<Tag[]> {
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

type templateTag = { tag: Tag };

export async function getTagsForTemplate(templateId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("template_tag")
    .select(
      `
      tag:tag_id (*)
    `,
    )
    .eq("template_id", templateId)
    .overrideTypes<templateTag[], { merge: false }>(); // Add this bc data pulled from supabase has type Dict{tag: any[]}[], need to force it to Dict{tag: Tag[]}[]

  if (error) {
    throw new Error(`Error fetching tags for template: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // Extract the tag objects from the wrapper
  return data.map((item: templateTag) => item.tag);
}

type tagTemplate = { template: Template };

export async function getTemplatesforTag(tagId: UUID): Promise<Template[]> {
  // Returns all template names associated with a specific tag
  const { data, error } = await supabase
    .from("template_tag")
    .select(
      `
            template:template_id (*)
        `,
    )
    .eq("tag_id", tagId)
    .overrideTypes<tagTemplate[], { merge: false }>(); // Add this bc data pulled from supabase has type Dict{template: any[]}[], need to force it to Dict{tag: Template[]}[];

  if (error) {
    throw new Error(`Error fetching templates for tag: ${error.message}`);
  }

  // List of dicts, one for each template
  return data.map((item: tagTemplate) => item.template);
}

export async function renameTag(
  tag_id: UUID,
  new_name: string,
): Promise<boolean> {
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
