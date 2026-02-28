import supabase from "@/api/supabase/createClient";
import { Invite } from "@/types/schema";

export async function sendPasswordResetEmail(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/change-password`,
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
  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true,
      // emailRedirectTo: `${window.location.origin}/auth/signup`,
      emailRedirectTo: "https://ecovet-global.vercel.app/auth/signup",
    },
  });

  if (error) {
    console.error("Error sending email:", error.message);
  }
}

export async function checkIfUserExists(email: string): Promise<boolean> {
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

  return data !== null;
}

/* returns True if there is an unaccepted invite given an email*/
export async function checkInvites(email: string) {
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
