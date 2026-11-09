import type { SupabaseClient } from "@supabase/supabase-js";
import { IMAGES_BUCKET } from "@/lib/storage";

export type PdfImage = { data: Buffer; format: "png" | "jpg" };

function formatFor(type: string, path: string): PdfImage["format"] | null {
  if (type === "image/jpeg" || /\.jpe?g$/i.test(path)) return "jpg";
  if (type === "image/png" || /\.png$/i.test(path)) return "png";
  return null; // e.g. WebP from early uploads, which @react-pdf can't embed
}

export async function loadPdfImages(
  supabase: SupabaseClient,
  paths: (string | null | undefined)[],
): Promise<Record<string, PdfImage>> {
  const uniquePaths = [...new Set(paths.filter((p): p is string => !!p))];

  const entries = await Promise.all(
    uniquePaths.map(async path => {
      const { data, error } = await supabase.storage
        .from(IMAGES_BUCKET)
        .download(path);
      if (error || !data) {
        console.error(`Failed to download report image ${path}:`, error);
        return null;
      }
      const format = formatFor(data.type, path);
      if (!format) return null;
      const image: PdfImage = {
        data: Buffer.from(await data.arrayBuffer()),
        format,
      };
      return [path, image] as const;
    }),
  );

  return Object.fromEntries(entries.filter(e => e !== null));
}
