import type {
  ChatLogEntry,
  CommunicationMatrix,
  PhaseReportData,
  SessionReportData,
} from "@/components/pdf/SessionReport";
import { createClient } from "@supabase/supabase-js";
import { generateSessionReport } from "@/lib/pdf/generate";
import { buildSessionDisplayName } from "@/utils/session-details";

// Supabase nested selects infer join cols as arrays
type NestedProfile = { first_name: string | null; last_name: string | null };
type NestedRole = { role_name: string | null };
type NestedTemplate = {
  template_name: string | null;
  objective: string | null;
  summary: string | null;
};

// Builds disambiguated display labels shared by the matrix and chat log.
function buildUserIdToLabel(
  participantUserIds: string[],
  profileByUserId: Record<string, { firstName: string; lastName: string }>,
): { labels: string[]; userIdToLabel: Record<string, string> } {
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
    return lastName ? `${firstName} ${lastName[0]}.` : firstName;
  });

  const labelCount: Record<string, number> = {};
  for (const l of shortLabels) labelCount[l] = (labelCount[l] ?? 0) + 1;

  const labels = participantUserIds.map((uid, i) => {
    if (labelCount[shortLabels[i]] <= 1) return shortLabels[i];
    const { firstName, lastName } = profileByUserId[uid] ?? {
      firstName: "?",
      lastName: "",
    };
    return lastName ? `${firstName} ${lastName}` : firstName;
  });

  const userIdToLabel: Record<string, string> = {};
  participantUserIds.forEach((uid, i) => {
    userIdToLabel[uid] = labels[i];
  });

  return { labels, userIdToLabel };
}

// Returns one CommunicationMatrix per phase, keyed by phase_number as string.
// matrix[senderIdx][receiverIdx] = true when the sender sent at least one
// message to that recipient in the corresponding phase.
function buildPhaseCommunicationMatrices(
  messages: { room_id: string; sender: string; phase_sent_at: number | null }[],
  roomMembers: Record<string, string[]>,
  participantUserIds: string[],
  profileByUserId: Record<string, { firstName: string; lastName: string }>,
): Record<string, CommunicationMatrix> {
  const n = participantUserIds.length;
  if (n <= 1) return {};

  const { labels: headers } = buildUserIdToLabel(
    participantUserIds,
    profileByUserId,
  );

  const userIdToIndex: Record<string, number> = {};
  participantUserIds.forEach((uid, i) => {
    userIdToIndex[uid] = i;
  });

  const msgsByPhase: Record<string, typeof messages> = {};
  for (const msg of messages) {
    const phase =
      msg.phase_sent_at == null || msg.phase_sent_at <= 0
        ? 1
        : msg.phase_sent_at;
    const key = String(phase);
    if (!msgsByPhase[key]) msgsByPhase[key] = [];
    msgsByPhase[key].push(msg);
  }

  const result: Record<string, CommunicationMatrix> = {};
  for (const [phaseKey, phaseMsgs] of Object.entries(msgsByPhase)) {
    const matrix: boolean[][] = Array.from({ length: n }, () =>
      Array(n).fill(false),
    );
    for (const msg of phaseMsgs) {
      const senderIdx = userIdToIndex[msg.sender];
      if (senderIdx === undefined) continue;
      for (const uid of roomMembers[msg.room_id] ?? []) {
        if (uid === msg.sender) continue;
        const receiverIdx = userIdToIndex[uid];
        if (receiverIdx === undefined) continue;
        matrix[senderIdx][receiverIdx] = true;
      }
    }
    result[phaseKey] = { headers, matrix };
  }

  return result;
}

// Returns an ordered chat log per phase, keyed by phase_number as string.
function buildPhaseChatLogs(
  messages: {
    room_id: string;
    sender: string;
    phase_sent_at: number | null;
    created_at: string;
    message: string | null;
  }[],
  roomMembers: Record<string, string[]>,
  userIdToLabel: Record<string, string>,
): Record<string, ChatLogEntry[]> {
  const logsByPhase: Record<string, { ts: number; entry: ChatLogEntry }[]> = {};

  for (const msg of messages) {
    const phase =
      msg.phase_sent_at == null || msg.phase_sent_at <= 0
        ? 1
        : msg.phase_sent_at;
    const key = String(phase);
    if (!logsByPhase[key]) logsByPhase[key] = [];

    const recipientLabels = (roomMembers[msg.room_id] ?? [])
      .filter(uid => uid !== msg.sender)
      .map(uid => userIdToLabel[uid] ?? "Unknown");

    logsByPhase[key].push({
      ts: new Date(msg.created_at).getTime(),
      entry: {
        timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        senderLabel: userIdToLabel[msg.sender] ?? "Unknown",
        message: msg.message ?? "",
        recipientLabels,
      },
    });
  }

  const result: Record<string, ChatLogEntry[]> = {};
  for (const [key, items] of Object.entries(logsByPhase)) {
    result[key] = items.sort((a, b) => a.ts - b.ts).map(item => item.entry);
  }
  return result;
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

  // Cache check — return whatever PDF already exists in this session's folder.
  // Since template names can't change, the filename is stable; we just return it.
  const folderPath = `sessions/${sessionId}`;
  const { data: existingFiles } = await supabase.storage
    .from("reports")
    .list(folderPath);

  if (existingFiles && existingFiles.length > 0) {
    const existing = existingFiles[0];
    const { data: urlData } = supabase.storage
      .from("reports")
      .getPublicUrl(`${folderPath}/${existing.name}`);
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
      created_at,
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
    if (!p.role_phase_id) continue;
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

  // Room membership and per-phase communication matrices
  const { data: chatRooms } = await supabase
    .from("chat_room")
    .select("room_id, user_id")
    .eq("session_id", sessionId);

  const roomMembers: Record<string, string[]> = {};
  for (const row of chatRooms ?? []) {
    if (!roomMembers[row.room_id]) roomMembers[row.room_id] = [];
    roomMembers[row.room_id].push(row.user_id);
  }

  const roomIds = Object.keys(roomMembers);
  const { data: chatMessages } = roomIds.length
    ? await supabase
        .from("chat_message")
        .select("room_id, sender, phase_sent_at, created_at, message")
        .in("room_id", roomIds)
    : { data: [] };

  const participantUserIds = participants.map(p => p.user_id);
  const { userIdToLabel } =
    participants.length > 1
      ? buildUserIdToLabel(participantUserIds, profileByUserId)
      : { userIdToLabel: {} as Record<string, string> };

  const phaseMatrices =
    participants.length > 1
      ? buildPhaseCommunicationMatrices(
          chatMessages ?? [],
          roomMembers,
          participantUserIds,
          profileByUserId,
        )
      : {};

  const phaseChatLogs = buildPhaseChatLogs(
    chatMessages ?? [],
    roomMembers,
    userIdToLabel,
  );

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
      communicationMatrix: phaseMatrices[String(phase.phase_number)],
      chatLog: phaseChatLogs[String(phase.phase_number)],
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

  // Build friendly filename: use session_name if set, otherwise template name + date
  const friendlyName = session.session_name
    ? `${session.session_name}.pdf`
    : `${buildSessionDisplayName(template?.template_name, session.created_at)}.pdf`;
  const fileName = `${folderPath}/${friendlyName}`;

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
      created_at,
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

  const roleIds = [...new Set((rolePhases ?? []).map(rp => rp.role_id))];

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

  const rolePhaseIds = (rolePhases ?? []).map(rp => rp.role_phase_id);

  const { data: prompts } = rolePhaseIds.length
    ? await supabase
        .from("prompt")
        .select("prompt_id, prompt_text, role_phase_id")
        .in("role_phase_id", rolePhaseIds)
    : { data: [] };

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

  // Room membership and per-phase communication matrices
  const { data: chatRooms } = await supabase
    .from("chat_room")
    .select("room_id, user_id")
    .eq("session_id", sessionId);

  const roomMembers: Record<string, string[]> = {};
  for (const row of chatRooms ?? []) {
    if (!roomMembers[row.room_id]) roomMembers[row.room_id] = [];
    roomMembers[row.room_id].push(row.user_id);
  }

  const roomIds = Object.keys(roomMembers);
  const { data: chatMessages } = roomIds.length
    ? await supabase
        .from("chat_message")
        .select("room_id, sender, phase_sent_at, created_at, message")
        .in("room_id", roomIds)
    : { data: [] };

  const participantUserIds = participants.map(p => p.user_id);
  const { userIdToLabel } =
    participants.length > 1
      ? buildUserIdToLabel(participantUserIds, profileByUserId)
      : { userIdToLabel: {} as Record<string, string> };

  const phaseMatrices =
    participants.length > 1
      ? buildPhaseCommunicationMatrices(
          chatMessages ?? [],
          roomMembers,
          participantUserIds,
          profileByUserId,
        )
      : {};

  const phaseChatLogs = buildPhaseChatLogs(
    chatMessages ?? [],
    roomMembers,
    userIdToLabel,
  );

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
      communicationMatrix: phaseMatrices[String(phase.phase_number)],
      chatLog: phaseChatLogs[String(phase.phase_number)],
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

  // Build friendly filename: use session_name if set, otherwise template name + date
  const friendlyName = session.session_name
    ? `${session.session_name}.pdf`
    : `${buildSessionDisplayName(template?.template_name, session.created_at)}.pdf`;
  const fileName = `sessions/${sessionId}/${friendlyName}`;

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
