"use client";

import { CSSProperties, useEffect, useState } from "react";
import { fetchProfileByUserId } from "@/api/supabase/queries/profile";
import { Profile } from "@/types/schema";

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const user_id = "0c50c7cf-8e27-41de-9252-e17201ea6f70";
  useEffect(() => {
    fetchProfileByUserId(user_id).then(data => {
      setProfile(data);
    });
  });

  return (
    <main style={mainStyles}>
      <p>{profile == null ? null : profile.id}</p>
    </main>
  );
}

// CSS styles

const mainStyles: CSSProperties = {
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};