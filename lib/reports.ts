import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Server-only helpers for the PDF report routes.
// assigns signed urls for signed in users

export const REPORTS_BUCKET = "reports";
const REPORT_URL_SECONDS = 60 * 60; // can only use for 1 hour

export type ReportViewer = {
  id: string;
  userType: string;
  userGroupId: string | null;
};

// The logged-in user making the request, or null if not logged in.
export async function getReportViewer(): Promise<ReportViewer | null> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profile")
    .select("user_type, user_group_id")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  return {
    id: user.id,
    userType: profile.user_type,
    userGroupId: profile.user_group_id,
  };
}

export function isStaffForGroup(
  viewer: ReportViewer,
  userGroupId: string | null,
): boolean {
  if (viewer.userType === "Admin") return true;
  return (
    viewer.userType === "Facilitator" &&
    userGroupId != null &&
    viewer.userGroupId === userGroupId
  );
}

export async function canViewSessionReport(
  admin: SupabaseClient,
  viewer: ReportViewer,
  sessionId: string,
  sessionUserGroupId: string | null,
): Promise<boolean> {
  if (viewer.userType === "Admin") return true;
  if (sessionUserGroupId != null && viewer.userGroupId === sessionUserGroupId) {
    return true;
  }

  const { data } = await admin
    .from("participant_session")
    .select("user_id")
    .eq("session_id", sessionId)
    .eq("user_id", viewer.id)
    .limit(1);
  return (data?.length ?? 0) > 0;
}

export function accessDenied(viewer: ReportViewer | null): Response {
  return viewer
    ? Response.json({ error: "Not allowed" }, { status: 403 })
    : Response.json({ error: "Not logged in" }, { status: 401 });
}

// Each call returns a new URL (new token)
export async function signedReportUrl(
  admin: SupabaseClient,
  path: string,
): Promise<string | null> {
  const { data, error } = await admin.storage
    .from(REPORTS_BUCKET)
    .createSignedUrl(path, REPORT_URL_SECONDS);
  if (error || !data) {
    console.error("Failed to sign report URL:", error);
    return null;
  }
  return data.signedUrl;
}
