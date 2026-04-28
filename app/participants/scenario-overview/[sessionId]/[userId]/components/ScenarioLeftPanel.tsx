"use client";

import type { Phase, RolePhase, Template, UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import { fetchRoleName } from "@/actions/supabase/queries/sessions";
import {
  ContentBody,
  ContentBody40,
  ContentBubble,
  ContentDiv,
  ContentHeader,
  ContinueButton,
  ContinueButtonDiv,
  OverviewHeader,
  PhaseDescriptionWrapper,
  PhaseHeader,
} from "../styles";

interface ScenarioLeftPanelProps {
  templateInfo: Template | null;
  phases: Phase[];
  phaseInd: number;
  rolePhase: RolePhase | null;
  onContinue: () => void;
  isOverview: boolean;
  roleId: UUID;
}

export default function ScenarioLeftPanel({
  templateInfo,
  phases,
  phaseInd,
  rolePhase,
  onContinue,
  isOverview,
  roleId,
}: ScenarioLeftPanelProps) {
  const currentPhase = phases[phaseInd] ?? null;
  const [roleDescription, setRoleDescription] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);

  useEffect(() => {
    if (!roleId) return;

    async function loadRoleName() {
      try {
        const name = await fetchRoleName(roleId);
        setRoleDescription(name.role_description);
        setRoleName(name.role_name);
      } catch (err) {
        console.error("Failed to load role name:", err);
      }
    }

    loadRoleName();
  }, [roleId]);

  return (
    <ContentDiv $isOverview={isOverview}>
      <PhaseDescriptionWrapper $phase={!isOverview}>
        <ContentBody40>
          {phaseInd + 1} of {phases.length}
        </ContentBody40>
        <PhaseHeader>Phase {phaseInd + 1}</PhaseHeader>

        <ContentBubble>
          <ContentHeader>Context</ContentHeader>
          <ContentBody>
            {currentPhase ? currentPhase.phase_description : "No description"}
          </ContentBody>
        </ContentBubble>

        {rolePhase?.role_phase_description && (
          <ContentBubble>
            <ContentHeader>Your Role</ContentHeader>
            <ContentBody>{rolePhase.role_phase_description}</ContentBody>
          </ContentBubble>
        )}
      </PhaseDescriptionWrapper>

      <OverviewHeader $phase={isOverview}>Scenario Overview</OverviewHeader>

      <ContentBubble>
        <ContentHeader>Summary</ContentHeader>
        <ContentBody>
          {templateInfo ? templateInfo.summary : "Loading..."}
        </ContentBody>
      </ContentBubble>

      <ContentBubble>
        <ContentHeader>Setting</ContentHeader>
        <ContentBody>
          {templateInfo ? templateInfo.setting : "Loading..."}
        </ContentBody>
      </ContentBubble>

      <ContentBubble>
        <ContentHeader>Your Role</ContentHeader>
        <ContentBody>{roleName}</ContentBody>
        <ContentBody>{roleDescription}</ContentBody>
      </ContentBubble>

      {isOverview && (
        <ContinueButtonDiv>
          <ContinueButton onClick={onContinue} disabled={phases.length === 0}>
            Continue to Phase 1
          </ContinueButton>
        </ContinueButtonDiv>
      )}
    </ContentDiv>
  );
}
