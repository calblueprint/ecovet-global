import supabase from "@/api/supabase/createClient";

export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: "http://localhost:3000/onboarding",
    },
  });

  if (error) {
    console.error("Error sending email:", error.message);
  }
}
/*
export async function checkInvites(email: string) {
    const {data, error} confirmed_at
    await supabase
    .from("profile")
    .select("*")
    .eq("id", user_id)
    .single();
    return 
}*/
