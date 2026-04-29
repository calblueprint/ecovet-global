"use client";

import type { UUID } from "@/types/schema";
import { useEffect, useState, useTransition } from "react";
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
}

export default function PrevPhaseButton({
  userId,
  roleId,
  sessionId,
  isOnOverview,
  isFirstPhase,
}: PrevButtonProps) {
  const [isLoading, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (isLoading) return;
      if (isOnOverview) return;

      if (!isFirstPhase) {
        await backPhaseForSingleUser(userId, roleId, sessionId);
      }
    });
  }

  return (
    <Clickable>
      <Button onClick={handleClick} disabled={isOnOverview || isLoading}>
        Back
      </Button>
    </Clickable>
  );
}
