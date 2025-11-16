"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Profile, UserType } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";

export default function AddFacilitators() {
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <main>
      <p>I am a {profile?.user_type}</p>
      <button onClick={() => router.replace("/admin/home-screen")}>
        Admin Flow
      </button>
      <button onClick={() => router.replace("/facilitator")}>
        Facilitator Flow
      </button>
      <button onClick={() => router.replace("/edit-profile")}>
        Edit Profile
      </button>
    </main>
  );
}
