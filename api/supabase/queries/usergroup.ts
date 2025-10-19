import supabase from "@/api/supabase/createClient";

export async function submitNewUserGroup(user_group: string) {
  const id = crypto.randomUUID();
  const { data, error } = await supabase
    .from("user_group")
    .upsert(
      { user_group_id: id, user_group_name: user_group },
      { onConflict: "user_group_id", ignoreDuplicates: true },
    );

  if (error) {
    console.error("Error inserting new user group:", error.message);
  }
  return id;
}
