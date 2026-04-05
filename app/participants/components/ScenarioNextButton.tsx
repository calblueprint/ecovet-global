"use client";

import type { UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  advancePhaseForSingleUser,
  setIsFinished,
} from "@/actions/supabase/queries/sessions";
import { Button } from "../styles";

interface ScenarioNextButtonProps {
  user_id: UUID;
  role_id: UUID;
  session_id: UUID;
  is_force_advance: boolean;
  phase_id: UUID;
  promptsCompleted: boolean;
  isLastPhase: boolean;
  currentPhaseIndex: number;
  onClick: () => Promise<void>;
}

export default function ScenarioNextButton({
  user_id,
  role_id,
  session_id,
  is_force_advance,
  promptsCompleted,
  isLastPhase,
  currentPhaseIndex,
  onClick,
}: ScenarioNextButtonProps) {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setClicked(false);
  }, [currentPhaseIndex]);

  async function handleClick() {
    await onClick();

    if (isLastPhase) {
      await setIsFinished(user_id, role_id, session_id);
      router.push("/sessions/session-finish");
      return;
    }

    if (is_force_advance) {
      setClicked(true);

      try {
        await setIsFinished(user_id, role_id, session_id);
      } catch (err) {
        console.error(err);
        setClicked(false);
      }
    } else {
      await advancePhaseForSingleUser(user_id, role_id, session_id);
    }
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={!promptsCompleted || clicked}>
        {isLastPhase ? "Finish Game" : "Next"}
      </Button>

      {clicked && <span> waiting for others...</span>}
    </div>
  );
}
