export function buildSessionDisplayName(
  templateName: string | null | undefined,
  createdAt: string | null | undefined,
): string {
  const cleanName =
    (templateName ?? "Untitled")
      .replace(/[\/\\:*?"<>|]/g, "")
      .replace(/\s+/g, " ")
      .trim() || "Untitled";
  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString("en-CA")
    : "";
  return `${cleanName}_${dateStr}`;
}
