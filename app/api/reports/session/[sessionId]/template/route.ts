import type {
  PhaseReportData,
  SessionReportData,
} from "@/components/pdf/SessionReport";
import { createClient } from "@supabase/supabase-js";
import { generateSessionReport } from "@/lib/pdf/generate";

type NestedTemplate = {
  template_name: string | null;
  objective: string | null;
  summary: string | null;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Return cached template report if it already exists in storage
  const reportFileName = `sessions/${sessionId}/template.pdf`;
  const { data: existingFiles } = await supabase.storage
    .from("reports")
    .list(`sessions/${sessionId}`, { search: "template.pdf" });

  if (existingFiles && existingFiles.length > 0) {
    const { data: urlData } = supabase.storage
      .from("reports")
      .getPublicUrl(reportFileName);
    return Response.json({ url: urlData.publicUrl });
  }

  const { data: session, error: sessionError } = await supabase
    .from("session")
    .select(
      `
      session_id,
      session_name,
      template_id,
      template ( template_name, objective, summary )
    `,
    )
    .eq("session_id", sessionId)
    .single();

  if (sessionError || !session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  const template = session.template as unknown as NestedTemplate | null;

  // Phases (ordered) — soft fail to empty array
  const { data: phases, error: phasesError } = await supabase
    .from("phase")
    .select("phase_id, phase_name, phase_number, phase_description")
    .eq("template_id", session.template_id)
    .order("phase_number", { ascending: true });

  if (phasesError) {
    console.error("Failed to fetch phases:", phasesError.message);
  }

  // Role-phases: all roles for this template's phases, no participant filter
  const phaseIds = (phases ?? []).map(p => p.phase_id);

  const { data: rolePhases } = phaseIds.length
    ? await supabase
        .from("role_phase")
        .select("role_phase_id, role_id, phase_id")
        .in("phase_id", phaseIds)
    : { data: [] };

  // Derive roleIds from role_phases
  const roleIds = [...new Set((rolePhases ?? []).map(rp => rp.role_id))];

  // Role name lookup
  const { data: rolesData } = roleIds.length
    ? await supabase
        .from("role")
        .select("role_id, role_name")
        .in("role_id", roleIds)
    : { data: [] };

  const roleNameById: Record<string, string> = {};
  for (const r of rolesData ?? []) {
    roleNameById[r.role_id] = r.role_name ?? "Unknown Role";
  }

  // Prompts for all role-phases
  const rolePhaseIds = (rolePhases ?? []).map(rp => rp.role_phase_id);

  const { data: prompts } = rolePhaseIds.length
    ? await supabase
        .from("prompt")
        .select("prompt_id, prompt_text, role_phase_id")
        .in("role_phase_id", rolePhaseIds)
    : { data: [] };

  // rolePhaseIndex[roleId][phaseId] = rolePhaseId
  const rolePhaseIndex: Record<string, Record<string, string>> = {};
  for (const rp of rolePhases ?? []) {
    if (!rolePhaseIndex[rp.role_id]) rolePhaseIndex[rp.role_id] = {};
    rolePhaseIndex[rp.role_id][rp.phase_id] = rp.role_phase_id;
  }

  // promptsByRolePhase[rolePhaseId] = prompt[]
  const promptsByRolePhase: Record<
    string,
    { prompt_id: string; prompt_text: string | null }[]
  > = {};
  for (const p of prompts ?? []) {
    const rpId = p.role_phase_id!;
    if (!promptsByRolePhase[rpId]) promptsByRolePhase[rpId] = [];
    promptsByRolePhase[rpId].push(p);
  }

  // Phase data with no responses — template structure only
  const phaseData: PhaseReportData[] = (phases ?? []).map(phase => {
    const roles = roleIds.map(roleId => {
      const rolePhaseId = rolePhaseIndex[roleId]?.[phase.phase_id];
      const phasePrompts = rolePhaseId
        ? (promptsByRolePhase[rolePhaseId] ?? [])
        : [];

      return {
        roleName: roleNameById[roleId] ?? "Unknown Role",
        prompts: phasePrompts.map(prompt => ({
          question: prompt.prompt_text ?? "",
          responses: [],
        })),
      };
    });

    return {
      phaseName: phase.phase_name ?? `Phase ${phase.phase_number}`,
      phaseNumber: phase.phase_number,
      phaseDescription: phase.phase_description ?? null,
      roles,
    };
  });

  const reportData: SessionReportData = {
    sessionName: session.session_name ?? "Session",
    templateName: template?.template_name ?? "",
    summary: template?.summary ?? null,
    generatedAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    participants: [],
    phases: phaseData,
  };

  // Generate PDF
  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await generateSessionReport(reportData);
  } catch (err) {
    console.error("PDF generation failed:", err);
    return Response.json({ error: "PDF generation failed" }, { status: 500 });
  }

  const { error: uploadError } = await supabase.storage
    .from("reports")
    .upload(reportFileName, pdfBytes, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload failed:", uploadError.message);
    return Response.json(
      { error: "Storage upload failed", details: uploadError.message },
      { status: 500 },
    );
  }

  const { data: urlData } = supabase.storage
    .from("reports")
    .getPublicUrl(reportFileName);

  return Response.json({ url: urlData.publicUrl, sizeBytes: pdfBytes.length });
}
