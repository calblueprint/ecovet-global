"use client";

import { useState } from "react";
import { UUID } from "crypto";
import { setIsFinished } from "@/api/supabase/queries/sessions";
import { NextButtonStyled } from "./styles";

interface NextButtonProps {
  user_id: UUID;
  role_id: UUID;
  session_id: UUID;
}

export default function NextButton({
  user_id,
  role_id,
  session_id,
}: NextButtonProps) {
  const [clicked, setClicked] = useState(false);

  async function handleClick() {
    console.log("trying");

    const finished = await setIsFinished(user_id, role_id, session_id);

    if (!finished) {
      console.log("Could not mark session as finished");

      // Optionally revert button state
      setClicked(false);
      return;
    }

    setClicked(true);
  }

  return (
    <div>
      <NextButtonStyled onClick={handleClick} disabled={clicked}>
        I&#39;m Finished
      </NextButtonStyled>

      {clicked && <span> waiting for others...</span>}
    </div>
  );
}
