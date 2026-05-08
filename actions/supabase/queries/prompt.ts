import { PromptType, UUID } from "@/types/schema";
import supabase from "../client";

export async function fetchOptionsForPrompts(prompt_ids: UUID[]) {
  if (prompt_ids.length === 0) return [];

  const { data, error } = await supabase
    .from("prompt_option")
    .select("*")
    .in("prompt_id", prompt_ids);

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }

  return data ?? [];
}

export async function addNewPrompt(
  prompt_text: string,
  prompt_type: PromptType,
): Promise<UUID> {
  const { data, error } = await supabase
    .from("prompt")
    .insert([
      {
        prompt_text,
        prompt_type,
      },
    ])
    .select("prompt_id")
    .single(); // returns { prompt_id: ... }

  if (error) {
    throw new Error(`Error inserting prompt: ${error.message}`);
  }

  return data.prompt_id as UUID;
}

export async function addNewOption(
  prompt_id: UUID,
  option_text: string,
): Promise<UUID> {
  const { data, error } = await supabase
    .from("prompt_option")
    .insert([
      {
        prompt_id,
        option_text,
      },
    ])
    .select("option_id")
    .single(); // returns { option_id: ... }

  if (error) {
    throw new Error(`Error inserting prompt: ${error.message}`);
  }

  return data.option_id as UUID;
}

export async function replacePromptOptions(
  prompt_id: string,
  options: { option_text: string }[],
) {
  const { error: deleteError } = await supabase
    .from("prompt_option")
    .delete()
    .eq("prompt_id", prompt_id);

  if (deleteError) {
    console.error("Error deleting prompt options:", deleteError);
    throw deleteError;
  }

  if (options.length === 0) return;

  const rows = options.map(opt => ({
    prompt_id,
    option_text: opt.option_text ?? "",
  }));

  const { error: insertError } = await supabase
    .from("prompt_option")
    .insert(rows);

  if (insertError) {
    console.error("Error inserting prompt options:", insertError);
    throw insertError;
  }
}
