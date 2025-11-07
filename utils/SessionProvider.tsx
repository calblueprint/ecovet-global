"use client";

import supabase from "@/api/supabase/createClient";
import { useState } from "react";

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

export async function getSessionById(session_id: string): Promise<SessionLevelContext> {
    const [sessionContext, setSessionContext] = useState<SessionLevelContext>({sessionId : session_id, templateId : null, isAsync : null });
    const { data, error } = await supabase
    .from("sessions")
    .select("id, user_id")
    .eq("id", session_id)
    .single();
        
    if (error) {
        console.error("Error fetching session by session_id:", error);
    }
    setSessionContext({sessionId : session_id, templateId : null, isAsync : null})
    return sessionContext;
    //template id --> use user_group_id from template table?
    //isAsync --> session
}

export async function getUserProfile(user_id: string): Promise<ParticipantSessionContext> {
    const { data, error } = await supabase
    .from("profile")
    .select("role_id, phase_id, is_finished")
    .eq("id", user_id)
    .single();
    const participantContext: ParticipantSessionContext = data as unknown as ParticipantSessionContext;
    return participantContext;
}


export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionLevelContext, setSessionLevelContext] = useState<SessionLevelContext | null>(null);
  const [participantSessionContext, setParticipantSessionContext] = useState<ParticipantSessionContext | null>(null);

  return (<div></div>);
}

