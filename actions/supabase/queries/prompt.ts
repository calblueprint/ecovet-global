import { StagedOption, UUID } from "@/types/schema";
import supabase from "../client";

export async function fetchOptionsForPrompts(prompt_ids: UUID[]) {
  if (prompt_ids.length === 0) return [];

  const { data, error } = await supabase
    .from("prompt_option")
    .select("*")
    .in("prompt_id", prompt_ids)
    .eq("archived", false)
    .order("option_number", { nullsFirst: false });

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }

  return data ?? [];
}

// Options are updated in place by option_number
// options can be archived
export async function savePromptOptions(
  prompt_id: UUID,
  options: StagedOption[],
) {
  if (options.length > 0) {
    const { error: upsertError } = await supabase.from("prompt_option").upsert(
      options.map((opt, i) => ({
        option_id: opt.option_id,
        prompt_id,
        option_text: opt.option_text ?? "",
        option_number: i + 1,
        archived: false,
      })),
      { onConflict: "option_id" },
    );
    if (upsertError) {
      console.error("Error saving prompt options:", upsertError);
      throw upsertError;
    }
  }

  const { data: existing, error: fetchError } = await supabase
    .from("prompt_option")
    .select("option_id")
    .eq("prompt_id", prompt_id)
    .eq("archived", false);
  if (fetchError) {
    console.error("Error fetching prompt options:", fetchError);
    throw fetchError;
  }

  const keep = new Set(options.map(o => o.option_id));
  const removed = (existing ?? [])
    .map(o => o.option_id)
    .filter(id => !keep.has(id));
  if (removed.length === 0) return;

  const { data: picked, error: pickedError } = await supabase
    .from("prompt_response")
    .select("prompt_option_id")
    .in("prompt_option_id", removed);
  if (pickedError) {
    console.error("Error checking option responses:", pickedError);
    throw pickedError;
  }

  const pickedIds = new Set((picked ?? []).map(r => r.prompt_option_id));
  const toArchive = removed.filter(id => pickedIds.has(id));
  const toDelete = removed.filter(id => !pickedIds.has(id));

  if (toArchive.length > 0) {
    const { error } = await supabase
      .from("prompt_option")
      .update({ archived: true })
      .in("option_id", toArchive);
    if (error) {
      console.error("Error archiving prompt options:", error);
      throw error;
    }
  }
  if (toDelete.length > 0) {
    const { error } = await supabase
      .from("prompt_option")
      .delete()
      .in("option_id", toDelete);
    if (error) {
      console.error("Error deleting prompt options:", error);
      throw error;
    }
  }
}
