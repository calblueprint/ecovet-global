"use client";

import { createContext, useState } from "react";
import { UUID } from "crypto";
import supabase from "@/api/supabase/createClient";

// Session-level info from session table
export interface SessionLevelContext {
  sessionId: string;
  templateId: string | null;
  isAsync: boolean | null;
}

// Participant-specific info from profile table
export interface ParticipantSessionContext {
  roleId: string;
  phaseId: string;
  isFinished: boolean | null;
}

type SessionContextType = {
  userId: string | null;
  sessionLevelContext: SessionLevelContext | null;
  participantSessionContext: ParticipantSessionContext | null;
};

export async function getUserId(session_id: string): Promise<UUID> {
  const { data, error } = await supabase
    .from("session")
    .select("user_id")
    .eq("id", session_id)
    .single();

  if (error || !data) {
    console.error("Error fetching session by session_id:", error);
  }

  const user_id: UUID = data as unknown as UUID;
  return user_id;
}

export async function getSessionId(user_id: UUID): Promise<UUID> {
  const { data, error } = await supabase
    .from("session")
    .select("session_id")
    .eq("id", user_id)
    .single();

  if (error || !data) {
    console.error("Error fetching session by session_id:", error);
  }

  const session_id: UUID = data as unknown as UUID;
  return session_id;
}

export async function getTemplateId(user_session_id: UUID): Promise<UUID> {
  const { data, error } = await supabase
    .from("session")
    .select("template_id")
    .eq("session_id", user_session_id)
    .single();

  if (error) {
    console.error("Error fetching session by session_id:", error);
  }

  const template_id: UUID = data as unknown as UUID;
  return template_id;
}

export async function getIsAsync(user_session_id: UUID): Promise<boolean> {
  const { data, error } = await supabase
    .from("session")
    .select("is_async")
    .eq("session_id", user_session_id)
    .single();

  if (error || !data) {
    console.error("Error fetching session by session_id:", error);
  }

  const is_async = data?.is_async ?? false;
  return is_async;
}

export async function getSessionById(
  session_id: string,
): Promise<SessionLevelContext> {
  const [sessionContext, setSessionContext] = useState<SessionLevelContext>({
    sessionId: session_id,
    templateId: null,
    isAsync: null,
  });
  const user_id = await getUserId(session_id);
  const user_session_id = await getSessionId(user_id);
  const template_id = await getTemplateId(user_session_id);
  const is_async = await getIsAsync(user_session_id);
  setSessionContext({
    sessionId: session_id,
    templateId: template_id,
    isAsync: is_async,
  });
  return sessionContext;
}

export async function getUserProfile(
  user_id: string,
): Promise<ParticipantSessionContext> {
  const { data, error } = await supabase
    .from("profile")
    .select("role_id, phase_id, is_finished")
    .eq("id", user_id)
    .single();

  if (error || !data) {
    console.error("Error fetching session by session_id:", error);
  }

  const participantContext: ParticipantSessionContext =
    data as unknown as ParticipantSessionContext;
  return participantContext;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionLevelContext, setSessionLevelContext] =
    useState<SessionLevelContext | null>(null);
  const [participantSessionContext, setParticipantSessionContext] =
    useState<ParticipantSessionContext | null>(null);

  const SessionContext = createContext<SessionContextType | undefined>(
    undefined,
  );
  return (
    <SessionContext.Provider
      value={{ userId, sessionLevelContext, participantSessionContext }}
    >
      {children}
    </SessionContext.Provider>
  );
}
