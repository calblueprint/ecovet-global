import { UUID } from "crypto";
import supabase from "@/api/supabase/createClient";
import { Invite, UserType } from "@/types/schema";

export async function submitNewInvite(
  email: string,
  user_group_id: string,
  user_type: UserType,
) {
  const id = crypto.randomUUID();
  if (user_type == "Facilitator") {
    if (await validateFacilitatorInvite(email, user_group_id)) {
      return { error: true, message: "User already is a facilitator" };
    }
  } else {
    if (await validateInvite(email, user_group_id)) {
      return { error: true, message: "User already in the user group" };
    }
  }

  const { error } = await supabase.from("invite").upsert(
    {
      invite_id: id,
      user_group_id: user_group_id,
      email: email,
      user_type: user_type,
      status: "Pending",
    },
    { onConflict: "invite_id" },
  );

  if (error) {
    return {
      error: true,
      message: "Error inserting new facilitator:" + error.message,
    };
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
    console.error("Error fetching invite by invite_id:", error.message);
  }
  const invite_data: Invite = data as Invite;
  if (invite_data.status == "Accepted") {
    console.error("Invite has already been accepted.");
  }
  var { error } = await supabase
    .from("invite")
    .update({ status: "Cancelled" })
    .match({ invite_id: invite_id });

  if (error) {
    console.error("Error updating invite status to cancelled:", error.message);
  }
}

export async function checkFacilitatorInInvite(
  email: string,
  user_group_id: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("invite")
    .select("*")
    .eq("email", email)
    .eq("user_group_id", user_group_id)
    .eq("user_type", "Facilitator");
  if (error) {
    console.error("Error fetching invite by email:", error.message);
    return false;
  }
  if (data != null) {
    return true;
  }
  return false;
}

export async function checkUserInProfile(
  email: string,
  user_group_id: string,
  check_facilitator: boolean,
): Promise<boolean> {
  var { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email);
  if (error) {
    console.error("Error fetching user_id from auth:", error.message);
  }

  const user_id: UUID = data as unknown as UUID;

  if (check_facilitator) {
    var { data, error } = await supabase
      .from("profile")
      .select("user_group_id" as "id")
      .eq("id", user_id)
      .eq("user_type", "Facilitator");
  } else {
    var { data, error } = await supabase
      .from("profile")
      .select("user_group_id" as "id")
      .eq("id", user_id);
  }

  if (error) {
    console.error("Error fetching user_group_id from profile:", error.message);
  }

  const fetched_user_group_id: UUID = data as unknown as UUID;

  if (user_group_id != fetched_user_group_id) {
    return true;
  }

  return false;
}

/* in progress*/
export async function validateFacilitatorInvite(
  email: string,
  user_group_id: string,
): Promise<boolean> {
  // check if facilitator is in invite
  if (await checkFacilitatorInInvite(email, user_group_id)) {
    return true;
  }

  // check if facilitator is in profiles
  if (await checkUserInProfile(email, user_group_id, true)) {
    return true;
  }
  return false;
}
/* in progress*/
export async function validateInvite(
  email: string,
  user_group_id: string,
): Promise<boolean> {
  if (await checkUserInProfile(email, user_group_id, false)) {
    return true;
  }
  return false;
}

export async function changeToParticipant(user_id: UUID): Promise<void> {
  const { error } = await supabase
    .from("profile")
    .update({ user_type: "Participant" })
    .match({ id: user_id });

  if (error) {
    console.error(
      "Error updating profile user_type to Participant:",
      error.message,
    );
  }
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
