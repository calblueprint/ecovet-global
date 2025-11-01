import supabase from "../client";

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
