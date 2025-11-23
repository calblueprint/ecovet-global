import { UUID } from "crypto";
import { PromptType } from "@/types/schema";
import supabase from "../client";

export async function getOptionsForPrompt(prompt_id: UUID) {
  const { data, error } = await supabase
    .from("prompt_option")
    .select("*")
    .eq("prompt_id", prompt_id);

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }

  return data;
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
