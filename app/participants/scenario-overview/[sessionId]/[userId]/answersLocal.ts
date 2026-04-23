import type { Prompt, PromptAnswer, UUID } from "@/types/schema";

type AnswersMap = Record<string, string>;

function storageKey(userId: UUID, sessionId: UUID, rolePhaseId: string) {
  return `sessionAnswers:${userId}:${sessionId}:${rolePhaseId}`;
}

function safeGet(key: string): AnswersMap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: AnswersMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function readLocalAnswers(
  userId: UUID,
  sessionId: UUID,
  rolePhaseId: string,
  prompts: Prompt[],
): { answers: string[]; completed: Set<string> } | null {
  const map = safeGet(storageKey(userId, sessionId, rolePhaseId));
  if (!map) return null;

  const answers = prompts.map(p => map[p.prompt_id] ?? "");
  const completed = new Set(
    prompts.map(p => p.prompt_id).filter(id => !!map[id]),
  );
  return { answers, completed };
}

export function writeLocalAnswersFromDB(
  userId: UUID,
  sessionId: UUID,
  rolePhaseId: string,
  responses: PromptAnswer[],
) {
  const map: AnswersMap = {};
  for (const r of responses) {
    if (r?.prompt_id && r?.prompt_answer) {
      map[r.prompt_id] = r.prompt_answer;
    }
  }
  safeSet(storageKey(userId, sessionId, rolePhaseId), map);
}

export function updateLocalAnswer(
  userId: UUID,
  sessionId: UUID,
  rolePhaseId: string,
  promptId: string,
  value: string,
) {
  const key = storageKey(userId, sessionId, rolePhaseId);
  const map = safeGet(key) ?? {};
  if (value === "" || value == null) {
    delete map[promptId];
  } else {
    map[promptId] = value;
  }
  safeSet(key, map);
}
