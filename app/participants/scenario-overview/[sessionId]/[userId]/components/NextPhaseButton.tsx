"use client";

import type { UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  advancePhaseForSingleUser,
  setIsFinished,
} from "@/actions/supabase/queries/sessions";
import { Button } from "@/app/participants/styles";

interface NextButtonProps {
  userId: UUID;
  roleId: UUID;
  sessionId: UUID;
  isForceAdvance: boolean;
  phaseId: UUID;
  promptsCompleted: boolean;
  isLastPhase: boolean;
  currentPhaseIndex: number;
  onClick: () => Promise<void>;
}

export default function NextPhaseButton({
  userId,
  roleId,
  sessionId,
  isForceAdvance,
  promptsCompleted,
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
    await onClick();

    if (isLastPhase) {
      await setIsFinished(userId, roleId, sessionId);
      router.push("/sessions/session-finish");
      return;
    }

    if (isForceAdvance) {
      setClicked(true);

      try {
        await setIsFinished(userId, roleId, sessionId);
      } catch (err) {
        console.error(err);
        setClicked(false);
      }
    } else {
      await advancePhaseForSingleUser(userId, roleId, sessionId);
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
