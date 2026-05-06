import path from "path";
import { Font, StyleSheet } from "@react-pdf/renderer";
import COLORS from "@/styles/colors";

const fontDir = path.join(process.cwd(), "public/fonts/Public_Sans");

Font.register({
  family: "Sans",
  fonts: [
    { src: path.join(fontDir, "PublicSans-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontDir, "PublicSans-Medium.ttf"), fontWeight: 500 },
    { src: path.join(fontDir, "PublicSans-Bold.ttf"), fontWeight: 700 },
    { src: path.join(fontDir, "PublicSans-Black.ttf"), fontWeight: 900 },
  ],
});

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Sans",
    fontSize: 11,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 52,
    backgroundColor: COLORS.white,
  },

  // Cover
  coverPage: {
    fontFamily: "Sans",
    fontSize: 11,
    paddingTop: 80,
    paddingBottom: 56,
    paddingHorizontal: 52,
    backgroundColor: COLORS.white,
  },
  coverLabel: {
    fontSize: 10,
    fontFamily: "Sans",
    color: COLORS.black40,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: "Sans",
    color: COLORS.black100,
    marginBottom: 6,
  },
  coverTemplateName: {
    fontSize: 13,
    color: COLORS.black40,
    marginBottom: 32,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.oat_dark,
    marginBottom: 24,
  },
  coverSectionLabel: {
    fontSize: 9,
    fontFamily: "Sans",
    color: COLORS.black40,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  coverBodyText: {
    fontSize: 11,
    color: COLORS.black70,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  coverDate: {
    fontSize: 10,
    color: COLORS.black40,
    marginTop: 8,
  },

  rolesList: {
    marginBottom: 16,
    gap: 8,
  },
  rolesListItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.oat_light,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.teal,
  },
  rolesListName: {
    fontSize: 11,
    fontFamily: "Sans",
    color: COLORS.black100,
    marginBottom: 3,
  },
  rolesListDescription: {
    fontSize: 10,
    color: COLORS.black70,
    lineHeight: 1.5,
  },

  // Participant summary and dep matrix (page 2)
  pageTitle: {
    fontSize: 16,
    fontFamily: "Sans",
    color: COLORS.black100,
    marginBottom: 4,
  },
  pageTitleDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.oat_dark,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: COLORS.oat_light,
    borderRadius: 4,
    padding: 12,
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontFamily: "Sans",
    color: COLORS.black100,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.black40,
    textTransform: "uppercase",
  },
  roleCountRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  roleCountBadge: {
    backgroundColor: COLORS.lightEletricBlue,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleCountText: {
    fontSize: 10,
    color: COLORS.black70,
  },

  // Participant table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.oat_medium,
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
    borderBottomColor: COLORS.oat_medium,
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.oat_medium,
    backgroundColor: COLORS.oat_light,
  },
  colName: { flex: 2, fontSize: 10 },
  colRole: { flex: 2, fontSize: 10 },
  colStatus: { flex: 1, fontSize: 10 },
  colHeaderText: {
    fontSize: 9,
    fontFamily: "Sans",
    color: COLORS.black70,
    textTransform: "uppercase",
  },
  // Status colors — semantic meaning, using tag colors intentionally
  statusComplete: { flex: 1, fontSize: 10, color: COLORS.tagGreen },
  statusPending: { flex: 1, fontSize: 10, color: COLORS.orange },

  // Communication matrix
  matrixSection: {
    marginTop: 28,
  },
  matrixTitle: {
    fontSize: 12,
    fontFamily: "Sans",
    color: COLORS.black100,
    marginBottom: 3,
  },
  matrixSubtitle: {
    fontSize: 9,
    color: COLORS.black40,
    marginBottom: 8,
  },
  // "Message Recipient" merged banner above column headers
  matrixRecipientBanner: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.oat_dark,
  },
  matrixRecipientBannerSpacer: {
    width: 16,
    backgroundColor: COLORS.teal,
  },
  matrixRecipientLabel: {
    flex: 1,
    backgroundColor: COLORS.teal,
    paddingVertical: 4,
    paddingHorizontal: 3,
    alignItems: "center",
  },
  matrixRecipientText: {
    fontSize: 6,
    fontFamily: "Sans",
    color: COLORS.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // "Message Sender" merged column left of row labels
  matrixSenderCol: {
    width: 22,
    paddingHorizontal: 4,
    backgroundColor: COLORS.teal,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.oat_dark,
  },
  matrixSenderText: {
    fontSize: 6,
    fontFamily: "Sans",
    color: COLORS.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  matrixRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.oat_dark,
  },
  matrixRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.oat_dark,
    backgroundColor: COLORS.oat_light,
  },
  matrixCornerCell: {
    flex: 2,
    paddingVertical: 4,
    paddingHorizontal: 3,
    backgroundColor: COLORS.oat_medium,
  },
  matrixHeaderCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 3,
    backgroundColor: COLORS.oat_medium,
    borderBottomColor: COLORS.oat_dark,
  },
  matrixHeaderText: {
    fontSize: 8,
    fontFamily: "Sans",
    color: COLORS.black70,
    textAlign: "center",
  },
  matrixRowLabelCell: {
    flex: 2,
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  matrixRowLabelText: {
    fontSize: 8,
    fontFamily: "Sans",
    color: COLORS.black70,
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
    backgroundColor: COLORS.oat_medium,
  },
  matrixTextYes: {
    fontSize: 9,
    color: COLORS.teal,
    fontFamily: "Sans",
    textAlign: "center",
  },
  matrixTextNo: {
    fontSize: 9,
    color: COLORS.teal,
    textAlign: "center",
  },
  matrixTextDiag: {
    fontSize: 9,
    color: COLORS.black40,
    textAlign: "center",
  },

  // Chat Message Log Section
  chatLogSection: {
    marginTop: 20,
  },
  chatLogTitle: {
    fontSize: 12,
    fontFamily: "Sans",
    color: COLORS.black100,
    marginBottom: 8,
  },
  chatLogHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.oat_medium,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 2,
    marginBottom: 1,
  },
  chatLogHeaderText: {
    fontSize: 7,
    fontFamily: "Sans",
    color: COLORS.black70,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chatLogRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.oat_medium,
  },
  chatLogRowAlt: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.oat_medium,
    backgroundColor: COLORS.oat_light,
  },
  chatLogCell: {
    fontSize: 8,
    color: COLORS.black70,
    lineHeight: 1.4,
  },
  chatLogColTime: {
    width: 36,
  },
  chatLogColFrom: {
    width: 60,
    paddingRight: 4,
  },
  chatLogColMsg: {
    flex: 1,
    paddingHorizontal: 4,
  },
  chatLogColTo: {
    width: 60,
    paddingLeft: 4,
  },

  // Network graph
  graphSection: {
    marginTop: 28,
  },
  graphTitle: {
    fontSize: 12,
    fontFamily: "Sans",
    color: COLORS.black100,
    marginBottom: 3,
  },
  graphSubtitle: {
    fontSize: 9,
    color: COLORS.black40,
    marginBottom: 6,
  },

  // Phase pages (page 3+)
  phaseNumber: {
    fontSize: 10,
    fontFamily: "Sans",
    color: COLORS.black40,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  phaseName: {
    fontSize: 18,
    fontFamily: "Sans",
    color: COLORS.black100,
    marginBottom: 6,
  },
  phaseDescription: {
    fontSize: 11,
    color: COLORS.black70,
    lineHeight: 1.5,
    marginBottom: 20,
  },

  // Role group
  roleBlock: {
    marginBottom: 18,
  },
  roleLabel: {
    fontSize: 11,
    fontFamily: "Sans",
    color: COLORS.black100,
    backgroundColor: COLORS.oat_medium,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 10,
  },

  rolePhaseDescription: {
    fontSize: 10,
    color: COLORS.black70,
    lineHeight: 1.5,
    paddingHorizontal: 8,
    marginBottom: 10,
  },

  // Prompt + responses
  promptBlock: {
    marginBottom: 14,
    paddingLeft: 8,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 6,
  },
  questionBadge: {
    fontSize: 9,
    fontFamily: "Sans",
    color: COLORS.white,
    backgroundColor: COLORS.black70,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    height: 16,
    lineHeight: 1,
    textAlign: "center",
    minWidth: 20,
    marginTop: 1,
  },
  questionText: {
    fontSize: 11,
    fontFamily: "Sans",
    color: COLORS.black100,
    flex: 1,
    lineHeight: 1.4,
    paddingTop: 2,
  },
  responseRow: {
    flexDirection: "row",
    paddingLeft: 8,
    marginBottom: 4,
    gap: 8,
  },
  responseName: {
    fontSize: 10,
    fontFamily: "Sans",
    color: COLORS.black70,
    width: 110,
    flexShrink: 0,
  },
  responseAnswer: {
    fontSize: 10,
    color: COLORS.black70,
    flex: 1,
    lineHeight: 1.5,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.oat_dark,
    paddingLeft: 8,
  },
  noResponse: {
    fontSize: 10,
    color: COLORS.black40,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.oat_dark,
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
    borderTopColor: COLORS.oat_dark,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 9, color: COLORS.black40 },

  optionsList: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
    width: "100%",
  },
  optionBullet: {
    flexShrink: 0,
  },
  optionUnselected: {
    fontSize: 10,
    color: COLORS.black40,
  },
  optionSelected: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.black100,
  },
  templateOptionsList: {
    flexDirection: "column",
    paddingLeft: 8,
    marginTop: 4,
  },
});
