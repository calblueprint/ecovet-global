"use client";

import type { UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  advancePhaseForSingleUser,
  setIsFinished,
} from "@/actions/supabase/queries/sessions";
import { Button } from "../styles";

interface ScenarioBackButtonProps {
  user_id: UUID;
  role_id: UUID;
  session_id: UUID;
  is_force_advance: boolean;
  phase_id: UUID;
  promptsCompleted: boolean;
  isFirstPhase: boolean;
  currentPhaseIndex: number;
  onClick: () => Promise<void>;
}

export default function ScenarioBackButton({
  user_id,
  role_id,
  session_id,
  promptsCompleted,
  isFirstPhase,
  currentPhaseIndex,
  onClick,
}: ScenarioBackButtonProps) {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setClicked(false);
  }, [currentPhaseIndex]);

  async function handleClick() {
    await onClick();
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={isFirstPhase}>
        Back
      </Button>

      {clicked && <span> waiting for others...</span>}
    </div>
  );
}
