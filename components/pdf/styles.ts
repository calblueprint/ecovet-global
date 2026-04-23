import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 52,
    backgroundColor: "#ffffff",
  },

  // Cover
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

  // Participant summary and dep matrix (page 2) 
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

  // Communication matrix
  matrixSection: {
    marginTop: 28,
  },
  matrixTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 3,
  },
  matrixSubtitle: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 10,
  },
  matrixRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  matrixRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fafafa",
  },
  matrixCornerCell: {
    flex: 2,
    paddingVertical: 4,
    paddingHorizontal: 3,
    backgroundColor: "#f3f4f6",
  },
  matrixHeaderCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 3,
    backgroundColor: "#f3f4f6",
  },
  matrixHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    textAlign: "center",
  },
  matrixRowLabelCell: {
    flex: 2,
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  matrixRowLabelText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
  },
  matrixCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  matrixCellDiag: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 3,
    backgroundColor: "#f3f4f6",
  },
  matrixTextYes: {
    fontSize: 9,
    color: "#059669",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  matrixTextNo: {
    fontSize: 9,
    color: "#059669",
    textAlign: "center",
  },
  matrixTextDiag: {
    fontSize: 9,
    color: "#9ca3af",
    textAlign: "center",
  },

  // Network graph
  graphSection: {
    marginTop: 28,
  },
  graphTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 3,
  },
  graphSubtitle: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 6,
  },

  // Phase pages (page 3+)
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
