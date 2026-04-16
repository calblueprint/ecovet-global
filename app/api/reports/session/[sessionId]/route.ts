import type {
  PhaseReportData,
  SessionReportData,
} from "@/components/pdf/SessionReport";
import { createClient } from "@supabase/supabase-js";
import { generateSessionReport } from "@/lib/pdf/generate";

// Supabase nested selects infer join cols as arrays
type NestedProfile = { first_name: string | null; last_name: string | null };
type NestedRole = { role_name: string | null };
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

  // Return cached report if it already exists in storage
  const reportFileName = `sessions/${sessionId}/report.pdf`;
  const { data: existingFiles } = await supabase.storage
    .from("reports")
    .list(`sessions/${sessionId}`, { search: "report.pdf" });

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

  // Participants — soft fail to empty array, PDF will still render template structure
  const { data: participantsRaw, error: participantsError } = await supabase
    .from("participant_session")
    .select(
      `
      user_id,
      role_id,
      is_finished,
      profile!fk_participant_profile ( first_name, last_name ),
      role ( role_name )
    `,
    )
    .eq("session_id", sessionId);

  if (participantsError) {
    console.error("Failed to fetch participants:", participantsError.message);
  }

  const participants = participantsRaw ?? [];

  // Role-phases: query by phaseIds only so all template roles are included
  // even when there are no participants
  const phaseIds = (phases ?? []).map(p => p.phase_id);

  const { data: rolePhases } = phaseIds.length
    ? await supabase
        .from("role_phase")
        .select("role_phase_id, role_id, phase_id")
        .in("phase_id", phaseIds)
    : { data: [] };

  // Derive all roleIds from role_phases (not from participants)
  const roleIds = [...new Set((rolePhases ?? []).map(rp => rp.role_id))];

  // Role name lookup from role table
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

  // All responses for this session
  const { data: responses } = await supabase
    .from("prompt_response")
    .select("user_id, prompt_id, prompt_answer")
    .eq("session_id", sessionId);

  // Build lookup indexes

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

  // responseMap[userId][promptId] = answer
  const responseMap: Record<string, Record<string, string>> = {};
  for (const r of responses ?? []) {
    if (!responseMap[r.user_id]) responseMap[r.user_id] = {};
    responseMap[r.user_id][r.prompt_id!] = r.prompt_answer ?? "";
  }

  // Participant name lookup
  const nameByUserId: Record<string, string> = {};
  for (const p of participants) {
    const profile = p.profile as unknown as NestedProfile | null;
    nameByUserId[p.user_id] =
      `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
      "Unknown";
  }

  // Assemble phase report data
  // Structure: phase → role → prompt → [participant answers]
  const phaseData: PhaseReportData[] = (phases ?? []).map(phase => {
    const roles = roleIds.map(roleId => {
      const rolePhaseId = rolePhaseIndex[roleId]?.[phase.phase_id];
      const phasePrompts = rolePhaseId
        ? (promptsByRolePhase[rolePhaseId] ?? [])
        : [];

      // Participants who have this role
      const roleParticipants = participants.filter(p => p.role_id === roleId);

      return {
        roleName: roleNameById[roleId] ?? "Unknown Role",
        prompts: phasePrompts.map(prompt => ({
          question: prompt.prompt_text ?? "",
          responses: roleParticipants.map(p => ({
            participantName: nameByUserId[p.user_id],
            answer:
              responseMap[p.user_id]?.[prompt.prompt_id] ?? "(no response)",
          })),
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

  // Build top-level report data
  const reportData: SessionReportData = {
    sessionName: session.session_name ?? "Session",
    templateName: template?.template_name ?? "",
    summary: template?.summary ?? null,
    generatedAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    participants: participants.map(p => {
      const role = p.role as unknown as NestedRole | null;
      return {
        name: nameByUserId[p.user_id],
        role: role?.role_name ?? "Unknown Role",
        isFinished: p.is_finished ?? false,
      };
    }),
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

  // Upload to Supabase Storage
  const fileName = `sessions/${sessionId}/report.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("reports")
    .upload(fileName, pdfBytes, {
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
    .getPublicUrl(fileName);

  return Response.json({ url: urlData.publicUrl });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const body = await req.json().catch(() => ({}));
  const comments: string | null = body.comments ?? null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

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

  // Participants — soft fail to empty array, PDF will still render template structure
  const { data: participantsRaw, error: participantsError } = await supabase
    .from("participant_session")
    .select(
      `
      user_id,
      role_id,
      is_finished,
      profile!fk_participant_profile ( first_name, last_name ),
      role ( role_name )
    `,
    )
    .eq("session_id", sessionId);

  if (participantsError) {
    console.error("Failed to fetch participants:", participantsError.message);
  }

  const participants = participantsRaw ?? [];

  // Role-phases: query by phaseIds only so all template roles are included
  // even when there are no participants
  const phaseIds = (phases ?? []).map(p => p.phase_id);

  const { data: rolePhases } = phaseIds.length
    ? await supabase
        .from("role_phase")
        .select("role_phase_id, role_id, phase_id")
        .in("phase_id", phaseIds)
    : { data: [] };

  // Derive all roleIds from role_phases (not from participants)
  const roleIds = [...new Set((rolePhases ?? []).map(rp => rp.role_id))];

  // Role name lookup from role table
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

  // All responses for this session
  const { data: responses } = await supabase
    .from("prompt_response")
    .select("user_id, prompt_id, prompt_answer")
    .eq("session_id", sessionId);

  const rolePhaseIndex: Record<string, Record<string, string>> = {};
  for (const rp of rolePhases ?? []) {
    if (!rolePhaseIndex[rp.role_id]) rolePhaseIndex[rp.role_id] = {};
    rolePhaseIndex[rp.role_id][rp.phase_id] = rp.role_phase_id;
  }

  const promptsByRolePhase: Record<
    string,
    { prompt_id: string; prompt_text: string | null }[]
  > = {};
  for (const p of prompts ?? []) {
    const rpId = p.role_phase_id!;
    if (!promptsByRolePhase[rpId]) promptsByRolePhase[rpId] = [];
    promptsByRolePhase[rpId].push(p);
  }

  const responseMap: Record<string, Record<string, string>> = {};
  for (const r of responses ?? []) {
    if (!responseMap[r.user_id]) responseMap[r.user_id] = {};
    responseMap[r.user_id][r.prompt_id!] = r.prompt_answer ?? "";
  }

  const nameByUserId: Record<string, string> = {};
  for (const p of participants) {
    const profile = p.profile as unknown as NestedProfile | null;
    nameByUserId[p.user_id] =
      `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
      "Unknown";
  }

  const phaseData: PhaseReportData[] = (phases ?? []).map(phase => {
    const roles = roleIds.map(roleId => {
      const rolePhaseId = rolePhaseIndex[roleId]?.[phase.phase_id];
      const phasePrompts = rolePhaseId
        ? (promptsByRolePhase[rolePhaseId] ?? [])
        : [];

      const roleParticipants = participants.filter(p => p.role_id === roleId);

      return {
        roleName: roleNameById[roleId] ?? "Unknown Role",
        prompts: phasePrompts.map(prompt => ({
          question: prompt.prompt_text ?? "",
          responses: roleParticipants.map(p => ({
            participantName: nameByUserId[p.user_id],
            answer:
              responseMap[p.user_id]?.[prompt.prompt_id] ?? "(no response)",
          })),
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
    participants: participants.map(p => {
      const role = p.role as unknown as NestedRole | null;
      return {
        name: nameByUserId[p.user_id],
        role: role?.role_name ?? "Unknown Role",
        isFinished: p.is_finished ?? false,
      };
    }),
    phases: phaseData,
    facilitatorComments: comments,
  };

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await generateSessionReport(reportData);
  } catch (err) {
    console.error("PDF generation failed:", err);
    return Response.json({ error: "PDF generation failed" }, { status: 500 });
  }

  const fileName = `sessions/${sessionId}/report.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("reports")
    .upload(fileName, pdfBytes, {
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
    .getPublicUrl(fileName);

  return Response.json({ url: urlData.publicUrl, sizeBytes: pdfBytes.length });
}
