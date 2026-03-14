"use server";

import type {
  ParticipantSessionWithProfile,
  Prompt,
  PromptAnswer,
  RolePhase,
  Session,
  UUID,
} from "@/types/schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function fetchRoles(templateId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("role")
    .select("role_name, role_id")
    .eq("template_id", templateId);
  if (error) throw error;
  return data
    ? data.map(r => ({
        id: String(r.role_id),
        name: String(r.role_name),
      }))
    : [];
}

export async function fetchParticipants(userGroupId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profile")
    .select("first_name, last_name, id")
    .eq("user_group_id", userGroupId);
  if (error) throw error;
  return data
    ? data.map(p => ({
        id: String(p.id),
        name: String(p.first_name + " " + p.last_name),
      }))
    : [];
}

export async function fetchTemplateId(session_id: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("session")
    .select("template_id")
    .eq("session_id", session_id)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchTemplateNameBySession(session_id: string) {
  const supabase = await getSupabaseServerClient();
  const { data: session, error: e1 } = await supabase
    .from("session")
    .select("template_id")
    .eq("session_id", session_id)
    .single();
  if (e1) throw e1;

  const { data: template, error: e2 } = await supabase
    .from("template")
    .select("template_name")
    .eq("template_id", session.template_id)
    .single();
  if (e2) throw e2;

  return template?.template_name ?? null;
}

export async function assignParticipantToSession(
  userId: UUID,
  sessionId: UUID,
  roleId: UUID | null,
) {
  const supabase = await getSupabaseServerClient();
  console.log(userId, sessionId, roleId);
  const { error } = await supabase.from("participant_session").upsert(
    {
      user_id: userId,
      session_id: sessionId,
      role_id: roleId,
      is_finished: false,
      phase_index: 1,
    },
    {
      onConflict: "user_id,session_id",
    },
  );

  if (error) {
    throw error;
  }
}

export async function createSession(templateId: string, userGroupId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("session")
    .insert([
      {
        template_id: templateId,
        user_group_id: userGroupId,
      },
    ])
    .select("session_id")
    .single();

  if (error) {
    console.error("createSession error:", error);
    throw error;
  }

  console.log("Created session row:", data);
  return data.session_id;
}

export type SessionParticipant = {
  user_id: UUID;
  role_id: UUID | null;
  session_id: UUID;
  phase_index: number | null;
  is_finished: boolean;
  profile: {
    first_name: string;
    last_name: string;
  };
};

export async function sessionParticipants(
  session_id: UUID,
): Promise<ParticipantSessionWithProfile[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("participant_session")
    .select(
      `
      user_id,
      role_id,
      session_id,
      phase_index,
      is_finished,
      profile (
        first_name,
        last_name
      )
    `,
    )
    .eq("session_id", session_id)
    .returns<ParticipantSessionWithProfile[]>();

  if (error) throw error;

  return data ?? [];
}

export async function sessionParticipantsBulk(
  session_ids: UUID[],
): Promise<ParticipantSessionWithProfile[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("participant_session")
    .select(
      `
      user_id,
      role_id,
      session_id,
      phase_index,
      is_finished,
      profile (
      first_name,
      last_name
      )
    `,
    )
    .in("session_id", session_ids)
    .returns<ParticipantSessionWithProfile[]>();

  if (error) throw error;
  return data ?? [];
}

export async function setIsFinished(
  userId: UUID,
  roleId: UUID,
  sessionId: UUID,
): Promise<void> {
  const supabase = await getSupabaseServerClient();
  console.log(userId, roleId, sessionId);

  const { data, error } = await supabase
    .from("participant_session")
    .update({ is_finished: true })
    .eq("user_id", userId)
    .eq("role_id", roleId) // REQUIRED because PK contains role_id
    .eq("session_id", sessionId)
    .select();

  if (error) {
    throw new Error(`Failed to set is_finished: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error("No participant_session row matched the update");
  }
}

export async function fetchPhases(sessionId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: session, error: sessionError } = await supabase
    .from("session")
    .select("template_id")
    .eq("session_id", sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error("Failed to fetch session");
  }

  const { data: phases, error: phasesError } = await supabase
    .from("phase")
    .select("*")
    .eq("template_id", session.template_id)
    .order("phase_number", { ascending: true });

  if (phasesError) {
    throw new Error("Failed to fetch phases");
  }

  return phases ?? [];
}

// Can merge with fetchRole so that we dont have to call twice
export async function fetchMostRecentPhase(
  userId: string,
  sessionId: string,
): Promise<number> {
  console.log("userId", userId, "sessionId", sessionId);
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("participant_session")
    .select("phase_index")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  console.log(data);
  if (error) {
    console.error("fetchMostRecentPhase error:", error);
    throw new Error("Failed to fetch user's most recent phase", error);
  }

  if (!data) {
    throw new Error("No phase id found");
  }

  return data.phase_index - 1;
}

export async function fetchRolePhases(
  roleId: UUID,
  phaseId: UUID,
): Promise<RolePhase | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("role_phase")
    .select("*")
    .eq("phase_id", phaseId)
    .eq("role_id", roleId)
    .single();
  if (error) {
    console.error("Error fetching role phases:", error);
  }
  return data;
}

export async function fetchPrompts(rolePhaseId: UUID): Promise<Prompt[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompt")
    .select("*")
    .eq("role_phase_id", rolePhaseId);
  if (error) {
    console.error("Error fetching prompts:", error);
  }
  return data ?? [];
}

export async function assignSession(userId: string, sessionId: string) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("profile")
    .update({ session_id: sessionId })
    .eq("id", userId);
  if (error) {
    throw error;
  }
}

export async function finishSession(sessionId: string) {
  const supabase = await getSupabaseServerClient();
  if (!sessionId) throw new Error("Missing sessionId");

  const { error: sessionError } = await supabase
    .from("session")
    .update({
      is_finished: true,
    })
    .eq("session_id", sessionId);

  if (sessionError) {
    console.error("Error finishing session:", sessionError.message);
    throw sessionError;
  }
}

export async function fetchRole(
  userId: string,
  sessionId: string,
): Promise<string | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("participant_session")
    .select("role_id")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data.role_id;
}

export async function createPromptAnswer(
  userId: string,
  promptId: string,
  sessionId: UUID,
  phaseId: UUID,
  answer: string,
) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompt_response")
    .upsert(
      [
        {
          prompt_response_id: crypto.randomUUID(),
          session_id: sessionId,
          phase_id: phaseId,
          user_id: userId,
          prompt_id: promptId,
          prompt_answer: answer,
        },
      ],
      { onConflict: "user_id,prompt_id,session_id" },
    )
    .select("prompt_response_id");

  if (error) {
    console.error(
      "Error creating prompt answer:",
      JSON.stringify(error, null, 2),
    );
  } else {
    console.log("Insert success:", data);
  }
  return data;
}

export async function fetchPromptResponses(
  userId: string,
  sessionId: string,
  phaseId: UUID,
): Promise<PromptAnswer[] | null> {
  const supabase = await getSupabaseServerClient();
  // Fetch all response to for user for session for the phase
  const { data, error } = await supabase
    .from("prompt_response")
    .select("*")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .eq("phase_id", phaseId);
  if (error) {
    console.error("Error fetching prompts:", error);
  }

  return data ?? [];
}

export async function fetchSessionsbyUserGroup(
  userGroupId: string,
): Promise<Session[] | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("session")
    .select("*")
    .eq("user_group_id", userGroupId);
  if (error) {
    console.error("Error fetching prompts:", error);
  }

  return data ?? [];
}
