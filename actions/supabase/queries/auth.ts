"use server";

import {
  findAuthUserByEmail,
  getSupabaseAdminClient,
  getSupabaseServerClient,
} from "@/lib/supabase/server";
import { Invite } from "@/types/schema";

export async function checkInviteStatus(email: string) {
  const supabase = await getSupabaseServerClient();
  const lowerCaseEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from("invite")
    .select("*")
    .eq("email", lowerCaseEmail)
    .eq("status", "Pending")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error checking invite:", error.message);
    return { status: "error" as const, invite: null };
  }

  if (!data) {
    return { status: "no_pending_invite" as const, invite: null };
  }

  return { status: "pending" as const, invite: data };
}

export async function markInviteAccepted(invite_id: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("invite")
    .update({ status: "Accepted" })
    .eq("invite_id", invite_id)
    .select();

  if (error) {
    console.error("Error updating invite status:", error.message);
    throw new Error("Failed to mark invite as accepted");
  }

  if (!data || data.length === 0) {
    throw new Error("No invite found with id " + invite_id);
  }

  return true;
}

export async function addInviteInfoToProfile(userId: string, invite: Invite) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from("profile").insert({
    id: userId,
    user_group_id: invite.user_group_id,
    user_type: invite.user_type,
    email: invite.email.toLowerCase(),
  });

  if (error) {
    console.error("Error creating profile:", error.message);
    throw new Error("Failed to create user profile");
  }
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = await getSupabaseServerClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/change-password`,
    });
    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: "Failed to send reset email" };
  }
}

export async function resendInvite(email: string) {
  const adminClient = getSupabaseAdminClient();
  const lowerCaseEmail = email.toLowerCase();

  const { status, invite } = await checkInviteStatus(lowerCaseEmail);
  if (status !== "pending" || !invite) {
    return { success: false, error: "No pending invite for this email" };
  }

  let existingUser;
  try {
    existingUser = await findAuthUserByEmail(lowerCaseEmail);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to look up user",
    };
  }

  if (existingUser) {
    const { data: existingProfile } = await adminClient
      .from("profile")
      .select("user_group_id")
      .eq("id", existingUser.id)
      .maybeSingle();

    if (existingProfile) {
      // never delete the login of someone who is active in another group
      if (existingProfile.user_group_id !== invite.user_group_id) {
        return {
          success: false,
          error: "User already belongs to another user group",
        };
      }
      // a profile in this group with a pending invite means sign-up failed
      // partway, so clear it out along with the login
      const { error: profileError } = await adminClient
        .from("profile")
        .delete()
        .eq("id", existingUser.id);
      if (profileError) {
        return { success: false, error: profileError.message };
      }
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      existingUser.id,
    );
    if (deleteError) {
      return { success: false, error: deleteError.message };
    }
  }

  try {
    await sendInviteEmail(lowerCaseEmail);
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send invite",
    };
  }
  return { success: true, error: null };
}

export async function sendInviteEmail(email: string) {
  const adminClient = getSupabaseAdminClient();

  const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/sign-up`,
  });

  if (error) {
    console.error("Error sending invite:", error.message);
    throw error;
  }
}

export async function checkIfUserExists(email: string): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  const lowerCaseEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("email", lowerCaseEmail)
    .limit(1);
  if (error) {
    console.error("Error checking if user exists:", error.message);
    return false;
  }

  return data !== null && data.length > 0;
}

export async function completeInvitedSignUp(password: string) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return {
      success: false,
      error: "Not authenticated. Please use the link from your invite email.",
      userId: null,
    };
  }

  const lowerCaseEmail = user.email.toLowerCase();

  const { status, invite } = await checkInviteStatus(lowerCaseEmail);
  if (status !== "pending" || !invite) {
    return {
      success: false,
      error: "No pending invitation found for this account.",
      userId: null,
    };
  }

  // Create the profile before setting the password. If this fails the user
  // has no password yet, so they can't log in without a profile and get stuck.
  try {
    await addInviteInfoToProfile(user.id, invite);
  } catch (err) {
    console.error("Error creating profile during sign-up:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to finalize sign-up",
      userId: null,
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({ password });
  if (updateError) {
    console.error("Error setting password:", updateError.message);
    return {
      success: false,
      error: updateError.message,
      userId: null,
    };
  }

  try {
    await markInviteAccepted(invite.invite_id);
    return { success: true, error: null, userId: user.id };
  } catch (err) {
    console.error("Error finalizing sign-up:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to finalize sign-up",
      userId: null,
    };
  }
}
