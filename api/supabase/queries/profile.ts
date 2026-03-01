import { UUID } from "crypto";
import supabase from "@/api/supabase/createClient";

async function getInviteByEmail(email: string) {
  const lowerCaseEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from("invite")
    .select("user_group_id, user_type")
    .eq("email", lowerCaseEmail)
    .single();

  if (error) {
    console.error("Error fetching invite: ", error.message);
    throw new Error("Failed to fetch invite");
  }

  if (!data) {
    throw new Error(`No invite found for email ${email}`);
  }

  return data;
}

export async function addInviteInfoToProfile(userId: string, email: string) {
  const lowerCaseEmail = email.toLowerCase();
  const invite = await getInviteByEmail(lowerCaseEmail);

  const { error } = await supabase.from("profile").insert({
    id: userId,
    user_group_id: invite.user_group_id,
    user_type: invite.user_type,
    email: lowerCaseEmail,
  });

  if (error) {
    console.error("Error creating profile: ", error.message);
    throw new Error("Failed to create user profile");
  }
}
export async function markInviteAccepted(email: string) {
  const lowerCaseEmail = email.toLowerCase();

  const { data, error } = await supabase
    .from("invite")
    .update({ status: "Accepted" })
    .eq("email", lowerCaseEmail)
    .select();

  if (error) {
    console.error("Error updating invite status: ", error.message);
    throw new Error("Failed to mark invite as accepted");
  }

  if (!data) {
    throw new Error("No invite found for email " + email);
  }

  return true;
}

export async function makeAdmin(userId: string, email: string) {
  const lowerCaseEmail = email.toLowerCase();

  const { error } = await supabase.from("profile").upsert({
    id: userId,
    user_type: "Admin",
    email: lowerCaseEmail,
    user_group_id: "0b73ed2d-61c3-472e-b361-edaa88f27622",
  });

  if (error) {
    console.error("Error creating profile: ", error.message);
    throw new Error("Failed to make profile an Admin");
  }
}

export async function fetchProfileByUserId(user_id: UUID) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user_id)
    .single();
  if (error) {
    console.error("Error fetching profile by user_id: ", error);
    return null;
  }

  return data;
}

export async function fetchExpandedProfileByUserId(user_id: UUID) {
  const profile = await fetchProfileByUserId(user_id);
  if (profile == null) {
    return null;
  }

  const expandedProfile = {
    id: profile.id,
    user_group_schema: await fetchUserGroupById(profile.user_group_id),
    phase_schema: await fetchPhaseById(profile.phase_id),
    role_schema: await fetchRoleById(profile.role_id),
    user_type: profile.user_type,
    is_finished: profile.is_finished,
    first_name: profile.first_name,
    last_name: profile.last_name,
    country: profile.country,
    org_role: profile.org_role,
  };

  return expandedProfile;
}

export async function fetchUserGroupById(user_group_id: UUID) {
  const { data, error } = await supabase
    .from("user_group")
    .select("*")
    .eq("user_group_id", user_group_id)
    .single();
  if (error) {
    console.error("Error fetching user group by user_group_id:", error.message);
    return null;
  }

  return data;
}

export async function fetchPhaseById(phase_id: UUID) {
  const { data, error } = await supabase
    .from("phase")
    .select("*")
    .eq("phase_id", phase_id)
    .single();
  if (error) {
    console.error("Error fetching phase by phase_id:", error.message);
    return null;
  }

  return data;
}

export async function fetchRoleById(role_id: UUID) {
  const { data, error } = await supabase
    .from("role")
    .select("*")
    .eq("role_id", role_id)
    .single();
  if (error) {
    console.error("Error fetching role by role_id:", error.message);
    return null;
  }

  return data;
}

export async function fetchSessionById(userId: string) {
  const { data, error } = await supabase
    .from("participant_session")
    .select("session_id, session:session_id!inner(is_finished)")
    .eq("user_id", userId)
    .eq("session.is_finished", false)
    .order("created_at", { ascending: false });
  console.log(data);
  //order by most recent session added
  if (error) {
    console.error("Error fetching active session for user:", error.message);
    return null;
  }

  return data[0]?.session_id ?? null;
}

export async function handleProfileSubmit(profile: {
  id: string;
  first_name: string;
  last_name: string;
  country: string;
  org_role: string;
}) {
  try {
    const { error } = await supabase.from("profile").upsert(profile);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// returns True is the Profile does NOT exist, and False if it does
export async function checkProfileExists(id: string) {
  try {
    const { error } = await supabase
      .from("profile")
      .select("id")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return true;
      }
      console.error("Error in checking for profile:", error.message);
      return true;
    }

    return false;
  } catch (err) {
    console.error("Error in checkProfileExists:", err);
    return true;
  }
}
