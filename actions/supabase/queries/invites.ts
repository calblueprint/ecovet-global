"use server";

import type { UUID } from "@/types/schema";
import supabase from "@/app/api/supabase/createClient";
import {
  findAuthUserByEmail,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import { UserType } from "@/types/schema";
import { sendInviteEmail } from "./auth";

export async function submitNewInvite(
  rawEmail: string,
  user_group_id: string,
  user_type: UserType,
) {
  // every lookup lowercases the email, so store it that way too
  const email = rawEmail.trim().toLowerCase();
  const id = crypto.randomUUID();
  // admin client so RLS doesn't hide rows from other user groups
  const adminClient = getSupabaseAdminClient();

  const { data: profile } = await adminClient
    .from("profile")
    .select("*")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  // Exists in the profile table
  if (profile) {
    //Is in another user group, error
    if (profile.user_group_id !== user_group_id) {
      return {
        error: true,
        message: "User already belongs to another user group",
      };
    }

    // Promote participant to facilitator
    if (user_type === "Facilitator" && profile.user_type === "Participant") {
      await changeToFacilitator(profile.id);
      return {
        error: false,
        message: "User was a participant and is now a facilitator",
      };
    }

    if (profile.user_type === "Facilitator") {
      return { error: true, message: "User already is a facilitator" };
    }
    return { error: true, message: "User already in the user group" };
  }

  // only one pending invite per email, across all user groups
  const { data: existingInvite } = await adminClient
    .from("invite")
    .select("user_group_id")
    .eq("email", email)
    .eq("status", "Pending")
    .limit(1)
    .maybeSingle();

  if (existingInvite) {
    return {
      error: true,
      message:
        existingInvite.user_group_id === user_group_id
          ? "An invite has already been sent to this email"
          : "User already has a pending invite to another user group",
    };
  }

  // An auth user with no profile is a leftover login (e.g. their profile was
  // deleted). It would make inviteUserByEmail fail, so remove it first.
  await deleteAuthUserByEmail(email);

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
  try {
    await sendInviteEmail(email);
  } catch (err) {
    // don't leave a pending invite behind for an email that was never sent
    await deleteInvite(id as UUID);
    return {
      error: true,
      message:
        "Error sending invite email: " +
        (err instanceof Error ? err.message : String(err)),
    };
  }
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
  const user = await findAuthUserByEmail(email);
  if (!user) return;

  const { error } = await getSupabaseAdminClient().auth.admin.deleteUser(
    user.id,
  );
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
