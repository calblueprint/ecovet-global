"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useProfile } from "@/utils/ProfileProvider";
import { Main } from "../../styles";
import { Button, Container, DownloadBox, DownloadButton, FileName, FileSize, HomeLink, Section, TextArea, Title } from "./styles"
import { useParams } from "next/navigation";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SessionFinish() {
  const { profile } = useProfile();
  
  // const isFacilitator = profile?.user_type === "Facilitator";
  const isFacilitator = true;

  const { sessionId } = useParams() as { sessionId: string };

  const [comments, setComments] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number | null>(null);

  async function fetchOrGenerateReport() {
    if (!sessionId) return;
    setIsGenerating(true);
    setPdfUrl(null);
    setPdfSize(null);

    try {
      const res = await fetch(`/api/reports/session/${sessionId}`);

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
      // Append cache-buster so the CDN doesn't serve the previous version
      setPdfUrl(`${data.url}?t=${Date.now()}`);
      setPdfSize(data.sizeBytes ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }

  // Load existing report on page load, generate if none exists
  useEffect(() => {
    fetchOrGenerateReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    link.download = "Exercise X.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  }

  return (
    <Main>
      <Container>
      <Title>Exercise complete.</Title>

      {isFacilitator && (
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
        <DownloadBox onClick={handleDownload} disabled={!pdfUrl || isGenerating}>
          <FileName>Exercise X.pdf</FileName>
          <FileSize>
            {isGenerating ? "Generating..." : pdfSize !== null ? formatBytes(pdfSize) : "—"}
          </FileSize>
        </DownloadBox>
        <DownloadButton onClick={handleDownload} disabled={!pdfUrl || isGenerating}>
          {isGenerating ? "Generating..." : "Download"}
        </DownloadButton>
      </Section>

      <Link href="/facilitator/template-list" style={{ width: "100%", textAlign: "center" }}>
        <HomeLink as="span">Return to Homepage</HomeLink>
      </Link>
      </Container>
    </Main>
  );
}
