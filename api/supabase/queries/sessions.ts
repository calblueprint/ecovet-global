import { UUID } from "crypto";
import supabase from "@/actions/supabase/client";
import { Phase, RolePhase } from "@/types/schema";

export async function fetchRoles(templateId: string) {
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

export async function assignRole(userId: string, roleId: string) {
  const { data, error } = await supabase
    .from("profile")
    .update({ role_id: roleId })
    .eq("id", userId);

  if (error) {
    throw error;
  }
  return data;
}

export async function assignSession(userId: string, sessionId: string) {
  const { error } = await supabase
    .from("profile")
    .update({ session_id: sessionId })
    .eq("id", userId);
  if (error) {
    throw error;
  }
}

export async function createSession(templateId: string, userGroupId: string) {
  const id = crypto.randomUUID();
  const { data, error } = await supabase
    .from("session")
    .insert([
      {
        session_id: id,
        template_id: templateId,
        user_group_id: userGroupId,
        is_async: false,
      },
    ])
    .select("session_id");

  if (error) throw error;
  return data[0].session_id;
}

export async function fetchPhases(sessionId: UUID): Promise<Phase[]> {
  const { data, error } = await supabase
    .from("phase")
    .select("*")
    .eq("session_id", sessionId);
  if (error) {
    console.error("Error fetching profile by user_id:", error);
  }

  return data ?? [];
}

export async function fetchRolePhases(
  roleId: UUID,
  phaseId: UUID,
): Promise<RolePhase> {
  const { data, error } = await supabase
    .from("role_phase")
    .select("*")
    .eq("phase_id", phaseId)
    .eq("role_id", roleId)
    .single();
  if (error) {
    console.error("Error fetching profile by user_id:", error);
  }
  return data;
}

export async function fetchPrompts(rolePhaseId: UUID): Promise<string[]> {
  const { data, error } = await supabase
    .from("prompt")
    .select("prompt_text")
    .eq("role_phase_id", rolePhaseId);
  if (error) {
    console.error("Error fetching profile by user_id:", error);
  }
  return data?.map(prompt => prompt.prompt_text) ?? [];
}

export async function createPromptAnswer(userId: string, promptId: string, answer: string) {
  const { data, error } = await supabase
    .from("prompt_response")
    .insert([
      {
        prompt_response_id: crypto.randomUUID(),
        user_id: userId,
        prompt_id: promptId,
        prompt_answer: answer,
      },
    ])
    .select("prompt_response_id");
  if (error) {
    console.error("Error creating prompt answer:", error);
  }
  return data;
}
