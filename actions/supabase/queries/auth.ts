"use server";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Invite } from "@/types/schema";

export async function checkInviteStatus(email: string) {
  const supabase = await getSupabaseServerClient();
  const lowerCaseEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from("invite")
    .select("*")
    .eq("email", lowerCaseEmail)
    .eq("status", "Pending")
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

export async function markInviteAccepted(email: string) {
  const supabase = await getSupabaseServerClient();
  const lowerCaseEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from("invite")
    .update({ status: "Accepted" })
    .eq("email", lowerCaseEmail)
    .select();

  if (error) {
    console.error("Error updating invite status:", error.message);
    throw new Error("Failed to mark invite as accepted");
  }

  if (!data || data.length === 0) {
    throw new Error("No invite found for email " + email);
  }

  return true;
}

export async function addInviteInfoToProfile(userId: string, email: string) {
  const supabase = await getSupabaseServerClient();
  const lowerCaseEmail = email.toLowerCase();

  const { data: invite, error: inviteError } = await supabase
    .from("invite")
    .select("user_group_id, user_type")
    .eq("email", lowerCaseEmail)
    .limit(1)
    .single();

  if (inviteError || !invite) {
    console.error("HI");
    console.error("Error fetching invite:", inviteError?.message);
    throw new Error("Failed to find invite for profile creation");
  }

  const { error } = await supabase.from("profile").insert({
    id: userId,
    user_group_id: invite.user_group_id,
    user_type: invite.user_type,
    email: lowerCaseEmail,
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
      return { success: false, error };
    }
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
}

export async function signInWithMagicLink(email: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "implicit",
      },
    },
  );

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/sign-up`,
    },
  });

  if (error) {
    console.error("Error sending email:", error.message);
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

/* returns True if there is an unaccepted invite given an email*/
export async function checkInvites(email: string) {
  const supabase = await getSupabaseServerClient();
  const lowerCaseEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from("invite")
    .select("*")
    .eq("email", lowerCaseEmail)
    .maybeSingle();

  if (error) {
    console.error("Error fetching invite from email:", error.message);
    return "error";
  }

  if (!data) {
    return "no_invite";
  }

  const invite_data: Invite = data as Invite;

  switch (invite_data.status) {
    case "Pending":
      return "pending";
    case "Accepted":
      return "accepted";
    case "Cancelled":
      return "cancelled";
    default:
      return "unknown_status";
  }
}
