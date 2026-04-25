import type {
  CommunicationMatrix,
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

function buildCommunicationMatrix(
  chatRooms: { room_id: string; user_id: string }[],
  participantUserIds: string[],
  profileByUserId: Record<string, { firstName: string; lastName: string }>,
): CommunicationMatrix {
  const n = participantUserIds.length;
  const userIdToIndex: Record<string, number> = {};
  participantUserIds.forEach((uid, idx) => {
    userIdToIndex[uid] = idx;
  });

  // Build disambiguated labels: "First" normally, "First L." when first names clash,
  // "First Last" when first + last initial still clashes
  const firstNames = participantUserIds.map(
    uid => profileByUserId[uid]?.firstName ?? "?",
  );
  const firstNameCount: Record<string, number> = {};
  for (const f of firstNames) firstNameCount[f] = (firstNameCount[f] ?? 0) + 1;

  const shortLabels = participantUserIds.map(uid => {
    const { firstName, lastName } = profileByUserId[uid] ?? {
      firstName: "?",
      lastName: "",
    };
    if (firstNameCount[firstName] <= 1) return firstName;
    const withInitial = lastName ? `${firstName} ${lastName[0]}.` : firstName;
    return withInitial;
  });

  // If short labels are still not unique, fall back to full name for those entries
  const labelCount: Record<string, number> = {};
  for (const l of shortLabels) labelCount[l] = (labelCount[l] ?? 0) + 1;

  const headers = participantUserIds.map((uid, i) => {
    if (labelCount[shortLabels[i]] <= 1) return shortLabels[i];
    const { firstName, lastName } = profileByUserId[uid] ?? {
      firstName: "?",
      lastName: "",
    };
    return lastName ? `${firstName} ${lastName}` : firstName;
  });

  const matrix: boolean[][] = Array.from({ length: n }, () =>
    Array(n).fill(false),
  );

  // Debug
  // console.log("[CommMatrix] participantUserIds:", participantUserIds);
  // console.log("[CommMatrix] userIdToIndex:", userIdToIndex);
  // console.log("[CommMatrix] raw chatRooms rows:", chatRooms);

  // Group rows by room_id, then mark all intra-room participant pairs
  const roomUsers: Record<string, string[]> = {};
  for (const row of chatRooms) {
    if (!(row.room_id in roomUsers)) roomUsers[row.room_id] = [];
    roomUsers[row.room_id].push(row.user_id);
  }

  console.log("[CommMatrix] roomUsers (grouped):", roomUsers);

  for (const [roomId, users] of Object.entries(roomUsers)) {
    const inSession = users.filter(uid => uid in userIdToIndex);
    console.log(
      `[CommMatrix] room ${roomId} — all users:`,
      users,
      "| in session:",
      inSession,
    );
    for (let i = 0; i < inSession.length; i++) {
      for (let j = 0; j < inSession.length; j++) {
        if (i !== j) {
          matrix[userIdToIndex[inSession[i]]][userIdToIndex[inSession[j]]] =
            true;
        }
      }
    }
  }

  console.log("[CommMatrix] final matrix:", matrix);
  console.log("[CommMatrix] headers:", headers);
  return { headers, matrix };
}

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
    const updatedAt =
      existingFiles[0].updated_at ?? existingFiles[0].created_at;
    const bust = updatedAt ? new Date(updatedAt).getTime() : Date.now();
    return Response.json({ url: `${urlData.publicUrl}?t=${bust}` });
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
  const profileByUserId: Record<
    string,
    { firstName: string; lastName: string }
  > = {};
  for (const p of participants) {
    const profile = p.profile as unknown as NestedProfile | null;
    const firstName = profile?.first_name ?? "";
    const lastName = profile?.last_name ?? "";
    nameByUserId[p.user_id] = `${firstName} ${lastName}`.trim() || "Unknown";
    profileByUserId[p.user_id] = { firstName, lastName };
  }

  // Communication matrix from chat_room
  const { data: chatRooms } = await supabase
    .from("chat_room")
    .select("room_id, user_id")
    .eq("session_id", sessionId);

  const communicationMatrix =
    participants.length > 1
      ? buildCommunicationMatrix(
          chatRooms ?? [],
          participants.map(p => p.user_id),
          profileByUserId,
        )
      : undefined;

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
    communicationMatrix,
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
  const profileByUserId: Record<
    string,
    { firstName: string; lastName: string }
  > = {};
  for (const p of participants) {
    const profile = p.profile as unknown as NestedProfile | null;
    const firstName = profile?.first_name ?? "";
    const lastName = profile?.last_name ?? "";
    nameByUserId[p.user_id] = `${firstName} ${lastName}`.trim() || "Unknown";
    profileByUserId[p.user_id] = { firstName, lastName };
  }

  // Communication matrix from chat_room
  const { data: chatRooms } = await supabase
    .from("chat_room")
    .select("room_id, user_id")
    .eq("session_id", sessionId);

  const communicationMatrix =
    participants.length > 1
      ? buildCommunicationMatrix(
          chatRooms ?? [],
          participants.map(p => p.user_id),
          profileByUserId,
        )
      : undefined;

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
    communicationMatrix,
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
