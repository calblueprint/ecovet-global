"use client";

import { useEffect, useState } from "react";
import { fetchProfileByUserId } from "@/actions/supabase/queries/profile";
import { sendEmailReminder } from "@/actions/supabase/send-email";
import { useProfile } from "@/utils/ProfileProvider";

export default function SendEmailButton() {
  const { profile } = useProfile();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!profile?.id) return;
    fetchProfileByUserId(profile.id).then(p => {
      if (p?.email) setEmail(p.email);
    });
  }, [profile?.id]);

  const sendEmail = async () => {
    if (!email) {
      setMessage("No email found for this user");
      return;
    }
    setMessage(await sendEmailReminder(email));
  };

  return (
    <div>
      <button onClick={sendEmail}>send email reminder</button>
      <p>{message}</p>
    </div>
  );
}
