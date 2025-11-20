import { UUID } from "crypto";
import supabase from "../client";

export async function getOptionsForPrompt(prompt_id: UUID) {
  const { data, error } = await supabase.from("prompt_option").select("*").eq('prompt_id', prompt_id);

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }

  return data;
}
