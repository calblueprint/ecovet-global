"use client";

import type { Phase, Role, RolePhase, Template } from "@/types/schema";
import CircularProgress from "@mui/material/CircularProgress";
import LinkedText from "@/components/Linki/Linkify";
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
import { LoadingScreen } from "./styles";

interface ScenarioLeftPanelProps {
  templateInfo: Template | null;
  phases: Phase[];
  phaseInd: number;
  rolePhase: RolePhase | null;
  onContinue: () => void;
  isOverview: boolean;
  role: Role | null;
  isRoleLoading: boolean;
  isLoading: boolean;
}

export default function ScenarioLeftPanel({
  templateInfo,
  phases,
  phaseInd,
  rolePhase,
  onContinue,
  isOverview,
  role,
  isRoleLoading = false,
  isLoading = false,
}: ScenarioLeftPanelProps) {
  const currentPhase = phases[phaseInd] ?? null;

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
            {currentPhase ? (
              <LinkedText text={currentPhase.phase_description} />
            ) : (
              "No description"
            )}
          </ContentBody>
        </ContentBubble>

        {rolePhase?.role_phase_description && (
          <ContentBubble>
            <ContentHeader>Your Role</ContentHeader>
            <ContentBody>
              <LinkedText text={rolePhase.role_phase_description} />
            </ContentBody>
          </ContentBubble>
        )}
      </PhaseDescriptionWrapper>

      <OverviewHeader $phase={isOverview}>Scenario Overview</OverviewHeader>
      {isLoading ? (
        <LoadingScreen>
          <CircularProgress color="inherit" aria-label="Loading…" />
        </LoadingScreen>
      ) : (
        <>
          <ContentBubble>
            <ContentHeader>Summary</ContentHeader>
            <ContentBody>
              {templateInfo ? (
                <LinkedText text={templateInfo.summary} />
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
                <LinkedText text={templateInfo.setting} />
              ) : (
                <CircularProgress color="inherit" aria-label="Loading…" />
              )}
            </ContentBody>
          </ContentBubble>

          <ContentBubble>
            <ContentHeader>Your Role</ContentHeader>
            {isRoleLoading ? (
              <LoadingScreen>
                <CircularProgress color="inherit" aria-label="Loading…" />
              </LoadingScreen>
            ) : (
              <>
                <ContentBody>
                  <LinkedText text={role?.role_name ?? null} />
                </ContentBody>
                <ContentBody>
                  <LinkedText text={role?.role_description ?? null} />
                </ContentBody>
              </>
            )}
          </ContentBubble>
        </>
      )}

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
