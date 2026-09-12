import type { ContentBlock } from "@/lib/content-public-api";

export function StructuredContentRenderer({ blocks }: { blocks?: ContentBlock[] }) {
  if (!blocks?.length) return <p>More reflections will be shared here soon.</p>;
  return <div className="structured-content">{blocks.map((block, index) => {
    const text = typeof block.text === "string" ? block.text : "";
    if (block.type === "heading") return <h2 key={index}>{text}</h2>;
    if (block.type === "quote") return <blockquote key={index}>{text}</blockquote>;
    if (block.type === "list") return <ul key={index}>{(block.items?.length ? block.items : text.split("\n")).filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}</ul>;
    return <p key={index}>{text}</p>;
  })}</div>;
}
