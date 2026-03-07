import { CSSProperties } from "react";
import COLORS from "@/styles/colors";

export const dialogTitle: CSSProperties = {
  color: COLORS.black,
  fontFamily: "Public Sans",
  fontSize: "1.2rem",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "normal",
};

export const dialogCaption: CSSProperties = {
  color: COLORS.black,
  fontFamily: "Public Sans",
  fontSize: "1.0rem",
  fontStyle: "normal",
  fontWeight: 450,
  lineHeight: "normal",
};

export const cancelButton: CSSProperties = {
  borderRadius: "0.25rem",
  border: "1px solid var(--Oat-Medium, #EEE)",
  background: COLORS.white,
  color: COLORS.black,
  padding: "0.5rem 2rem",
  gap: "0.625rem",
  fontFamily: "Public Sans",
  fontSize: "0.8rem",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "normal",
};

export const deleteButton: CSSProperties = {
  borderRadius: "0.25rem",
  background: COLORS.teal,
  color: COLORS.white,
  padding: "0.5rem 2rem",
  gap: "0.625rem",
  fontFamily: "Public Sans",
  fontSize: "0.8rem",
  fontStyle: "normal",
  fontWeight: 700,
  lineHeight: "normal",
};
