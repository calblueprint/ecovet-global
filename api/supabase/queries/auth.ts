import { UUID } from "crypto";
import supabase from "@/api/supabase/createClient";
import { Invite } from "@/types/schema";

export async function signInWithMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "http://localhost:3000/auth/login",
    },
  });

  if (error) {
    console.error("Error sending email:", error.message);
  }
}

/* returns True if there is an unaccepted invite */
export async function checkInvites(invite_id: UUID) {
  const { data, error } = await supabase
    .from("invite")
    .select("*")
    .eq("invite_id", invite_id)
    .single();
  if (error) {
    console.error("Error fetching invite from invite_id:", error.message);
  }
  if (!data) return false;
  const invite_data: Invite = data as Invite;
  if (invite_data.status == "Pending") {
    return true;
  }
  return false;
}
