"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UUID } from "crypto";
import { setIsFinished } from "@/api/supabase/queries/sessions";

interface NextButtonProps {
  user_id: UUID;
  role_id: UUID;
  session_id: UUID;
  isLastPhase: boolean;
  currentPhaseIndex: number;
}

export default function NextButton({
  user_id,
  role_id,
  session_id,
  isLastPhase,
  currentPhaseIndex,
}: NextButtonProps) {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setClicked(false);
  }, [currentPhaseIndex]);

  async function handleClick() {
    setClicked(true);

    try {
      await setIsFinished(user_id, role_id, session_id);
      if (isLastPhase) {
        router.push("/sessions/session-finish");
      }
    } catch (err) {
      console.error(err);
      setClicked(false);
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={clicked}>
        {isLastPhase ? "Finish Game" : "Next"}
      </button>

      {clicked && <span> waiting for others...</span>}
    </div>
  );
}
