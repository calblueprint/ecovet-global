"use server";

import { canViewSessionReport, getReportViewer } from "@/lib/reports";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

// Same rule the session report API enforces, without generating the PDF,
// so pages can show an access error right away.
export async function checkSessionReportAccess(
  sessionId: string,
): Promise<"allowed" | "denied"> {
  const admin = getSupabaseAdminClient();
  const { data: session } = await admin
    .from("session")
    .select("user_group_id")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (!session) return "denied";

  const viewer = await getReportViewer();
  if (!viewer) return "denied";

  const allowed = await canViewSessionReport(
    admin,
    viewer,
    sessionId,
    session.user_group_id,
  );
  return allowed ? "allowed" : "denied";
}
