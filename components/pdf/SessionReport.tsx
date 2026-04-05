import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 52,
    backgroundColor: "#ffffff",
  },

  // ── Cover ────────────────────────────────────────────────────────────────
  coverPage: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 80,
    paddingBottom: 56,
    paddingHorizontal: 52,
    backgroundColor: "#ffffff",
  },
  coverLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 6,
  },
  coverTemplateName: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 32,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 24,
  },
  coverSectionLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  coverBodyText: {
    fontSize: 11,
    color: "#374151",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  coverDate: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 8,
  },

  // ── Participant summary (page 2) ─────────────────────────────────────────
  pageTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 4,
  },
  pageTitleDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    padding: 12,
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    color: "#6b7280",
    textTransform: "uppercase",
  },
  roleCountRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  roleCountBadge: {
    backgroundColor: "#eff6ff",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleCountText: {
    fontSize: 10,
    color: "#6b7280",
  },

  // Participant table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fafafa",
  },
  colName: { flex: 2, fontSize: 10 },
  colRole: { flex: 2, fontSize: 10 },
  colStatus: { flex: 1, fontSize: 10 },
  colHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  statusComplete: { fontSize: 10, color: "#059669" },
  statusPending: { fontSize: 10, color: "#d97706" },

  // ── Phase pages (page 3+) ────────────────────────────────────────────────
  phaseNumber: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  phaseName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 6,
  },
  phaseDescription: {
    fontSize: 11,
    color: "#4b5563",
    lineHeight: 1.5,
    marginBottom: 20,
  },

  // Role group
  roleBlock: {
    marginBottom: 18,
  },
  roleLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
    backgroundColor: "#f3f4f6",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 10,
  },

  // Prompt + responses
  promptBlock: {
    marginBottom: 14,
    paddingLeft: 8,
  },
  questionRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 6,
  },
  questionBadge: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    backgroundColor: "#6b7280",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    marginTop: 1,
  },
  questionText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
    flex: 1,
    lineHeight: 1.4,
  },
  responseRow: {
    flexDirection: "row",
    paddingLeft: 8,
    marginBottom: 4,
    gap: 8,
  },
  responseName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    width: 110,
    flexShrink: 0,
  },
  responseAnswer: {
    fontSize: 10,
    color: "#374151",
    flex: 1,
    lineHeight: 1.5,
    borderLeftWidth: 2,
    borderLeftColor: "#e5e7eb",
    paddingLeft: 8,
  },
  noResponse: {
    fontSize: 10,
    color: "#9ca3af",
    fontStyle: "italic",
    borderLeftWidth: 2,
    borderLeftColor: "#e5e7eb",
    paddingLeft: 8,
    flex: 1,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: 52,
    right: 52,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 9, color: "#9ca3af" },
});

// ── Types ──────────────────────────────────────────────────────────────────────

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

export type SessionReportData = {
  sessionName: string;
  templateName: string;
  summary: string | null;
  generatedAt: string;
  participants: ParticipantSummary[];
  phases: PhaseReportData[];
};

// ── Component ──────────────────────────────────────────────────────────────────

export function SessionSummaryReport({
  sessionName,
  templateName,
  summary,
  generatedAt,
  participants,
  phases,
}: SessionReportData) {
  // Compute role counts for the stats section
  const roleCounts: Record<string, number> = {};
  for (const p of participants) {
    roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1;
  }

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
