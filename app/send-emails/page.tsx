"use client";

import { useEffect, useState } from "react";
import { fetchProfileByUserId } from "@/actions/supabase/queries/profile";
import { sendEmailReminder } from "@/actions/supabase/send-email";
import { Profile } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";

export default function SendEmailButton() {
  const { profile } = useProfile();
  const [message, setMessage] = useState<string>("");
  // const [email, setEmail] = useState<string>("");
  const email = "monique.mc@berkeley.edu";
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  const sendEmail = async () => {
    if (!email) {
      setMessage("No email found for this user");
      return;
    }
    setMessage(await sendEmailReminder(email));
  };

  useEffect(() => {
    if (!profile?.id) return;

    async function fetchEmail(user_id: string) {
      setUserProfile(await fetchProfileByUserId(user_id));
      if (!userProfile) return;
      if (!userProfile.email) return;
      //setEmail(userProfile.email);
    }

    fetchEmail(profile.id);
  }, [profile?.id, profile]);

  return (
    <div>
      <button onClick={sendEmail}>send email reminder</button>
      <p>{message}</p>
    </div>
  );
}
