import supabase from "@/api/supabase/createClient";

export async function fetchAllTemplates() {
  try {
    // Pull data
    const { data, error } = await supabase.from("template").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.log("Error fetching templates from supabase API: ", error);
  }
}
