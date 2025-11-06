import supabase from "@/api/supabase/createClient";
import { Invite, UserType } from "@/types/schema";
import { UUID } from "crypto";

export async function submitNewFacilitator(
  email: string,
  user_group_id: string,
  isFacilitator: boolean,
): Promise<void> {
  const id = crypto.randomUUID();
  const { error } = await supabase.from("invite").upsert(
    {
      invite_id: id,
      user_group_id: user_group_id,
      email: email,
      user_type: isFacilitator ? "Facilitator" : "",
      status: "Pending",
    },
    { onConflict: "invite_id" },
  );

  if (error) {
    console.error("Error inserting new facilitator:", error.message);
  }
}

/* updates a pending invite status to cancelled given an invite_id */
export async function cancelInvite(invite_id: UUID): Promise<void> {
  var { data, error } = await supabase
    .from("invite")
    .select("*")
    .eq("id", invite_id)
    .single();
  if (error) {
    console.error("Error fetching invite by invite_id:", error);
    return;
  }
  const invite_data: Invite = data as Invite;
  if (invite_data.status == "Accepted") {
    console.error("Invite has already been accepted.");
    return;
  }
  var { error } = await supabase
  .from("invite")
  .update({ status: "Cancelled" })
  .match({ invite_id:  invite_id})

  if (error) {
    console.error("Error updating invite status to cancelled:", error);
    return;
  }
  return;
}

export async function validateFacilitatorInvite(email: string): Promise<boolean> {
  var { data, error } = await supabase
    .from("invite")
    .select("user_type")
    .eq("email", email)
    .single();
  const user_type: UserType = data as unknown as UserType;
  if (error) {
    console.error("Error fetching invite by email:", error);
    return false;
  }
  if (user_type == "Facilitator") {
    return true;
  }
  return false;
}

export async function validateInvite(email: string): Promise<boolean> {
  return true;
}
Function to check if an invited participant is already in the organization called validateInvite():
 Given an email, check in the profiles table invitee is in the user-group. Return True if so.
  If this function returns True, edit add-participant.tsx to prevent them from adding this person, and display an error message on screen ('User already in this user group').

export async function changeToParticipant(user_id: UUID): Promise<void> {
  const { error } = await supabase
  .from("profile")
  .update({ user_type: "Participant" })
  .match({ id:  user_id})

  if (error) {
    console.error("Error updating profile user_type to Participant:", error);
  }
}

export async function changeToFacilitator(user_id: UUID): Promise<void> {
  const { error } = await supabase
  .from("profile")
  .update({ user_type: "Facilitator" })
  .match({ id:  user_id})

  if (error) {
    console.error("Error updating profile user_type to Facilitator:", error);
  }
}

