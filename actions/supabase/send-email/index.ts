"use server";

import supabase from "../client";

export async function sendEmailReminder(email: string) {
  const { data, error } = await supabase.functions.invoke(
    "send-email-reminder",
    {
      body: {
        to: email,
        subject: "Reminder to re-join game",
        message: "Reminder to join the game again!",
      },
    },
  );

  if (error) {
    return `Error: ${error.message}`;
  }
  return "Successfully sent email reminder";
}
