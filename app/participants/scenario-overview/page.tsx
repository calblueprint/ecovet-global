"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UUID } from "crypto";
import { fetchTemplateId } from "@/api/supabase/queries/sessions";
import { fetchTemplate } from "@/api/supabase/queries/templates";
import { Template } from "@/types/schema";
import {
  ButtonText,
  ContentBody,
  ContentBubble,
  ContentDiv,
  ContentHeader,
  ContinueButton,
  ContinueButtonDiv,
  Main,
  OverviewHeader,
} from "./styles";

//fetchTemplateId(session_id: string)

export default function ScenarioOverview() {
  const { sessionId } = useParams<{ sessionId: string }>();

  //const [templateId, setTemplateId] = useState< UUID | null>(null);
  const [templateInfo, setTemplateInfo] = useState<Template | null>(null);
  //const router = useRouter();

  const loadData = useCallback(async () => {
    if (!sessionId) return;
    let templateId = await fetchTemplateId(sessionId as UUID);
    const template = await fetchTemplate(templateId as unknown as UUID);
    setTemplateInfo(template);
  }, [sessionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Main>
      <ContentDiv>
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
          <ContinueButton>
            <ButtonText>Continue</ButtonText>
          </ContinueButton>
        </ContinueButtonDiv>
      </ContentDiv>
    </Main>
  );
}
