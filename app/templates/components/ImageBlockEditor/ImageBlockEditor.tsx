import type { UUID } from "@/types/schema";
import { useEffect, useState } from "react";
import {
  getSignedImageUrls,
  uploadTemplateImage,
} from "@/actions/supabase/queries/images";
import { ACCEPTED_IMAGE_TYPES, resizeImage } from "@/utils/resizeImage";
import { BigInput } from "../QuestionBuilder/styles";
import {
  DropAreaHint,
  DropAreaTitle,
  HiddenFileInput,
  ImageActionButton,
  ImageActions,
  ImageDropArea,
  ImageError,
  PreviewFrame,
  PreviewImage,
  PreviewPlaceholder,
} from "./styles";

export default function ImageBlockEditor({
  templateId,
  promptId,
  imagePath,
  caption,
  onImagePathChange,
  onCaptionChange,
}: {
  templateId: UUID;
  promptId: UUID;
  imagePath: string | null;
  caption: string;
  onImagePathChange: (path: string | null) => void;
  onCaptionChange: (caption: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Shown right after picking a file, so there's no wait for a signed URL.
  const [localPreview, setLocalPreview] = useState<{
    path: string;
    url: string;
  } | null>(null);
  const [signed, setSigned] = useState<{ path: string; url: string } | null>(
    null,
  );

  // Saved (or previously uploaded) image: fetch a signed URL to display it.
  useEffect(() => {
    if (!imagePath || localPreview?.path === imagePath) return;
    let cancelled = false;
    getSignedImageUrls([imagePath]).then(urls => {
      if (!cancelled && urls[imagePath]) {
        setSigned({ path: imagePath, url: urls[imagePath] });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [imagePath, localPreview?.path]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview.url);
    };
  }, [localPreview]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const resized = await resizeImage(file);
      const formData = new FormData();
      formData.append(
        "file",
        new File([resized], file.name, { type: resized.type }),
      );
      formData.append("templateId", templateId);
      formData.append("promptId", promptId);

      const result = await uploadTemplateImage(formData);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setLocalPreview({
        path: result.path,
        url: URL.createObjectURL(resized),
      });
      onImagePathChange(result.path);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  }

  const fileInput = (
    <HiddenFileInput
      accept={ACCEPTED_IMAGE_TYPES.join(",")}
      disabled={uploading}
      onChange={e => {
        handleFile(e.target.files?.[0]);
        e.target.value = ""; // allow picking the same file again
      }}
    />
  );

  const previewUrl =
    (localPreview?.path === imagePath && localPreview?.url) ||
    (signed?.path === imagePath && signed?.url) ||
    null;

  return (
    <>
      {imagePath ? (
        <>
          <PreviewFrame>
            {previewUrl ? (
              <PreviewImage
                src={previewUrl}
                alt={caption || "Uploaded image"}
              />
            ) : (
              <PreviewPlaceholder>Loading image…</PreviewPlaceholder>
            )}
          </PreviewFrame>
          <ImageActions onClick={e => e.stopPropagation()}>
            <ImageActionButton>
              {uploading ? "Uploading…" : "Replace"}
              {fileInput}
            </ImageActionButton>
            <ImageActionButton
              as="button"
              type="button"
              $danger
              disabled={uploading}
              onClick={() => onImagePathChange(null)}
            >
              Remove
            </ImageActionButton>
          </ImageActions>
        </>
      ) : (
        <ImageDropArea $disabled={uploading} onClick={e => e.stopPropagation()}>
          <DropAreaTitle>
            {uploading ? "Uploading…" : "Choose an image"}
          </DropAreaTitle>
          <DropAreaHint>JPEG, PNG or WebP</DropAreaHint>
          {fileInput}
        </ImageDropArea>
      )}

      {error && <ImageError role="alert">{error}</ImageError>}

      <BigInput
        name="image_caption"
        placeholder="Caption (optional)"
        value={caption}
        onChange={e => onCaptionChange(e.target.value)}
      />
    </>
  );
}
