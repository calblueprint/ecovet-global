"use server";

import type { UUID } from "@/types/schema";
import {
  getSupabaseAdminClient,
  getSupabaseServerClient,
} from "@/lib/supabase/server";
import { deleteAuthUserByEmail } from "./invites";

export async function fetchUserGroups() {
  try {
    // Pull data
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.from("user_group").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error fetching orgs data from supabase API: ", error);
  }
}

export async function fetchUserGroupMembers(user_group_id: UUID) {
  try {
    // Pull data
    const supabase = await getSupabaseServerClient();
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
  const supabase = await getSupabaseServerClient();
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

export async function deleteUserGroup(user_group: UUID): Promise<void> {
  const supabase = await getSupabaseServerClient();

  // Collect everyone tied to the group before deleting it, so their logins
  // don't outlive their profiles (a leftover login blocks future invites)
  const [{ data: members }, { data: invites }] = await Promise.all([
    supabase.from("profile").select("email").eq("user_group_id", user_group),
    supabase.from("invite").select("email").eq("user_group_id", user_group),
  ]);
  const emails = new Set(
    [...(members ?? []), ...(invites ?? [])]
      .map(row => row.email?.toLowerCase())
      .filter((email): email is string => !!email),
  );

  const { error: inviteError } = await supabase
    .from("invite")
    .delete()
    .eq("user_group_id", user_group);
  if (inviteError) {
    console.error("Error deleting user_group invites:", inviteError.message);
    throw inviteError;
  }
  const { error } = await supabase
    .from("user_group")
    .delete()
    .eq("user_group_id", user_group);
  if (error) {
    console.error("Error deleting user_group:", error.message);
    throw error;
  }

  // Only remove logins that no longer have a profile anywhere
  const adminClient = getSupabaseAdminClient();
  for (const email of emails) {
    const { data: remaining } = await adminClient
      .from("profile")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    if (!remaining) await deleteAuthUserByEmail(email);

  if (error) {
    console.error("Error deleting user_group:", error.message);
  }
}
