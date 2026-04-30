"use client";

import type { Phase, RolePhase, Template } from "@/types/schema";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ContentBody,
  ContentBody40,
  ContentBubble,
  ContentDiv,
  ContentHeader,
  ContinueButton,
  ContinueButtonDiv,
  LoadingScreen,
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
}

export default function ScenarioLeftPanel({
  templateInfo,
  phases,
  phaseInd,
  rolePhase,
  onContinue,
}: ScenarioLeftPanelProps) {
  const isOverview = phaseInd === -1;
  const currentPhase = phases[phaseInd] ?? null;

  return (
    <ContentDiv>
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
          {templateInfo ? (
            templateInfo.summary
          ) : (
            <LoadingScreen>
              <CircularProgress color="inherit" aria-label="Loading…" />
            </LoadingScreen>
          )}
        </ContentBody>
      </ContentBubble>

      <ContentBubble>
        <ContentHeader>Setting</ContentHeader>
        <ContentBody>
          {templateInfo ? (
            templateInfo.setting
          ) : (
            <CircularProgress color="inherit" aria-label="Loading…" />
          )}
        </ContentBody>
      </ContentBubble>

      {isOverview && (
        <ContinueButtonDiv>
          <ContinueButton onClick={onContinue} disabled={phases.length === 0}>
            Continue
          </ContinueButton>
        </ContinueButtonDiv>
      )}
    </ContentDiv>
  );
}
