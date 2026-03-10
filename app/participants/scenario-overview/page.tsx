"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UUID } from "crypto";
import { fetchPhases, fetchTemplateId } from "@/api/supabase/queries/sessions";
import { fetchTemplate } from "@/api/supabase/queries/templates";
import { Phase, Template } from "@/types/schema";
import {
  ButtonText,
  ContentBody,
  ContentBody40,
  ContentBubble,
  ContentDiv,
  ContentHeader,
  ContinueButton,
  ContinueButtonDiv,
  Main,
  OverviewHeader,
  PhaseDescriptionWrapper,
} from "./styles";

export default function ScenarioOverview() {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [templateInfo, setTemplateInfo] = useState<Template | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [phaseInd, setPhaseInd] = useState(-1);

  const loadData = useCallback(async () => {
    if (!sessionId) return;
    const templateId = await fetchTemplateId(sessionId as UUID);
    const template = await fetchTemplate(templateId as unknown as UUID);
    setTemplateInfo(template);
    setPhases(await fetchPhases(sessionId));
  }, [sessionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function nextPhase() {
    if (phaseInd >= phases.length) return;
    setPhaseInd(phaseInd + 1);
  }

  return (
    <Main>
      <ContentDiv>
        <PhaseDescriptionWrapper phase={phaseInd > -1}>
          <ContentBody40>
            {phaseInd + 1} of {phases.length}
          </ContentBody40>
          <OverviewHeader>Phase {phaseInd + 1}</OverviewHeader>
          <ContentBubble>
            <ContentHeader>Context</ContentHeader>
            <ContentBody>
              {phases.length > 0
                ? phases[phaseInd].phase_description
                : "no phase"}
            </ContentBody>
          </ContentBubble>
        </PhaseDescriptionWrapper>
        <OverviewHeader>Scenario Overview</OverviewHeader>
        <ContentBubble>
          <ContentHeader>Summary</ContentHeader>
          <ContentBody>
            {templateInfo ? templateInfo.summary : "no summary"}
          </ContentBody>
        </ContentBubble>
        <ContentBubble>
          <ContentHeader>Setting</ContentHeader>
          <ContentBody>
            {templateInfo ? templateInfo.setting : "no setting"}
          </ContentBody>
        </ContentBubble>
        <ContinueButtonDiv>
          <ContinueButton
            onClick={nextPhase}
            disabled={phaseInd >= phases.length}
          >
            <ButtonText>Continue</ButtonText>
          </ContinueButton>
        </ContinueButtonDiv>
      </ContentDiv>
      <ContentDiv>/* TBD */</ContentDiv>
    </Main>
  );
}
