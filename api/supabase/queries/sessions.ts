import { UUID, UUID } from "crypto";
import supabase from "@/actions/supabase/client";
import { ParticipantSession } from "@/app/facilitator/session-test/page";

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

export async function fetchTemplateId(session_id: string) {
  const { data, error } = await supabase
    .from("session")
    .select("template_id")
    .eq("session_id", session_id)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchSessionName(session_id: string) {
  const { data, error } = await supabase
    .from("session")
    .select("session_name")
    .eq("session_id", session_id)
    .single();
  if (error) throw error;
  return data;
}

export async function assignRole(userId: string, roleId: string) {
  const { data, error } = await supabase
    .from("participant_session")
    .update({ role_id: roleId })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
  return data;
}

export async function assignSession(userId: string, sessionId: string) {
  const { error } = await supabase
    .from("participant-session")
    .update({ session_id: sessionId })
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
}

export async function createSession(templateId: string, userGroupId: string) {
  const { data, error } = await supabase
    .from("session")
    .insert([
      {
        template_id: templateId,
        user_group_id: userGroupId,
      },
    ])
    .select("session_id");

  if (error) throw error;
  return data[0].session_id;
}

export async function participant_session_update(
  session_id: UUID,
): Promise<ParticipantSession[]> {
  const { data, error } = await supabase
    .from("participant_session")
    .select("*")
    .eq("session_id", session_id);

  if (error) throw error;

  return data ?? [];
}

export async function setIsFinished(
  userId: UUID,
  roleId: UUID,
  sessionId: UUID,
): Promise<void> {
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
