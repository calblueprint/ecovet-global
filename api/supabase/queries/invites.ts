import { UUID } from "crypto";
import supabase from "../createClient";

export async function fetchInvites(user_group_id: UUID) {
  try {
    // Pull data
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
