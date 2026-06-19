import DOMPurify from "dompurify";

function linkify(text: string) {
  // escape HTML first so user text can't inject markup
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  );
}

export default function LinkedText({ text }: { text: string | null }) {
  if (text) {
    return (
      <span
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(linkify(text)) }}
      />
    );
  }
  return null;
}
