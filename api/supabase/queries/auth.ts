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
      emailRedirectTo: "http://localhost:3000/auth/signup",
    },
  });

  if (error) {
    console.error("Error sending email:", error.message);
  }
}

/* returns True if there is an unaccepted invite given an email*/
export async function checkInvites(email: string) {
  const { data, error } = await supabase
    .from("invite")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) {
    console.error("Error fetching invite from email:", error.message);
  }
  if (!data) return false;
  const invite_data: Invite = data as Invite;
  if (invite_data.status == "Pending") {
    return true;
  }
  return false;
}
