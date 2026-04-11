"use client";

import type { UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  advancePhaseForSingleUser,
  backPhaseForSingleUser,
  setIsFinished,
} from "@/actions/supabase/queries/sessions";
import { Button } from "@/app/participants/styles";
import { Clickable } from "../styles";

interface PrevButtonProps {
  userId: UUID;
  roleId: UUID;
  sessionId: UUID;
  isOnOverview: boolean;
  isFirstPhase: boolean;
  onClick: () => Promise<void>;
}

export default function PrevPhaseButton({
  userId,
  roleId,
  sessionId,
  isOnOverview,
  isFirstPhase,
  onClick,
}: PrevButtonProps) {
  async function handleClick() {
    if (isOnOverview) return;
    await onClick();

    if (!isFirstPhase) {
      await backPhaseForSingleUser(userId, roleId, sessionId);
    }
  }

  return (
    <Clickable>
      <Button onClick={handleClick} disabled={isOnOverview}>
        Back
      </Button>
    </Clickable>
  );
}
