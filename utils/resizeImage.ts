// Browser-only: shrinks an image before upload so uploads stay small
// (~300–500 KB) and well under the server action size limit.
// Re-encoding also strips EXIF data such as GPS location.

// Output is always JPEG (not WebP): the PDF renderer (@react-pdf) only
// supports JPEG and PNG, and report PDFs embed these images.

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_DIMENSION = 1600; // longest side, in px
const QUALITY = 0.8;

export async function resizeImage(file: File): Promise<Blob> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Please choose a JPEG, PNG, or WebP image.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process this image.");

  // JPEG has no transparency, so put transparent areas on white.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const jpeg = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  if (!jpeg) throw new Error("Could not process this image.");
  return jpeg;
}
