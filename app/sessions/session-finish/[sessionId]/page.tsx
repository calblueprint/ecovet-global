"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useProfile } from "@/utils/ProfileProvider";
import { Button, Main } from "../../styles";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { useParams } from "next/navigation";

const Title = styled.h1`
  font-family: ${Sans.style.fontFamily};
  font-size: 1.75rem;
  font-weight: 700;
  color: ${COLORS.black100};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const SubHeader = styled.h2`
  font-family: ${Sans.style.fontFamily};
  font-size: 1rem;
  font-weight: 500;
  color: ${COLORS.black70};
  margin-bottom: 0.75rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 20rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${COLORS.black20};
  border-radius: 0.25rem;
  padding: 0.75rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 0.875rem;
  resize: vertical;
  outline: none;
  &:focus {
    border-color: ${COLORS.darkElectricBlue};
  }
`;

const DownloadBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid ${COLORS.black20};
  border-radius: 0.25rem;
  background: ${COLORS.oat_light};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  width: 100%;
  &:hover:not(:disabled) {
    background: ${COLORS.oat_medium};
  }
`;

const FileName = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.black100};
`;

const FileSize = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  color: ${COLORS.black40};
`;

const Divider = styled.div`
  height: 1px;
  background: ${COLORS.black20};
  width: 20rem;
  margin: 0.5rem 0;
`;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SessionFinish() {
  const { profile } = useProfile();
  const isFacilitator = profile?.user_type === "Facilitator";

  const { sessionId } = useParams() as { sessionId: string };

  const [comments, setComments] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number | null>(null);

  async function generateReport(commentsText: string | null) {
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

  // Auto-generate PDF on page load
  useEffect(() => {
    generateReport(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function handleSave() {
    await generateReport(comments.trim() || null);
  }

  function handleDownload() {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Exercise X.pdf";
    link.click();
  }

  return (
    <Main>
      <Title>Exercise complete.</Title>

      {isFacilitator && (
        <>
          <Divider />
          <Section>
            <SubHeader>Add reflections and comments</SubHeader>
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

      <Divider />

      <Section>
        <DownloadBox onClick={handleDownload} disabled={!pdfUrl || isGenerating}>
          <FileName>Exercise X.pdf</FileName>
          <FileSize>
            {isGenerating ? "Generating..." : pdfSize !== null ? formatBytes(pdfSize) : "—"}
          </FileSize>
        </DownloadBox>
      </Section>

      <Divider />

      <Link href="/facilitator/template-list">
        <Button>Return to Homepage</Button>
      </Link>
    </Main>
  );
}
