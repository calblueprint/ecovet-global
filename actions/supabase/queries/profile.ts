"use server";

import type { UUID } from "@/types/schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function getProfileById(uid: string) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("profile")
    .select("*")
    .eq("id", uid)
    .single();

  return (
    data ?? {
      id: uid,
      first_name: null,
      email: null,
      user_type: null,
      user_group_id: null,
      last_name: null,
      country: null,
      org_role: null,
    }
  );
}

export async function getProfilesByEmails(emails: string[]) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .in("email", emails);
  if (error) {
    console.error("Error fetching profiles by emails:", error);
    return [];
  }
  return data;
}

export async function fetchProfileByUserId(user_id: UUID) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user_id)
    .single();
  if (error) {
    console.error("Error fetching profile by user_id: ", error);
    return null;
  }

  return data;
}

export async function fetchEmailByUserId(user_id: UUID) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profile")
    .select("email")
    .eq("id", user_id)
    .single();
  if (error) {
    console.error("Error fetching profile by user_id: ", error);
    return null;
  }

  return data;
}

export async function fetchUserGroupById(user_group_id: UUID) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_group")
    .select("*")
    .eq("user_group_id", user_group_id)
    .single();
  if (error) {
    console.error("Error fetching user group by user_group_id:", error.message);
    return null;
  }

  return data;
}

export async function fetchSessionById(userId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("participant_session")
    .select("session_id, session:session_id!inner(is_finished)")
    .eq("user_id", userId)
    .eq("session.is_finished", false)
    .order("created_at", { ascending: false });
  //order by most recent session added
  if (error) {
    console.error("Error fetching active session for user:", error.message);
    return null;
  }

  return data[0]?.session_id ?? null;
}

export async function handleProfileSubmit(profile: {
  id: string;
  first_name: string;
  last_name: string;
  country: string;
  org_role: string;
}) {
  const supabase = await getSupabaseServerClient();
  try {
    const { error } = await supabase
      .from("profile")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        country: profile.country,
        org_role: profile.org_role,
      })
      .eq("id", profile.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// returns True is the Profile does NOT exist, and False if it does
export async function checkProfileExists(id: string) {
  const supabase = await getSupabaseServerClient();
  try {
    const { error } = await supabase
      .from("profile")
      .select("id")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return true;
      }
      console.error("Error in checking for profile:", error.message);
      return true;
    }

    return false;
  } catch (err) {
    console.error("Error in checkProfileExists:", err);
    return true;
  }
}

export async function fetchRoleBySessionId(sessionId: UUID, userId: UUID) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("participant_session")
    .select("role_id, role(role_name)")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .single();
  if (error) {
    console.error("Error fetching role:", error.message);
    return null;
  }

  const role = Array.isArray(data.role) ? data.role[0] : data.role;
  return {
    role_id: data.role_id,
    role_name: (role as { role_name: string })?.role_name ?? null,
  };
}

export async function deleteProfile(user_id: UUID): Promise<void> {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("profile").delete().eq("id", user_id);

  if (error) {
    console.error("Error deleting profile:", error.message);
  }
}
