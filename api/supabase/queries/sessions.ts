import supabase from "@/actions/supabase/client";

export async function fetchRoles(templateId: string) {
  const { data, error } = await supabase
    .from("role")
    .select("role_name")
    .eq("template_id", templateId);
  if (error) throw error;
  return data ? data.map(r => String(r.role_name)) : [];
}

export async function fetchParticipants(userGroupId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("first_name, last_name")
    .eq("user_group_id", userGroupId);
  if (error) throw error;
  return data ? data.map(p => String(p.first_name + " " + p.last_name)) : [];
}
