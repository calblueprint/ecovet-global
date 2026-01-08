"use client";

import React from "react";
import Link from "next/link";
import { Button, Main } from "../styles";

export default function SessionFinish() {
  return (
    <Main>
      <h1>Finished with Session</h1>
      <Link href="/facilitator/template-list">
        <Button>Return to Homepage</Button>
      </Link>
    </Main>
  );
}
