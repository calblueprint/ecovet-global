import supabase from "../createClient";

export async function fetchUserGroups() {
  try {
    // Pull data
    const { data, error } = await supabase.from("user_group").select("*");

    if (error) throw error;

    // Process data
    if (data) {
      const mapped = data.map(usergrp => ({
        id: usergrp.user_group_id,
        user_group_name: usergrp.user_group_name,
      }));

      return mapped;
    }
  } catch (error) {
    console.log("Error fetching orgs data from supabase API: ", error);
  }
}
