"use client";

import { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { H2 } from "@/styles/text";

export default function AddFacilitators() {
  const router = useRouter();

  return (
    <main style={mainStyles}>
      <H2>Testing</H2>
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

const mainStyles: CSSProperties = {
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
};
