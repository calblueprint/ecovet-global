import { UUID } from "crypto";
import supabase from "@/api/supabase/createClient";
import { Invite, Profile, UserType } from "@/types/schema";

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
  //no profile for the user
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

  return { error: false, message: "Invite sent successfully" };
}

/* updates a pending invite status to cancelled given an invite_id */
export async function cancelInvite(invite_id: UUID): Promise<void> {
  const { data, error } = await supabase
    .from("invite")
    .select("*")
    .eq("invite_id", invite_id)
    .single();
  if (error) {
    console.error("Error fetching invite by invite_id:", error.message);
    return;
  }
  const invite_data: Invite = data as Invite;
  if (invite_data.status == "Accepted") {
    console.error("Invite has already been accepted.");
    return;
  }
  const { error: updateError } = await supabase
    .from("invite")
    .update({ status: "Cancelled" })
    .match({ invite_id: invite_id });

  if (updateError) {
    console.error(
      "Error updating invite status to cancelled:",
      updateError.message,
    );
    return;
  }
}

//Returns true if user is a facilitator in the user group given their email
export async function isFacilitatorInUserGroup(
  email: string,
  user_group_id: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profile")
    .select("user_type")
    .eq("email", email)
    .eq("user_group_id", user_group_id)
    .maybeSingle();

  if (error) {
    console.error("Profile lookup failed:", error.message);
    return false;
  }

  return data?.user_type === "Facilitator";
}

//Returns true if user is in the user group given their email
export async function isInUserGroup(
  email: string,
  user_group_id: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profile")
    .select("email")
    .eq("email", email)
    .eq("user_group_id", user_group_id)
    .maybeSingle();

  if (error) {
    console.error("Profile lookup error:", error.message);
    return false;
  }

  return !!data;
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
