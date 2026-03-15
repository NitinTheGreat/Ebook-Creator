import { JSONContent } from "@tiptap/react";

export interface FlatBlock {
  type: "heading" | "paragraph" | "blockquote" | "bulletList" | "orderedList" | "listItem" | "hardBreak";
  level?: number;
  text: string;
  marks?: string[];
  children?: FlatBlock[];
}

/**
 * Extract plain text from a Tiptap JSON node recursively.
 */
export function extractText(node: JSONContent): string {
  if (node.text) return node.text;
  if (!node.content) return "";
  return node.content.map(extractText).join("");
}

/**
 * Flatten a Tiptap doc into renderable blocks.
 */
export function flattenDoc(doc: JSONContent): FlatBlock[] {
  if (!doc.content) return [];
  return doc.content.map((node) => nodeToBlock(node)).filter(Boolean) as FlatBlock[];
}

function nodeToBlock(node: JSONContent): FlatBlock | null {
  switch (node.type) {
    case "heading":
      return {
        type: "heading",
        level: node.attrs?.level ?? 1,
        text: extractText(node),
      };
    case "paragraph":
      return {
        type: "paragraph",
        text: extractText(node),
        marks: collectMarks(node),
      };
    case "blockquote":
      return {
        type: "blockquote",
        text: extractText(node),
        children: node.content?.map(nodeToBlock).filter(Boolean) as FlatBlock[],
      };
    case "bulletList":
      return {
        type: "bulletList",
        text: "",
        children: node.content?.map(nodeToBlock).filter(Boolean) as FlatBlock[],
      };
    case "orderedList":
      return {
        type: "orderedList",
        text: "",
        children: node.content?.map(nodeToBlock).filter(Boolean) as FlatBlock[],
      };
    case "listItem":
      return {
        type: "listItem",
        text: extractText(node),
        children: node.content?.map(nodeToBlock).filter(Boolean) as FlatBlock[],
      };
    default:
      if (node.text) {
        return { type: "paragraph", text: node.text };
      }
      return null;
  }
}

function collectMarks(node: JSONContent): string[] {
  const marks: string[] = [];
  if (node.content) {
    for (const child of node.content) {
      if (child.marks) {
        for (const mark of child.marks) {
          if (mark.type && !marks.includes(mark.type)) {
            marks.push(mark.type);
          }
        }
      }
    }
  }
  return marks;
}

/**
 * Convert a Tiptap JSON content node array into HTML string.
 */
export function tiptapToHtml(doc: JSONContent): string {
  if (!doc.content) return "";
  return doc.content.map(nodeToHtml).join("");
}

function nodeToHtml(node: JSONContent): string {
  switch (node.type) {
    case "heading": {
      const level = node.attrs?.level ?? 1;
      const text = inlineToHtml(node.content);
      return `<h${level}>${text}</h${level}>`;
    }
    case "paragraph": {
      const text = inlineToHtml(node.content);
      const align = node.attrs?.textAlign;
      const style = align ? ` style="text-align:${align}"` : "";
      return `<p${style}>${text}</p>`;
    }
    case "blockquote": {
      const inner = node.content?.map(nodeToHtml).join("") ?? "";
      return `<blockquote>${inner}</blockquote>`;
    }
    case "bulletList": {
      const items = node.content?.map(nodeToHtml).join("") ?? "";
      return `<ul>${items}</ul>`;
    }
    case "orderedList": {
      const items = node.content?.map(nodeToHtml).join("") ?? "";
      return `<ol>${items}</ol>`;
    }
    case "listItem": {
      const inner = node.content?.map(nodeToHtml).join("") ?? "";
      return `<li>${inner}</li>`;
    }
    case "hardBreak":
      return "<br />";
    default:
      if (node.text) return wrapMarks(node.text, node.marks);
      if (node.content) return node.content.map(nodeToHtml).join("");
      return "";
  }
}

function inlineToHtml(content?: JSONContent[]): string {
  if (!content) return "";
  return content.map((n) => {
    if (n.type === "hardBreak") return "<br />";
    if (n.text) return wrapMarks(n.text, n.marks);
    return nodeToHtml(n);
  }).join("");
}

function wrapMarks(text: string, marks?: Array<{ type: string; attrs?: Record<string, unknown> }>): string {
  if (!marks) return text;
  let result = text;
  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        result = `<strong>${result}</strong>`;
        break;
      case "italic":
        result = `<em>${result}</em>`;
        break;
      case "underline":
        result = `<u>${result}</u>`;
        break;
      case "strike":
        result = `<s>${result}</s>`;
        break;
      case "code":
        result = `<code>${result}</code>`;
        break;
    }
  }
  return result;
}
