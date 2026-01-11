"use client";

import { CSSProperties } from "react";
import Link from "next/link";
import { H2 } from "@/styles/text";

export default function FacilitatorFlows() {
  return (
    <main style={mainStyles}>
      <Link href="/test-page">
        <button>← Back</button>
      </Link>{" "}
      <H2>Facilitator Flows</H2>
      <Link href="/facilitator/template-list">
        <button>View All Templates</button>
      </Link>
      <Link href="/templates">
        <button>Add New Template</button>
      </Link>
      <Link href="/invites/add-participants">
        <button>Add a New Participant</button>
      </Link>
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
  gap: "1rem",
};
