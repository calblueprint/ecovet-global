import supabase from "@/actions/supabase/client";

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
