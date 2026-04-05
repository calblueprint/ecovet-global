import type { SessionReportData } from "@/components/pdf/SessionReport";
import { renderToBuffer } from "@react-pdf/renderer";
import { SessionSummaryReport } from "@/components/pdf/SessionReport";

/**
 * Renders the full session summary report to a PDF buffer.
 */
export async function generateSessionReport(
  data: SessionReportData,
): Promise<Uint8Array> {
  const buffer = await renderToBuffer(<SessionSummaryReport {...data} />);
  return new Uint8Array(buffer);
}
