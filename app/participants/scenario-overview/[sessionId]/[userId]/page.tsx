"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProfileByUserId } from "@/actions/supabase/queries/profile";
import {
  fetchPhases,
  fetchPrompts,
  fetchRolePhases,
  fetchTemplateId,
} from "@/actions/supabase/queries/sessions";
import { fetchTemplate } from "@/actions/supabase/queries/templates";
import { Phase, Profile, Prompt, Template, UUID } from "@/types/schema";
import {
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
  PhaseHeader,
} from "./styles";

export default function ScenarioOverview() {
  const { sessionId, userId } = useParams();

  const [templateInfo, setTemplateInfo] = useState<Template | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [phaseInd, setPhaseInd] = useState(-1);

  const [roleId, setRoleId] = useState<string>("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const loadData = useCallback(async () => {
    if (!sessionId) return;
    console.log(sessionId);
    const templateId = await fetchTemplateId(sessionId as UUID);
    const template = await fetchTemplate(
      templateId.template_id as unknown as UUID,
    );
    setTemplateInfo(template);
    console.log(templateId);
    setPhases(await fetchPhases(sessionId as UUID));
    const fetchedProfile = await fetchProfileByUserId(userId as UUID);
    if (!fetchedProfile) return;
    setRoleId(fetchedProfile.role_id ?? "");
  }, [sessionId, userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function nextPhase() {
    if (phaseInd + 1 >= phases.length) return;
    const nextInd = phaseInd + 1;
    setPhaseInd(nextInd);
    const rp = await fetchRolePhases(roleId, phases[nextInd].phase_id);
    setPrompts(await fetchPrompts(rp?.role_id as UUID));
  }

  return (
    <Main>
      <ContentDiv>
        <PhaseDescriptionWrapper $phase={phaseInd > -1}>
          <ContentBody40>
            {phaseInd + 1} of {phases.length}
          </ContentBody40>
          <PhaseHeader>Phase {phaseInd + 1}</PhaseHeader>
          <ContentBubble>
            <ContentHeader>Context</ContentHeader>
            <ContentBody>
              {phases.length > 0 && phaseInd >= 0
                ? phases[phaseInd].phase_description
                : "no phase"}
            </ContentBody>
          </ContentBubble>
        </PhaseDescriptionWrapper>
        <OverviewHeader $phase={phaseInd == -1}>
          Scenario Overview
        </OverviewHeader>
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
            disabled={phases.length === 0 || phaseInd >= phases.length - 1}
          >
            Continue
          </ContinueButton>
        </ContinueButtonDiv>
      </ContentDiv>
      <ContentDiv>
        <ContentBubble>
          <ContentHeader>Placeholder Styling</ContentHeader>

          {prompts.map((prompt, index) => (
            <ContentBody key={prompt.prompt_id ?? index}>
              {prompt.prompt_text}
            </ContentBody>
          ))}
        </ContentBubble>
      </ContentDiv>
    </Main>
  );
}
