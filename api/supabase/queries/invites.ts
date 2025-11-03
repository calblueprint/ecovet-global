import supabase from "@/api/supabase/createClient";

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
