import supabase from "../createClient";

export async function sendPasswordResetEmail(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/change-password`,
    });
    if (error) {
      console.error("Supabase error:", error);
      alert(JSON.stringify(error, null, 2));
    } else {
      alert("Password reset email sent!");
    }
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
}
