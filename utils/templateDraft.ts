import type { LocalStore } from "@/types/schema";

type Draft = { savedAt: number; store: LocalStore };

export function templateDraftKey(templateId: string | null): string {
  return `template-draft:${templateId ?? "new"}`;
}

export function readTemplateDraft(key: string): Draft | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Draft;
    return draft?.store?.templateID ? draft : null;
  } catch {
    return null;
  }
}

export function writeTemplateDraft(key: string, store: LocalStore): void {
  try {
    const draft: Draft = { savedAt: Date.now(), store };
    localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // storage full or blocked: skip caching
  }
}

export function clearTemplateDraft(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // nothing to clear
  }
}
