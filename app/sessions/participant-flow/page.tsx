import { useEffect, useState } from "react";
import { randomUUID, UUID } from "crypto";
import {
  fetchPhases,
  fetchPrompts,
  fetchRolePhases,
} from "@/api/supabase/queries/sessions";
import { Phase, RolePhase } from "@/types/schema";
import {
  NextButton,
  ParticipantFlowMain,
  PhaseHeading,
  PromptText,
  RolePhaseDescription,
} from "./style";

export default function ParticipantFlow() {
  // const templateId = randomUUID();
  const roleId = randomUUID();
  const sessionId = randomUUID();
  const [phaseNumber, setPhaseNumber] = useState<number>(0);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [rolePhase, setRolePhase] = useState<RolePhase>({
    role_phase_id: randomUUID(),
    phase_id: randomUUID(),
    role_id: randomUUID(),
    description: "",
  });
  const [prompts, setPrompts] = useState<string[]>([]);
  const [phaseId, setPhaseId] = useState<UUID>(randomUUID());

  async function updatePhase() {
    setPhaseNumber(phaseNumber + 1);
    setPhaseId(phases[phaseNumber].phase_id);
    setRolePhase(await fetchRolePhases(roleId, phaseId));
    setPrompts(await fetchPrompts(rolePhase.role_phase_id));
  }

  useEffect(() => {
    async () => {
      setPhases(await fetchPhases(sessionId));
      updatePhase();
    };
  }, [sessionId]);

  return (
    <ParticipantFlowMain>
      <PhaseHeading>Phase {phaseNumber}</PhaseHeading>
      <RolePhaseDescription>
        role phase description: {rolePhase.description}
      </RolePhaseDescription>
      {prompts.map(prompt => (
        <PromptText>{prompt}</PromptText>
      ))}
      <NextButton onClick={updatePhase}>Next</NextButton>
    </ParticipantFlowMain>
  );
}
