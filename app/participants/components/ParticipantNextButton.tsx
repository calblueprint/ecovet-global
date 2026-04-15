"use client";

import type { UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setIsFinished } from "@/actions/supabase/queries/sessions";
import { Button } from "../styles";

interface NextButtonProps {
  user_id: UUID;
  role_id: UUID;
  session_id: UUID;
  phase_id: UUID;
  isLastPhase: boolean;
  currentPhaseIndex: number;
  onClick: () => void;
}

export default function NextButton({
  user_id,
  role_id,
  session_id,
  isLastPhase,
  currentPhaseIndex,
  onClick,
}: NextButtonProps) {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setClicked(false);
  }, [currentPhaseIndex]);

  async function handleClick() {
    setClicked(true);

    try {
      if (onClick) {
        await onClick();
      }
      await setIsFinished(user_id, role_id, session_id);
      if (isLastPhase) {
        // console.log("sessionId ", session_id);
        router.push(`/sessions/session-finish/${session_id}`);
      }
    } catch (err) {
      console.error(err);
      setClicked(false);
    }
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={clicked}>
        {isLastPhase ? "Finish Game" : "Next"}
      </Button>

      {clicked && <span> waiting for others...</span>}
    </div>
  );
}
