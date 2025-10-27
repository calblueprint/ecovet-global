import supabase from "../createClient";

export async function fetchUserGroups() {
  try {
    // Pull data
    const { data, error } = await supabase.from("user_group").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error fetching orgs data from supabase API: ", error);
  }
}
