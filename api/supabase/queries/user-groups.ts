import { UUID } from "crypto";
import supabase from "../createClient";

export async function fetchUserGroups() {
  try {
    // Pull data
    const { data, error } = await supabase.from("user_group").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error fetching orgs data from supabase API: ", error);
  }
}

export async function fetchUserGroupById(user_group_id: UUID) {
  try {
    // Pull data
    const { data, error } = await supabase
      .from("user_group")
      .select("*")
      .eq("user_group_id", user_group_id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error fetching orgs data from supabase API: ", error);
  }
}

export async function fetchUserGroupMembers(user_group_id: UUID) {
  try {
    // Pull data
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_group_id", user_group_id);

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error fetching orgs data from supabase API: ", error);
  }
}

export async function submitNewUserGroup(user_group: string) {
  const id = crypto.randomUUID();
  const { error } = await supabase
    .from("user_group")
    .upsert(
      { user_group_id: id, user_group_name: user_group },
      { onConflict: "user_group_id", ignoreDuplicates: true },
    );

  if (error) {
    console.error("Error inserting new user group:", error.message);
  }
  return id;
}

export async function fetchUserGroupSessions(user_group_id: UUID) {
  const { data, error } = await supabase
    .from("session")
    .select(
      "session_id, template_id, usergroup_id, session_name, is_async, after_action_report_id, is_finished",
    )
    .eq("user_group_id", user_group_id);

  if (error) {
    console.error("Error fetching sessions for user group:", error.message);
    return [];
  }

  return data;
}
