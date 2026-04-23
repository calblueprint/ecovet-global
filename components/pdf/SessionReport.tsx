import { Circle, Document, G, Line, Page, Svg, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";

export type ParticipantSummary = {
  name: string;
  role: string;
  isFinished: boolean;
};

export type PromptResponse = {
  participantName: string;
  answer: string;
};

export type PhaseReportData = {
  phaseName: string;
  phaseNumber: number;
  phaseDescription: string | null;
  roles: {
    roleName: string;
    prompts: {
      question: string;
      responses: PromptResponse[];
    }[];
  }[];
};

export type CommunicationMatrix = {
  headers: string[];
  matrix: boolean[][];
};

export type SessionReportData = {
  sessionName: string;
  templateName: string;
  summary: string | null;
  generatedAt: string;
  participants: ParticipantSummary[];
  phases: PhaseReportData[];
  facilitatorComments?: string | null;
  communicationMatrix?: CommunicationMatrix;
};

function NetworkGraph({ headers, matrix }: CommunicationMatrix) {
  const n = headers.length;
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = n <= 3 ? 65 : n <= 6 ? 80 : n <= 10 ? 92 : 100;
  const nodeRadius = n <= 6 ? 13 : 10;
  const labelGap = nodeRadius + 12;

  const positions = headers.map((_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), angle };
  });

  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (matrix[i][j]) edges.push([i, j]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {edges.map(([i, j], k) => (
        <Line
          key={`e-${k}`}
          x1={positions[i].x}
          y1={positions[i].y}
          x2={positions[j].x}
          y2={positions[j].y}
          stroke="#476C77"
          strokeWidth={1.5}
          strokeOpacity={0.45}
        />
      ))}
      {positions.map((pos, i) => {
        const lx = cx + (r + labelGap) * Math.cos(pos.angle);
        const ly = cy + (r + labelGap) * Math.sin(pos.angle);
        const anchor =
          lx < cx - 6 ? "end" : lx > cx + 6 ? "start" : "middle";
        return (
          <G key={`n-${i}`}>
            <Circle cx={pos.x} cy={pos.y} r={nodeRadius} fill="#476C77" />
            <Text
              x={lx}
              y={ly + 3}
              style={{ fontSize: 7 }}
              fill="#4B4A49"
              textAnchor={anchor}
            >
              {headers[i]}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}

export function SessionSummaryReport({
  sessionName,
  templateName,
  summary,
  generatedAt,
  participants,
  phases,
  facilitatorComments,
  communicationMatrix,
}: SessionReportData) {
  // Compute role counts for the stats section
  const roleCounts: Record<string, number> = {};
  for (const p of participants) {
    roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1;
  }

  console.log("[SessionReport] communicationMatrix received:", communicationMatrix);
  console.log("[SessionReport] communicationMatrix defined?", !!communicationMatrix);
  console.log("[SessionReport] headers.length:", communicationMatrix?.headers?.length);
  console.log("[SessionReport] render condition (headers.length > 1):", (communicationMatrix?.headers?.length ?? 0) > 1);

  return (
    <Document>
      {/* ── Page 1: Cover ─────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverLabel}>Session Report</Text>
        <Text style={styles.coverTitle}>{sessionName}</Text>
        <Text style={styles.coverTemplateName}>{templateName}</Text>

        <View style={styles.divider} />

        {summary && (
          <>
            <Text style={styles.coverSectionLabel}>Summary</Text>
            <Text style={styles.coverBodyText}>{summary}</Text>
          </>
        )}

        <Text style={styles.coverDate}>Generated {generatedAt}</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>EcoVet Global</Text>
          <Text style={styles.footerText}>{generatedAt}</Text>
        </View>
      </Page>

      {/* ── Page 2: Participant Summary ────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.pageTitle}>Participants</Text>
        <View style={styles.pageTitleDivider} />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{participants.length}</Text>
            <Text style={styles.statLabel}>Total Participants</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {participants.filter(p => p.isFinished).length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {Object.keys(roleCounts).length}
            </Text>
            <Text style={styles.statLabel}>Roles</Text>
          </View>
        </View>

        {/* Role breakdown */}
        <View style={styles.roleCountRow}>
          {Object.entries(roleCounts).map(([role, count]) => (
            <View key={role} style={styles.roleCountBadge}>
              <Text style={styles.roleCountText}>
                {role}: {count}
              </Text>
            </View>
          ))}
        </View>

        {/* Participant table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colName, styles.colHeaderText]}>Name</Text>
          <Text style={[styles.colRole, styles.colHeaderText]}>Role</Text>
          <Text style={[styles.colStatus, styles.colHeaderText]}>Status</Text>
        </View>

        {participants.map((p, i) => (
          <View
            key={i}
            style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
          >
            <Text style={styles.colName}>{p.name}</Text>
            <Text style={styles.colRole}>{p.role}</Text>
            <Text
              style={
                p.isFinished ? styles.statusComplete : styles.statusPending
              }
            >
              {p.isFinished ? "Completed" : "In Progress"}
            </Text>
          </View>
        ))}

        {/* Communication matrix */}
        {communicationMatrix && communicationMatrix.headers.length > 1 && (
          <View style={styles.matrixSection}>
            <Text style={styles.matrixTitle}>Communication Matrix</Text>
            <Text style={styles.matrixSubtitle}>
              Indicates participants who shared a chat room during the session
            </Text>

            {/* Header row */}
            <View style={styles.matrixRow}>
              <View style={styles.matrixCornerCell} />
              {communicationMatrix.headers.map((h, i) => (
                <View key={i} style={styles.matrixHeaderCell}>
                  <Text style={styles.matrixHeaderText}>{h}</Text>
                </View>
              ))}
            </View>

            {/* Data rows */}
            {communicationMatrix.matrix.map((row, ri) => (
              <View
                key={ri}
                style={
                  ri % 2 === 0 ? styles.matrixRow : styles.matrixRowAlt
                }
              >
                <View style={styles.matrixRowLabelCell}>
                  <Text style={styles.matrixRowLabelText}>
                    {communicationMatrix.headers[ri]}
                  </Text>
                </View>
                {row.map((cell, ci) => (
                  <View
                    key={ci}
                    style={
                      ri === ci
                        ? styles.matrixCellDiag
                        : styles.matrixCell
                    }
                  >
                    <Text
                      style={
                        ri === ci
                          ? styles.matrixTextDiag
                          : cell
                            ? styles.matrixTextYes
                            : styles.matrixTextNo
                      }
                    >
                      {ri === ci ? "—" : cell ? "X" : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Communication network graph */}
        {communicationMatrix && communicationMatrix.headers.length > 1 && (
          <View style={styles.graphSection}>
            <Text style={styles.graphTitle}>Communication Network</Text>
            <Text style={styles.graphSubtitle}>
              Each node is a participant; lines connect those who shared a chat
              room
            </Text>
            <NetworkGraph {...communicationMatrix} />
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>{sessionName}</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* ── Facilitator Comments ─────────────────────────────────────────── */}
      {facilitatorComments && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.pageTitle}>Facilitator Comments</Text>
          <View style={styles.pageTitleDivider} />
          <Text style={styles.coverBodyText}>{facilitatorComments}</Text>
          <View style={styles.footer}>
            <Text style={styles.footerText}>{sessionName}</Text>
            <Text
              style={styles.footerText}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
          </View>
        </Page>
      )}

      {/* ── Page 3+: One page per phase ──────────────────────────────────── */}
      {phases.map((phase, pi) => (
        <Page key={pi} size="A4" style={styles.page}>
          <Text style={styles.phaseNumber}>Phase {phase.phaseNumber}</Text>
          <Text style={styles.phaseName}>{phase.phaseName}</Text>
          <View style={styles.divider} />

          {phase.phaseDescription && (
            <Text style={styles.phaseDescription}>
              {phase.phaseDescription}
            </Text>
          )}

          {phase.roles.map((role, ri) => (
            <View key={ri} style={styles.roleBlock}>
              <Text style={styles.roleLabel}>Role: {role.roleName}</Text>

              {role.prompts.map((prompt, qi) => (
                <View key={qi} style={styles.promptBlock}>
                  <View style={styles.questionRow}>
                    <Text style={styles.questionBadge}>Q{qi + 1}</Text>
                    <Text style={styles.questionText}>{prompt.question}</Text>
                  </View>

                  {prompt.responses.map((res, ri2) => (
                    <View key={ri2} style={styles.responseRow}>
                      <Text style={styles.responseName}>
                        {res.participantName}
                      </Text>
                      {res.answer === "(no response)" ? (
                        <Text style={styles.noResponse}>(no response)</Text>
                      ) : (
                        <Text style={styles.responseAnswer}>{res.answer}</Text>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {sessionName} — {phase.phaseName}
            </Text>
            <Text
              style={styles.footerText}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
          </View>
        </Page>
      ))}
    </Document>
  );
}
