"use client";

import { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { H2 } from "@/styles/text";
import { useProfile } from "@/utils/ProfileProvider";

export default function AddFacilitators() {
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <main style={mainStyles}>
      <div>User group: {profile?.user_group_id}</div>
      <div>User type: {profile?.user_type}</div>

      <H2>Testing</H2>
      <button onClick={() => router.replace("/admin/home-screen")}>
        Admin Flow
      </button>
      <button onClick={() => router.replace("/facilitator/template-list")}>
        Facilitator Flow
      </button>
      <button onClick={() => router.replace("/participants/session-start")}>
        Participant Flow
      </button>
      <button onClick={() => router.replace("/edit-profile")}>
        Edit Profile
      </button>
    </main>
  );
}

const mainStyles: CSSProperties = {
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
};
