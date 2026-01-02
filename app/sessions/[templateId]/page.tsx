"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { UUID } from "crypto";
import { fetchTemplate } from "@/api/supabase/queries/templates";
import { Template } from "@/types/schema";
import { Button, Container, Heading2, Main } from "../styles";

export default function Sessions() {
  const { templateId } = useParams<{ templateId: string }>();
  const [templateInfo, setTemplateInfo] = useState<Template | null>(null);
  const router = useRouter();

  const loadData = useCallback(async () => {
    if (!templateId) return;

    const template = await fetchTemplate(templateId as UUID);
    setTemplateInfo(template);
  }, [templateId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartGame = () => {
    router.push(`./role-selection?templateId=${templateId}`);
  };

  return (
    <Main>
      <Link href="/facilitator/template-list">Back</Link>
      {templateInfo && (
        <div>
          <Heading2>{templateInfo.template_name}</Heading2>
          <div>{templateInfo.summary}</div>
          <div>{templateInfo.setting}</div>
        </div>
      )}
      <Container>
        <Button onClick={handleStartGame}>Start game</Button>
      </Container>
    </Main>
  );
}
