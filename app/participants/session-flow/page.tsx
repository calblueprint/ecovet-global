"use client";

import { useEffect, useState } from "react";
import { UUID } from "crypto";
import {
  fetchPhases,
  fetchPrompts,
  fetchRolePhases,
} from "@/api/supabase/queries/sessions";
import { Phase, Prompt, RolePhase } from "@/types/schema";

const DUMMY_SESSION_ID = "4ef640db-0d1c-4ca1-b9a5-99950d5b2ebe";
const DUMMY_ROLE_ID = "6d921a5a-f0c8-44b9-9ad9-cef9fcf7d0a8";

export default function ParticipantFlowPage() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  const [rolePhase, setRolePhase] = useState<RolePhase | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const currentPhase = phases[currentPhaseIndex];

  // Fetch all phases once
  useEffect(() => {
    async function loadPhases() {
      const data = await fetchPhases(DUMMY_SESSION_ID);
      setPhases(data);
      console.log("hello", phases);
    }
    loadPhases();
  });

  // Fetch rolePhase + prompts when phase changes
  useEffect(() => {
    if (!currentPhase) return;

    async function loadPhaseContent() {
      const rp = await fetchRolePhases(
        DUMMY_ROLE_ID as UUID,
        currentPhase.phase_id,
      );

      setRolePhase(rp);

      if (rp) {
        const p = await fetchPrompts(rp.role_phase_id);
        setPrompts(p);
      } else {
        setPrompts([]);
      }
    }

    loadPhaseContent();
  }, [currentPhase]);

  function handleNext() {
    setCurrentPhaseIndex(prev => prev + 1);
  }

  if (!currentPhase) {
    return <div>Loading phases...</div>;
  }

  return (
    <div>
      <h1>Phase {currentPhaseIndex + 1}</h1>

      {rolePhase && <p>{rolePhase.description}</p>}

      <ul>
        {prompts.map(prompt => (
          <li key={prompt.prompt_id}>{prompt.prompt_text}</li>
        ))}
      </ul>

      {currentPhaseIndex < phases.length - 1 && (
        <button onClick={handleNext}>Next</button>
      )}

      {currentPhaseIndex === phases.length - 1 && <div>End of phases</div>}
    </div>
  );
}
