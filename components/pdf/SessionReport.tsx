import { Document, Page, Text, View } from "@react-pdf/renderer";
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

export type SessionReportData = {
  sessionName: string;
  templateName: string;
  summary: string | null;
  generatedAt: string;
  participants: ParticipantSummary[];
  phases: PhaseReportData[];
  facilitatorComments?: string | null;
};

export function SessionSummaryReport({
  sessionName,
  templateName,
  summary,
  generatedAt,
  participants,
  phases,
  facilitatorComments,
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
