import { UUID } from "crypto";
import supabase from "@/api/supabase/createClient";

export async function fetchProfileByUserId(user_id: UUID) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user_id)
    .single();
  if (error) {
    console.error("Error fetching profile by user_id:", error);
    return null;
  }

  return data;
}

export async function fetchExpandedProfileByUserId(user_id: UUID) {
  const profile = await fetchProfileByUserId(user_id);
  if (profile == null) {
    return null;
  }

  const expandedProfile = {
    id: profile.id,
    user_group_schema: fetchUserGroupById(profile.user_group_id),
    phase_schema: fetchPhaseById(profile.phase_id),
    role_schema: fetchRoleById(profile.role_id),
    user_type: profile.user_type,
    is_finished: profile.is_finished,
    first_name: profile.last_name,
    last_name: profile.last_name,
    country: profile.country,
    org_role: profile.org_role,
  };

  return expandedProfile;
}

export async function fetchUserGroupById(user_group_id: UUID) {
  const { data, error } = await supabase
    .from("user_group")
    .select("*")
    .eq("user_group_id", user_group_id)
    .single();
  if (error) {
    console.error("Error fetching user group by user_group_id:", error);
    return null;
  }

  return data;
}

export async function fetchPhaseById(phase_id: UUID) {
  const { data, error } = await supabase
    .from("phase")
    .select("*")
    .eq("phase_id", phase_id)
    .single();
  if (error) {
    console.error("Error fetching phase by phase_id:", error);
    return null;
  }

  return data;
}

export async function fetchRoleById(role_id: UUID) {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("role_id", role_id)
    .single();
  if (error) {
    console.error("Error fetching role by role_id:", error);
    return null;
  }

  return data;
}
