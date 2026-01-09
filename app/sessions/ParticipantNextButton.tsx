"use client";

import { useState } from "react";
import { UUID } from "crypto";
import { setIsFinished } from "@/api/supabase/queries/sessions";

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
    setClicked(true);

    try {
      await setIsFinished(user_id, role_id, session_id);
    } catch (err) {
      console.error(err);
      setClicked(false);
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={clicked}>
        I&#39;m Finished
      </button>

      {clicked && <span> waiting for others...</span>}
    </div>
  );
}
