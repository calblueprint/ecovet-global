"use server";

import {
  getSupabaseAdminClient,
  getSupabaseServerClient,
} from "@/lib/supabase/server";

// Private bucket: every read goes through a signed URL
const BUCKET = "images";
const MAX_BYTES = 4 * 1024 * 1024; // matches serverActions.bodySizeLimit
const SIGNED_URL_SECONDS = 2 * 60 * 60;
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getCurrentUserType() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profile")
    .select("user_type")
    .eq("id", user.id)
    .single();
  return profile?.user_type ?? null;
}

async function canEditTemplates() {
  const userType = await getCurrentUserType();
  return userType === "Admin" || userType === "Facilitator";
}

export async function uploadTemplateImage(
  formData: FormData,
): Promise<{ path: string } | { error: string }> {
  if (!(await canEditTemplates())) {
    return { error: "You don't have permission to upload images." };
  }

  const file = formData.get("file");
  const templateId = formData.get("templateId");
  const promptId = formData.get("promptId");

  if (!(file instanceof File)) return { error: "No image was attached." };
  if (
    typeof templateId !== "string" ||
    typeof promptId !== "string" ||
    !UUID_PATTERN.test(templateId) ||
    !UUID_PATTERN.test(promptId)
  ) {
    return { error: "Invalid template or question." };
  }

  const extension = EXTENSION_BY_TYPE[file.type];
  if (!extension) return { error: "Please use a JPEG, PNG, or WebP image." };
  if (file.size > MAX_BYTES) return { error: "Image must be under 4 MB." };

  // Random suffix so a replaced image never collides with the old file.
  const path = `${templateId}/${promptId}-${crypto.randomUUID()}.${extension}`;
  const { error } = await getSupabaseAdminClient()
    .storage.from(BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    console.error("Image upload failed:", error);
    return { error: "Upload failed. Please try again." };
  }
  return { path };
}

// Copies an image into another template's folder (used when duplicating a
// template). Returns the new path, or null if the copy failed.
export async function copyTemplateImage(
  fromPath: string,
  toTemplateId: string,
  toPromptId: string,
): Promise<string | null> {
  if (
    !(await canEditTemplates()) ||
    !UUID_PATTERN.test(toTemplateId) ||
    !UUID_PATTERN.test(toPromptId)
  ) {
    return null;
  }

  const extension = fromPath.split(".").pop() ?? "webp";
  const toPath = `${toTemplateId}/${toPromptId}-${crypto.randomUUID()}.${extension}`;
  const { error } = await getSupabaseAdminClient()
    .storage.from(BUCKET)
    .copy(fromPath, toPath);

  if (error) {
    console.error("Image copy failed:", error);
    return null;
  }
  return toPath;
}

// Links expire after SIGNED_URL_SECONDS
export async function getSignedImageUrls(
  paths: string[],
): Promise<Record<string, string>> {
  const uniquePaths = [...new Set(paths.filter(Boolean))];
  if (uniquePaths.length === 0) return {};
  if (!(await getCurrentUserType())) return {};

  const { data, error } = await getSupabaseAdminClient()
    .storage.from(BUCKET)
    .createSignedUrls(uniquePaths, SIGNED_URL_SECONDS);

  if (error) {
    console.error("Failed to sign image URLs:", error);
    return {};
  }

  const urls: Record<string, string> = {};
  for (const item of data) {
    if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
  }
  return urls;
}

// deleted if no promptid pointing (so if the prompt was deleted)
// keeps archived prompts
export async function removeUnusedTemplateImages(
  templateId: string,
): Promise<void> {
  if (!UUID_PATTERN.test(templateId) || !(await canEditTemplates())) return;

  const admin = getSupabaseAdminClient();
  const { data: files, error: listError } = await admin.storage
    .from(BUCKET)
    .list(templateId, { limit: 1000 });
  if (listError) {
    console.error("Failed to list template images:", listError);
    return;
  }
  if (!files?.length) return;

  const { data: prompts, error: promptError } = await admin
    .from("prompt")
    .select("image_path")
    .like("image_path", `${templateId}/%`);
  if (promptError) {
    console.error("Failed to load image references:", promptError);
    return;
  }

  const referenced = new Set((prompts ?? []).map(p => p.image_path));
  const unused = files
    .filter(f => f.id) // folder placeholders have no id
    .map(f => `${templateId}/${f.name}`)
    .filter(path => !referenced.has(path));
  if (unused.length === 0) return;

  const { error: removeError } = await admin.storage
    .from(BUCKET)
    .remove(unused);
  if (removeError) {
    console.error("Failed to remove unused images:", removeError);
  }
}
