"use server";

import type {
  ParticipantSessionWithProfile,
  Phase,
  Prompt,
  PromptAnswer,
  PromptWithResponse,
  Role,
  RolePhase,
  SessionWithTemplate,
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

export async function fetchChatUserOptions(
  userGroupId: string,
  sessionId: string,
): Promise<{ id: string; name: string; role: string }[]> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profile")
    .select(
      `
    *,
    participant_session!participant_session_user_id_fkey!inner(
      session_id,
      role_id,
      role(role_name)
    )
  `,
    )
    .eq("user_group_id", userGroupId)
    .eq("participant_session.session_id", sessionId);

  if (error) {
    console.error(
      "Error fetching chat users options:",
      error,
      ` userGroupId=${userGroupId}, sessionId=${sessionId}`,
    );
    throw new Error("Error fetching chat users options");
  }

  return data
    ? (data
        .map(p => {
          const session = Array.isArray(p.participant_session)
            ? p.participant_session[0]
            : p.participant_session;

          const role = Array.isArray(session?.role)
            ? session?.role[0]
            : session?.role;

          if (!role) return;

          return {
            id: String(p.id),
            name: String(p.first_name + " " + p.last_name),
            role: role?.role_name ? String(role.role_name) : "",
          };
        })
        .filter(user => user) as { id: string; name: string; role: string }[])
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

export async function fetchPDFName(session_id: string) {
  const supabase = await getSupabaseServerClient();

  const { data: session, error: e1 } = await supabase
    .from("session")
    .select("template_id, created_at, session_name")
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

  return {
    template_name: template?.template_name ?? null,
    created_at: session.created_at as string | null,
    session_name: session.session_name as string | null,
  };
}

export async function fetchSessionsbyUserGroup(
  userGroupId: string,
): Promise<SessionWithTemplate[] | null> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("session")
    .select(
      `
      *,
      template (
        template_name
      )
    `,
    )
    .eq("user_group_id", userGroupId);

  if (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }

  return data ?? [];
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

// for a force advance game
export async function fetchSessionGlobalPhaseIndex(sessionId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("session")
    .select("phase_index")
    .eq("session_id", sessionId)
    .single();

  if (error) throw error;
  if (data == null)
    throw new Error(
      `Session with sessionId ${sessionId} not found while trying to fetchSessionGlobalPhaseIndex`,
    );

  return data.phase_index ?? 0;
}

// only for force advance sessions, so we make sure people don't advance further than they should
export async function setSessionGlobalPhaseIndex(
  sessionId: string,
  newPhaseIndex: number,
) {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase
    .from("session")
    .update({ phase_index: newPhaseIndex })
    .eq("session_id", sessionId);

  if (error) throw error;
}

export async function createSession(
  templateId: string,
  userGroupId: string,
  forceAdvance: boolean = false,
  isAsync: boolean,
  sessionName?: string,
) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("session")
    .insert([
      {
        template_id: templateId,
        user_group_id: userGroupId,
        force_advance: forceAdvance,
        is_async: isAsync,
        phase_index: forceAdvance ? 1 : null,
        // on force advance, start at phase 1 (so no force advance needed after scenario overview)
        session_name: sessionName ?? null,
      },
    ])
    .select("session_id")
    .single();

  if (error) {
    console.error("createSession error:", error);
    throw error;
  }

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
  } | null;
  role: {
    role_name: string;
  } | null;
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
      role (
        role_name
      ),
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

export async function advancePhaseForSingleUser(
  userId: UUID,
  roleId: UUID,
  sessionId: UUID,
): Promise<void> {
  return changePhaseForSingleUser(userId, roleId, sessionId, 1);
}

export async function backPhaseForSingleUser(
  userId: UUID,
  roleId: UUID,
  sessionId: UUID,
): Promise<void> {
  return changePhaseForSingleUser(userId, roleId, sessionId, -1);
}

export async function changePhaseForSingleUser(
  userId: UUID,
  roleId: UUID,
  sessionId: UUID,
  phaseChange: number,
): Promise<void> {
  const supabase = await getSupabaseServerClient();

  const { data: currentData, error: fetchError } = await supabase
    .from("participant_session")
    .select("phase_index, session!inner(template_id)")
    .eq("user_id", userId)
    .eq("role_id", roleId)
    .eq("session_id", sessionId)
    .single();

  if (fetchError) {
    throw new Error(
      `Failed to fetch current phase index for user in changePhaseForUser: ${fetchError.message}`,
    );
  }
  if (currentData.phase_index == null) {
    throw new Error(`Phase Index is null: ${JSON.stringify(currentData)}`);
  }

  if (currentData.phase_index + phaseChange < -1) {
    throw new Error(
      `Cannot change phase from "${currentData.phase_index}" to "${currentData.phase_index + phaseChange}"`,
    );
  }

  // upper bound
  const templateId = (currentData.session as { template_id: string })
    .template_id;
  const { count: phaseCount, error: countError } = await supabase
    .from("phase")
    .select("*", { count: "exact", head: true })
    .eq("template_id", templateId);

  if (countError || phaseCount == null) {
    throw new Error(`Failed to count phases: ${countError?.message}`);
  }

  const next = currentData.phase_index + phaseChange;

  // check next against the bounds
  if (next < 0 || next > phaseCount) {
    throw new Error(
      `Cannot change phase from ${currentData.phase_index} to ${next} (valid: 0..${phaseCount})`,
    );
  }

  const { data, error } = await supabase
    .from("participant_session")
    .update({ phase_index: next })
    .eq("user_id", userId)
    .eq("role_id", roleId)
    .eq("session_id", sessionId)
    .select();

  if (error) {
    throw new Error(
      `Failed to set change phase for single user: ${error.message}`,
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

export async function fetchParticipantPhaseIndex(
  userId: UUID,
  sessionId: UUID,
): Promise<number> {
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
  if (data.phase_index === null || data.phase_index === undefined) {
    throw new Error(`No phase index`);
  }

  return data.phase_index;
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
    .eq("role_phase_id", rolePhaseId)
    .order("prompt_number");
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

export async function isSessionFinished(sessionId: string): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  if (!sessionId) throw new Error("Missing sessionId");

  const { data, error: sessionError } = await supabase
    .from("session")
    .select("is_finished")
    .eq("session_id", sessionId);

  if (sessionError) {
    console.error("Error finishing session:", sessionError.message);
    throw sessionError;
  }
  return data[0].is_finished;
}

export async function fetchRoleForParticipant(
  userId: UUID,
  sessionId: UUID,
): Promise<Role | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("participant_session")
    .select("role(*)")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .single<{ role: Role | null }>();

  if (error) {
    throw error;
  }

  return data.role;
}

export async function createPromptAnswer(
  userId: string,
  promptId: string,
  sessionId: UUID,
  rolePhaseId: UUID,
  answer: string,
  promptType: string | null,
) {
  const supabase = await getSupabaseServerClient();

  const baseRow = {
    session_id: sessionId,
    role_phase_id: rolePhaseId,
    user_id: userId,
    prompt_id: promptId,
  };

  if (promptType === "checkbox") {
    const { error: deleteError } = await supabase
      .from("prompt_response")
      .delete()
      .match({
        user_id: userId,
        prompt_id: promptId,
        session_id: sessionId,
      });

    if (deleteError) {
      console.error("Error clearing previous checkbox responses:", deleteError);
      return null;
    }

    let optionIds: string[] = [];
    try {
      const parsed = JSON.parse(answer);
      if (Array.isArray(parsed)) optionIds = parsed;
    } catch {
      optionIds = [];
    }

    if (optionIds.length === 0) return [];

    const rows = optionIds.map(optId => ({
      ...baseRow,
      prompt_response_id: crypto.randomUUID(),
      prompt_option_id: optId,
      prompt_answer: null,
    }));

    const { data, error } = await supabase
      .from("prompt_response")
      .insert(rows)
      .select("prompt_response_id");

    if (error) console.error("Error inserting checkbox responses:", error);
    return data;
  }

  if (promptType === "multiple_choice") {
    await supabase.from("prompt_response").delete().match({
      user_id: userId,
      prompt_id: promptId,
      session_id: sessionId,
    });

    const { data, error } = await supabase
      .from("prompt_response")
      .insert({
        ...baseRow,
        prompt_response_id: crypto.randomUUID(),
        prompt_option_id: answer,
        prompt_answer: null,
      })
      .select("prompt_response_id");

    if (error) console.error("Error inserting MCQ response:", error);
    return data;
  }

  const { data, error } = await supabase
    .from("prompt_response")
    .upsert(
      {
        ...baseRow,
        prompt_response_id: crypto.randomUUID(),
        prompt_answer: answer,
        prompt_option_id: null,
      },
      { onConflict: "user_id,prompt_id,session_id,prompt_option_id" },
    )
    .select("prompt_response_id");

  if (error) console.error("Error upserting text response:", error);
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

export type ParticipantDetailBundle = {
  participant: ParticipantSessionWithProfile;
  email: string;
  phases: Phase[];
  isAsync: boolean;
  rolePhases: Array<[UUID, RolePhase]>;
  promptsByRolePhase: Array<[UUID, PromptWithResponse[]]>;
};

export async function fetchParticipantDetailBundle(
  sessionId: UUID,
  userId: UUID,
): Promise<ParticipantDetailBundle | { error: string }> {
  const supabase = await getSupabaseServerClient();

  const [participantsResult, profileResult, phasesResult, sessionMetaResult] =
    await Promise.all([
      supabase
        .from("participant_session")
        .select(
          `
        user_id,
        role_id,
        session_id,
        phase_index,
        is_finished,
        role ( role_name ),
        profile!fk_participant_profile (
          first_name,
          last_name
        )
      `,
        )
        .eq("session_id", sessionId),

      supabase.from("profile").select("email").eq("id", userId).single(),

      (async () => {
        const { data: session, error: sessionError } = await supabase
          .from("session")
          .select("template_id")
          .eq("session_id", sessionId)
          .single();
        if (sessionError || !session?.template_id) {
          return { data: [] as Phase[], error: sessionError };
        }
        return await supabase
          .from("phase")
          .select("*")
          .eq("template_id", session.template_id)
          .order("phase_number", { ascending: true });
      })(),

      supabase
        .from("session")
        .select("is_async")
        .eq("session_id", sessionId)
        .single(),
    ]);

  if (participantsResult.error) {
    console.error("Failed to fetch participants:", participantsResult.error);
    return { error: "Failed to load participants" };
  }
  if (phasesResult.error) {
    console.error("Failed to fetch phases:", phasesResult.error);
    return { error: "Failed to load phases" };
  }

  const participants = (participantsResult.data ??
    []) as unknown as ParticipantSessionWithProfile[];
  const participant = participants.find(p => p.user_id === userId);
  if (!participant?.role_id) {
    return { error: "Participant not found in session" };
  }

  const phases = (phasesResult.data ?? []) as Phase[];
  const phaseIds = phases.map(p => p.phase_id as UUID);

  let rolePhases: RolePhase[] = [];
  if (phaseIds.length > 0) {
    const { data: rpData, error: rpError } = await supabase
      .from("role_phase")
      .select("*")
      .eq("role_id", participant.role_id)
      .in("phase_id", phaseIds);
    if (rpError) {
      console.error("Failed to fetch role_phases:", rpError);
      return { error: "Failed to load role phases" };
    }
    rolePhases = (rpData ?? []) as RolePhase[];
  }

  const rolePhaseIds = rolePhases.map(rp => rp.role_phase_id as UUID);
  const [promptsResult, responsesResult] = await Promise.all([
    rolePhaseIds.length > 0
      ? supabase
          .from("prompt")
          .select("*")
          .in("role_phase_id", rolePhaseIds)
          .order("prompt_number")
      : Promise.resolve({ data: [], error: null }),
    rolePhaseIds.length > 0
      ? supabase
          .from("prompt_response")
          .select("*")
          .eq("user_id", userId)
          .eq("session_id", sessionId)
          .in("role_phase_id", rolePhaseIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (promptsResult.error) {
    console.error("Failed to fetch prompts:", promptsResult.error);
    return { error: "Failed to load prompts" };
  }
  if (responsesResult.error) {
    console.error("Failed to fetch responses:", responsesResult.error);
    return { error: "Failed to load responses" };
  }

  const prompts = promptsResult.data ?? [];
  const responses = responsesResult.data ?? [];

  const promptIds = prompts.map(p => p.prompt_id);
  let options: Array<{
    option_id: UUID;
    prompt_id: UUID;
    option_text: string;
  }> = [];
  if (promptIds.length > 0) {
    const { data: optData, error: optError } = await supabase
      .from("prompt_option")
      .select("option_id, prompt_id, option_text")
      .in("prompt_id", promptIds);
    if (optError) {
      console.error("Failed to fetch options:", optError);
      return { error: "Failed to load options" };
    }
    options = (optData ?? []).filter(
      o => o.option_text != null,
    ) as typeof options;
  }

  const selectedOptionIds = new Set(
    responses
      .map(r => r.prompt_option_id)
      .filter((id): id is UUID => Boolean(id)),
  );

  const textAnswerByPrompt = new Map<UUID, string>();
  for (const r of responses) {
    if (r.prompt_answer) {
      textAnswerByPrompt.set(r.prompt_id as UUID, r.prompt_answer);
    }
  }

  const optionsByPrompt = new Map<
    UUID,
    Array<{ optionId: UUID; text: string; selected: boolean }>
  >();
  for (const o of options) {
    const list = optionsByPrompt.get(o.prompt_id) ?? [];
    list.push({
      optionId: o.option_id,
      text: o.option_text,
      selected: selectedOptionIds.has(o.option_id),
    });
    optionsByPrompt.set(o.prompt_id, list);
  }

  const promptsByRolePhase = new Map<UUID, PromptWithResponse[]>();
  for (const rolePhaseId of rolePhaseIds) {
    const phasePrompts = prompts.filter(p => p.role_phase_id === rolePhaseId);
    const merged: PromptWithResponse[] = phasePrompts.map(p => ({
      promptId: p.prompt_id as UUID,
      question: p.prompt_text ?? "Missing Question",
      answer: textAnswerByPrompt.get(p.prompt_id as UUID) ?? null,
      options: optionsByPrompt.get(p.prompt_id) ?? null,
    }));
    promptsByRolePhase.set(rolePhaseId, merged);
  }

  const rolePhasesByPhaseId = new Map<UUID, RolePhase>();
  for (const rp of rolePhases) {
    rolePhasesByPhaseId.set(rp.phase_id as UUID, rp);
  }

  return {
    participant,
    email: profileResult.data?.email ?? "no email",
    phases,
    isAsync: sessionMetaResult.data?.is_async ?? false,
    rolePhases: Array.from(rolePhasesByPhaseId.entries()),
    promptsByRolePhase: Array.from(promptsByRolePhase.entries()),
  };
}

export type FacilitatorSessionBundle = {
  sessionName: string | null;
  templateName: string | null;
  isForceAdvance: boolean;
  isAsync: boolean;
  sessionPhaseIndex: number; // session.phase_index, 0 if non-force-advance
  phases: Phase[];
  participants: ParticipantSessionWithProfile[];
  // key by userid
  participantPrompts: Array<
    [UUID, { done: number; total: number; prompts: PromptWithResponse[] }]
  >;
};

export async function fetchFacilitatorSessionBundle(
  sessionId: UUID,
  facilitatorUserId: UUID,
): Promise<FacilitatorSessionBundle | { error: string }> {
  const supabase = await getSupabaseServerClient();

  const [sessionResult, participantsResult] = await Promise.all([
    supabase
      .from("session")
      .select(
        `
        is_async,
        force_advance,
        phase_index,
        session_name,
        template_id,
        template ( template_name )
      `,
      )
      .eq("session_id", sessionId)
      .single(),

    supabase
      .from("participant_session")
      .select(
        `
        user_id,
        role_id,
        session_id,
        phase_index,
        is_finished,
        role ( role_name ),
        profile!fk_participant_profile (
          first_name,
          last_name
        )
      `,
      )
      .eq("session_id", sessionId),
  ]);

  if (sessionResult.error || !sessionResult.data) {
    return { error: "Failed to load session" };
  }
  if (participantsResult.error) {
    return { error: "Failed to load participants" };
  }

  const session = sessionResult.data;
  const templateId = session.template_id as UUID | null;
  if (!templateId) return { error: "Session has no template" };

  const { data: phasesData, error: phasesError } = await supabase
    .from("phase")
    .select("*")
    .eq("template_id", templateId)
    .order("phase_number", { ascending: true });

  if (phasesError) return { error: "Failed to load phases" };
  const phases = (phasesData ?? []) as Phase[];

  const allParticipants = (participantsResult.data ??
    []) as unknown as ParticipantSessionWithProfile[];
  const participants = allParticipants.filter(
    p => p.user_id !== facilitatorUserId,
  );

  const pairs = participants
    .filter(p => p.role_id && p.phase_index != null && p.phase_index > 0)
    .map(p => ({
      role_id: p.role_id as UUID,
      phase_id: phases[p.phase_index - 1]?.phase_id as UUID | undefined,
      user_id: p.user_id,
    }))
    .filter(pair => pair.phase_id);

  const uniqueRoleIds = [...new Set(pairs.map(p => p.role_id))];
  const uniquePhaseIds = [...new Set(pairs.map(p => p.phase_id as UUID))];

  let rolePhases: { role_phase_id: UUID; role_id: UUID; phase_id: UUID }[] = [];
  if (uniqueRoleIds.length > 0 && uniquePhaseIds.length > 0) {
    const { data, error } = await supabase
      .from("role_phase")
      .select("role_phase_id, role_id, phase_id")
      .in("role_id", uniqueRoleIds)
      .in("phase_id", uniquePhaseIds);
    if (error) return { error: "Failed to load role_phases" };
    rolePhases = (data ?? []) as typeof rolePhases;
  }

  const rolePhaseLookup = new Map<string, UUID>();
  for (const rp of rolePhases) {
    rolePhaseLookup.set(`${rp.role_id}:${rp.phase_id}`, rp.role_phase_id);
  }

  const participantRolePhaseIds = pairs
    .map(p => ({
      user_id: p.user_id,
      role_phase_id: rolePhaseLookup.get(`${p.role_id}:${p.phase_id}`),
    }))
    .filter((p): p is { user_id: UUID; role_phase_id: UUID } =>
      Boolean(p.role_phase_id),
    );

  const allRolePhaseIds = [
    ...new Set(participantRolePhaseIds.map(p => p.role_phase_id)),
  ];

  const [promptsResult, responsesResult] = await Promise.all([
    allRolePhaseIds.length > 0
      ? supabase
          .from("prompt")
          .select("*")
          .in("role_phase_id", allRolePhaseIds)
          .order("prompt_number")
      : Promise.resolve({ data: [], error: null }),
    allRolePhaseIds.length > 0
      ? supabase
          .from("prompt_response")
          .select("*")
          .eq("session_id", sessionId)
          .in("role_phase_id", allRolePhaseIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (promptsResult.error) return { error: "Failed to load prompts" };
  if (responsesResult.error) return { error: "Failed to load responses" };

  const allPrompts = promptsResult.data ?? [];
  const allResponses = responsesResult.data ?? [];

  const promptIds = allPrompts.map(p => p.prompt_id);
  let allOptions: { option_id: UUID; prompt_id: UUID; option_text: string }[] =
    [];
  if (promptIds.length > 0) {
    const { data, error } = await supabase
      .from("prompt_option")
      .select("option_id, prompt_id, option_text")
      .in("prompt_id", promptIds);
    if (error) return { error: "Failed to load options" };
    allOptions = (data ?? []).filter(
      o => o.option_text != null,
    ) as typeof allOptions;
  }

  const participantPromptsArr: Array<
    [UUID, { done: number; total: number; prompts: PromptWithResponse[] }]
  > = [];

  for (const { user_id, role_phase_id } of participantRolePhaseIds) {
    const userPrompts = allPrompts.filter(
      p => p.role_phase_id === role_phase_id,
    );
    const userResponses = allResponses.filter(
      r => r.role_phase_id === role_phase_id && r.user_id === user_id,
    );

    const selectedOptionIds = new Set(
      userResponses
        .map(r => r.prompt_option_id)
        .filter((id): id is UUID => Boolean(id)),
    );
    const textAnswers = new Map<UUID, string>();
    for (const r of userResponses) {
      if (r.prompt_answer)
        textAnswers.set(r.prompt_id as UUID, r.prompt_answer);
    }

    const merged: PromptWithResponse[] = userPrompts.map(p => {
      const opts = allOptions.filter(o => o.prompt_id === p.prompt_id);
      return {
        promptId: p.prompt_id as UUID,
        question: p.prompt_text ?? "Missing Question",
        answer: textAnswers.get(p.prompt_id as UUID) ?? null,
        options:
          opts.length > 0
            ? opts.map(o => ({
                optionId: o.option_id,
                text: o.option_text,
                selected: selectedOptionIds.has(o.option_id),
              }))
            : null,
      };
    });

    const done = merged.filter(
      p => p.answer || p.options?.some(o => o.selected),
    ).length;

    participantPromptsArr.push([
      user_id,
      { done, total: merged.length, prompts: merged },
    ]);
  }

  return {
    sessionName: session.session_name ?? null,
    templateName:
      (session.template as { template_name?: string } | null)?.template_name ??
      null,
    isForceAdvance: session.force_advance ?? false,
    isAsync: session.is_async ?? false,
    sessionPhaseIndex: session.phase_index ?? 0,
    phases,
    participants,
    participantPrompts: participantPromptsArr,
  };
}
