"use client";

import { CSSProperties } from "react";
import Link from "next/link";
import { H2 } from "@/styles/text";

export default function FacilitatorFlows() {
  return (
    <main style={mainStyles}>
      <H2>Facilitator Flows</H2>
      <Link href="/templates/template-list">
        <button>View All Templates</button>
      </Link>
      <Link href="/templates">
        <button>Add New Template</button>
      </Link>
      <button>Add a New Participant (not merged)</button>
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

const imageStyles: CSSProperties = {
  width: "80px",
  height: "80px",
  marginBottom: "0.5rem",
};
