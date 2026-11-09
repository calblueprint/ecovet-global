import type { Prompt, PromptType } from "@/types/schema";

// Image blocks are part of the ordered prompt list but take no answer.
export function isAnswerable(prompt: Pick<Prompt, "prompt_type">): boolean {
  return prompt.prompt_type !== "image";
}

export function hasOptions(promptType: PromptType | null): boolean {
  return promptType === "multiple_choice" || promptType === "checkbox";
}
