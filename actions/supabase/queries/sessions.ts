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

export async function fetchChatUserOptions(
  userGroupId: string,
  sessionId: string,
) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profile")
    .select(
      `
    *,
    participant_session!inner(session_id)
  `,
    )
    .eq("user_group_id", userGroupId)
    .eq("participant_session.session_id", sessionId);

  if (error) {
    console.error("Error fetching chat users options:", error);
    throw new Error("Error fetching chat users options");
  }

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

  if (!session.template_id) {
    throw new Error(`No session template`);
  }

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
  const { error } = await supabase.from("participant_session").upsert(
    {
      user_id: userId,
      session_id: sessionId,
      role_id: roleId,
      is_finished: false,
      phase_index: 0,
    },
    {
      onConflict: "user_id,session_id",
    },
  );

  if (error) {
    throw error;
  }
}

export async function createSession(
  templateId: string,
  userGroupId: string,
  forceAdvance: boolean = false,
) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("session")
    .insert([
      {
        template_id: templateId,
        user_group_id: userGroupId,
        force_advance: forceAdvance,
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
      profile!fk_participant_profile (
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
      profile!fk_participant_profile (
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

export async function advancePhaseForSingleUser(
  userId: UUID,
  roleId: UUID,
  sessionId: UUID,
): Promise<void> {
  console.log("Advancing phase for user:", { userId, roleId, sessionId });
  const supabase = await getSupabaseServerClient();

  const { data: currentData, error: fetchError } = await supabase
    .from("participant_session")
    .select("phase_index")
    .eq("user_id", userId)
    .eq("role_id", roleId)
    .eq("session_id", sessionId)
    .single();

  if (fetchError) {
    throw new Error(
      `Failed to fetch current phase index for user in advancePhaseForUser: ${fetchError.message}`,
    );
  }
  if (!currentData.phase_index) {
    throw new Error(`Phase Index is null`);
  }
  const { data, error } = await supabase
    .from("participant_session")
    .update({ phase_index: currentData.phase_index + 1 })
    .eq("user_id", userId)
    .eq("role_id", roleId)
    .eq("session_id", sessionId)
    .select();

  if (error) {
    throw new Error(
      `Failed to set advance phase for single user: ${error.message}`,
    );
  }

  if (!data || data.length === 0) {
    throw new Error("No participant_session row matched the update");
  }
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

export async function isSessionForceAdvance(sessionId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: session, error: sessionError } = await supabase
    .from("session")
    .select("force_advance")
    .eq("session_id", sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error("Failed to fetch session");
  }

  return session.force_advance;
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
  if (!session.template_id) {
    throw new Error(`No session template`);
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

  if (error) {
    console.error("fetchMostRecentPhase error:", error);
    throw new Error("Failed to fetch user's most recent phase", error);
  }

  if (!data) {
    throw new Error("No phase id found");
  }
  if (!data.phase_index) {
    throw new Error(`No phase index`);
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
  rolePhaseId: UUID,
  answer: string,
) {
  console.log("Creating prompt answer with:", {
    userId,
    promptId,
    sessionId,
    answer,
  });

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("prompt_response")
    .upsert(
      [
        {
          prompt_response_id: crypto.randomUUID(),
          user_id: userId,
          prompt_id: promptId,
          prompt_answer: answer,
          prompt_option_id: null,
          session_id: sessionId,
          role_phase_id: rolePhaseId,
        },
      ],
      { onConflict: "user_id,prompt_id,session_id,role_phase_id" },
    )
    .select("prompt_response_id");

  if (error) {
    console.error(
      "Error creating prompt answer:",
      JSON.stringify(error, null, 2),
    );
  }

  return data;
}

export async function fetchPromptResponses(
  userId: string,
  sessionId: string,
  rolePhaseId: UUID,
): Promise<PromptAnswer[] | null> {
  const supabase = await getSupabaseServerClient();
  // Fetch all response to for user for session for the phase
  const { data, error } = await supabase
    .from("prompt_response")
    .select("*")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .eq("role_phase_id", rolePhaseId);
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

export async function getPhaseId(sessionId: UUID): Promise<UUID | null> {
  const supabase = await getSupabaseServerClient();

  const { data: sessionData, error: sessionError } = await supabase
    .from("session")
    .select("template_id")
    .eq("session_id", sessionId)
    .single();

  if (sessionError) {
    console.error("Session error:", sessionError);
    throw sessionError;
  }

  const templateId = sessionData.template_id;

  if (!templateId) {
    throw new Error(`No session template`);
  }

  const { data: phaseData, error: phaseError } = await supabase
    .from("phase")
    .select("phase_id")
    .eq("template_id", templateId)
    .limit(1)
    .single();

  if (phaseError) {
    console.error("Phase error:", phaseError);
    throw phaseError;
  }

  return phaseData.phase_id ?? null;
}

export async function getPromptIdByRolePhase(
  rolePhaseId: UUID,
): Promise<string[] | null> {
  // DT: Effectively, this gives us the number of Prompt questions because the promptId is unique for each Prompt.
  //DT: This works because each PromptId is unique for each combination of Role + Phase.
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("prompt")
    .select("*")
    .eq("role_phase_id", rolePhaseId);

  if (error) {
    console.error("Error getting prompt_id:", error);
    throw error;
  }

  return data?.map(d => d.prompt_id) ?? null;
}

// DEPRECATED - query moved into fetchPromptsWithResponses
// kept for future use
export async function getRespondedPromptsByRolePhase(
  promptIds: UUID[],
  sessionId: UUID,
  rolePhaseId: UUID,
): Promise<string[] | null> {
  // DT: This gives us the number of Prompt questions that have been answered by the user for a particular Role + Phase in a particular Session.
  // DT: We have to use userId and sessionId because the same RolePhaseId can be present in multiple sessions and we want to know how many prompts
  // the user has answered for that RolePhaseId in that particular session.
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("prompt_response")
    .select("*")
    .in("prompt_id", promptIds)
    .eq("session_id", sessionId)
    .eq("role_phase_id", rolePhaseId);

  if (error) {
    console.error("Error counting responded prompts:", error);
    throw error;
  }

  return data?.map(d => d.prompt_id) ?? null;
}

// DEPRECATED - query moved into fetchPromptsWithResponses
// kept for future use
export async function fetchPromptsWithResponses(
  rolePhaseId: UUID,
  userId: UUID,
  sessionId: UUID,
) {
  const supabase = await getSupabaseServerClient();

  // 1. Get all prompts (questions)
  const { data: prompts, error: promptsError } = await supabase
    .from("prompt")
    .select("prompt_id, prompt_text")
    .eq("role_phase_id", rolePhaseId);

  if (promptsError) {
    console.error("Error fetching prompts:", promptsError);
    throw promptsError;
  }

  // 2. Get responses for each particular user/session/rolePhase
  const { data: responses, error: responsesError } = await supabase
    .from("prompt_response")
    .select("prompt_id, prompt_answer")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .eq("role_phase_id", rolePhaseId);

  if (responsesError) {
    console.error("Error fetching responses:", responsesError);
    throw responsesError;
  }

  // 3. Map responses by prompt_id for fast lookup
  const responseMap = new Map(
    responses?.map(r => [r.prompt_id, r.prompt_answer]),
  );

  // 4. Merge
  return prompts.map(p => ({
    promptId: p.prompt_id,
    question: p.prompt_text ?? "Missing Question",
    answer: responseMap.get(p.prompt_id) ?? null,
  }));
}

export async function fetchRolePhasesBatch(
  roleIds: UUID[],
  phaseId: UUID,
): Promise<Map<UUID, RolePhase>> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("role_phase")
    .select("*")
    .eq("phase_id", phaseId)
    .in("role_id", roleIds);

  if (error) {
    console.error("Error fetching role phases:", error);
    throw error;
  }

  return new Map(data?.map(rp => [rp.role_id, rp]) ?? []);
}
