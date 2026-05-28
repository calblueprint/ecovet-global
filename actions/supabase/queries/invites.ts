"use server";

import type { UUID } from "@/types/schema";
import supabase from "@/app/api/supabase/createClient";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { Invite, Profile, UserType } from "@/types/schema";
import { sendInviteEmail } from "./auth";

async function getProfileByEmail(
  email: string,
  user_group_id: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("email", email)
    .eq("user_group_id", user_group_id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function submitNewInvite(
  email: string,
  user_group_id: string,
  user_type: UserType,
) {
  const id = crypto.randomUUID();
  const profile = await getProfileByEmail(email, user_group_id);

  // Exists in the profile table
  if (profile) {
    //Is in another user group, error
    if (profile.user_group_id !== user_group_id) {
      return {
        error: true,
        message: "User already belongs to another user group",
      };
    }

    const currentType = profile.user_type;

    // Inviting a facilitator
    if (user_type === "Facilitator") {
      if (currentType === "Facilitator") {
        return { error: true, message: "User already is a facilitator" };
      }
      // Promote participant to facilitator
      if (currentType === "Participant") {
        await changeToFacilitator(profile.id);
        return {
          error: false,
          message: "User was a participant and is now a facilitator",
        };
      }
    }
    // Inviting a participant
    if (user_type === "Participant") {
      return { error: true, message: "User already in the user group" };
    }
  }
  // check if there is an existing invite
  const { data: existingInvite } = await supabase
    .from("invite")
    .select("invite_id")
    .eq("email", email)
    .eq("user_group_id", user_group_id)
    .eq("status", "Pending")
    .maybeSingle();

  if (existingInvite) {
    return {
      error: true,
      message: "An invite has already been sent to this email",
    };
  }

  // create a row in invite table
  const { error } = await supabase.from("invite").upsert(
    {
      invite_id: id,
      user_group_id,
      email,
      user_type,
      status: "Pending",
    },
    { onConflict: "invite_id" },
  );

  if (error) {
    return {
      error: true,
      message: "Error inserting new invite: " + error.message,
    };
  }
  await sendInviteEmail(email);
  return { error: false, message: "Invite sent successfully" };
}

export async function changeToFacilitator(user_id: UUID): Promise<void> {
  const { error } = await supabase
    .from("profile")
    .update({ user_type: "Facilitator" })
    .match({ id: user_id });

  if (error) {
    console.error(
      "Error updating profile user_type to Facilitator:",
      error.message,
    );
  }
}

export async function deleteInvite(invite_id: UUID): Promise<void> {
  const { error } = await supabase
    .from("invite")
    .delete()
    .eq("invite_id", invite_id);

  if (error) {
    console.error("Error deleting invite:", error.message);
  }
}

// deletes the Auth Row in Supabase - seperate from the invites and profile table
export async function deleteAuthUserByEmail(email: string): Promise<void> {
  const adminClient = getSupabaseAdminClient();
  const lowerCaseEmail = email.toLowerCase();

  const { data, error: listError } = await adminClient.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError.message);
    throw listError;
  }

  const user = data.users.find(u => u.email?.toLowerCase() === lowerCaseEmail);

  if (!user) return;

  const { error } = await adminClient.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("Error deleting auth user:", error.message);
    throw error;
  }
}

export async function fetchInvites(user_group_id: UUID) {
  try {
    const { data, error } = await supabase
      .from("invite")
      .select("*")
      .eq("user_group_id", user_group_id);

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error fetching invites from supabase API: ", error);
  }
}
