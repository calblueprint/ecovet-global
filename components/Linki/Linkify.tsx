"use client";

import DOMPurify from "dompurify";

DOMPurify.addHook("afterSanitizeAttributes", node => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

function linkify(text: string) {
  const pattern =
    /((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|org|net|edu|gov|io|co|us)(?:\/[^\s]*)?)/g;

  return text.replace(pattern, match => {
    const href = /^https?:\/\//.test(match) ? match : `https://${match}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
  });
}

export default function LinkedText({ text }: { text: string | null }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(linkify(text ?? "")),
      }}
    />
  );
}
