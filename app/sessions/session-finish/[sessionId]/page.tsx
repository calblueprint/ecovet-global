"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { checkSessionReportAccess } from "@/actions/supabase/queries/reports";
import { fetchPDFName } from "@/actions/supabase/queries/sessions";
import { LoadingScreen } from "@/app/facilitator/participants/styles";
import AccessError from "@/components/AccessError/AccessError";
import { getHomePath } from "@/utils/HomePage";
import { useProfile } from "@/utils/ProfileProvider";
import { buildSessionDisplayName } from "@/utils/session-details";
import {
  Button,
  Container,
  DownloadBox,
  DownloadButton,
  FileName,
  FileSize,
  HomeLink,
  Main,
  Section,
  TextArea,
  Title,
} from "./styles";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SessionFinish() {
  const { profile } = useProfile();

  const isParticipant = profile?.user_type == "Participant";

  const { sessionId } = useParams() as { sessionId: string };

  const [comments, setComments] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number | null>(null);
  const [pdfName, setPDFName] = useState<string | null>(null);
  const [access, setAccess] = useState<"checking" | "allowed" | "denied">(
    "checking",
  );

  async function fetchOrGenerateReport() {
    if (!sessionId) return;
    const pdfInfo = await fetchPDFName(sessionId);
    const sessions = pdfInfo.session_name
      ? pdfInfo.session_name
      : buildSessionDisplayName(pdfInfo.template_name, pdfInfo.created_at);
    setPDFName(sessions);
    setIsGenerating(true);
    setPdfUrl(null);
    setPdfSize(null);

    try {
      const res = await fetch(`/api/reports/session/${sessionId}`);

      if (res.status === 401 || res.status === 403 || res.status === 404) {
        setAccess("denied");
        return;
      }

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("Report API error:", res.status, errBody);
        throw new Error(errBody.error ?? "Failed to fetch report");
      }

      const data = await res.json();
      setPdfUrl(data.url);
      setPdfSize(data.sizeBytes ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }

  async function regenerateReportWithComments(commentsText: string | null) {
    if (!sessionId) return;
    setIsGenerating(true);
    setPdfUrl(null);
    setPdfSize(null);

    try {
      const res = await fetch(`/api/reports/session/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: commentsText }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("Report API error:", res.status, errBody);
        throw new Error(errBody.error ?? "Failed to generate report");
      }

      const data = await res.json();
      setPdfUrl(data.url);
      setPdfSize(data.sizeBytes ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }

  // Check access first, then load the existing report (or generate one).
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    checkSessionReportAccess(sessionId)
      .catch(() => "denied" as const)
      .then(result => {
        if (cancelled) return;
        setAccess(result);
        if (result === "allowed") fetchOrGenerateReport();
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function handleSave() {
    await regenerateReportWithComments(comments.trim() || null);
  }

  async function handleDownload() {
    if (!pdfUrl) return;
    const res = await fetch(pdfUrl);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${pdfName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  }

  if (access === "denied") {
    return <AccessError />;
  }

  if (access === "checking") {
    return (
      <LoadingScreen>
        <CircularProgress color="inherit" aria-label="Loading…" />
      </LoadingScreen>
    );
  }

  return (
    <Main>
      <Container>
        <Title>Exercise complete.</Title>

        {!isParticipant && (
          <>
            <Section>
              <TextArea
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="Enter your comments here..."
                disabled={isGenerating}
              />
              <Button onClick={handleSave} disabled={isGenerating}>
                {isGenerating ? "Saving..." : "Save comments to Report"}
              </Button>
            </Section>
          </>
        )}

        <Section>
          <DownloadBox
            onClick={handleDownload}
            disabled={!pdfUrl || isGenerating}
          >
            <FileName>{pdfName}.pdf</FileName>
            <FileSize>
              {isGenerating
                ? "Generating..."
                : pdfSize !== null
                  ? formatBytes(pdfSize)
                  : "—"}
            </FileSize>
          </DownloadBox>
          <DownloadButton
            onClick={handleDownload}
            disabled={!pdfUrl || isGenerating}
          >
            {isGenerating ? "Generating..." : "Download"}
          </DownloadButton>
        </Section>

        <Link
          href={getHomePath(profile)}
          style={{ width: "100%", textAlign: "center" }}
        >
          <HomeLink as="span">Return to Homepage</HomeLink>
        </Link>
      </Container>
    </Main>
  );
}
