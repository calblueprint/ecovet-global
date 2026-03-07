"use client";

import type { Template, UUID } from "@/types/schema";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchTemplate } from "@/actions/supabase/queries/templates";
import { Button, Container, Heading2, Heading3, Main } from "../styles";

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
      <Container>
        <Link
          href="/facilitator/template-list"
          style={{ textDecoration: "none" }}
        >
          <Heading3>← Back</Heading3>
        </Link>
        {templateInfo && (
          <div>
            <Heading2>{templateInfo.template_name}</Heading2>
            <div>Summary: {templateInfo.summary}</div>
            <div>Setting: {templateInfo.setting}</div>
          </div>
        )}
        <Button onClick={handleStartGame}>Start session</Button>
      </Container>
    </Main>
  );
}
