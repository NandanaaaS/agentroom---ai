export interface ContentData {
  blog: string;
  social: string[];
  email: string;
}

export function parseContent(raw: string): ContentData {
  const result: ContentData = { blog: "", social: [], email: "" };
  if (!raw) return result;

  // 1. Find indices of each section
  // We look for common markers like **Blog**, # Social, 3. Email
  const blogIdx = raw.search(/(?:^|\n)(?:\*\*|##|#|[ \t]*\d\.?[ \t]*)(?:Blog)/i);
  const socialIdx = raw.search(/(?:^|\n)(?:\*\*|##|#|[ \t]*\d\.?[ \t]*)(?:Social|Post|Thread)/i);
  const emailIdx = raw.search(/(?:^|\n)(?:\*\*|##|#|[ \t]*\d\.?[ \t]*)(?:Email|Teaser|Campaign)/i);

  const anchors = [
    { type: 'blog', index: blogIdx },
    { type: 'social', index: socialIdx },
    { type: 'email', index: emailIdx }
  ].filter(a => a.index !== -1).sort((a, b) => a.index - b.index);

  const sections: Record<string, string> = {};

  anchors.forEach((anchor, i) => {
    const start = anchor.index;
    const end = anchors[i + 1] ? anchors[i + 1].index : raw.length;
    let content = raw.slice(start, end).trim();
    
    // This removes the header line itself so it doesn't appear in your UI
    content = content.replace(/^(?:\*\*|##|#|[ \t]*\d\.?[ \t]*)*(?:Blog|Social|Email|Post|Teaser|Campaign)[^]*?\n/i, "").trim();
    sections[anchor.type] = content;
  });

  result.blog = sections.blog || "";
  result.email = sections.email || "";

  // 2. Process Social Posts Array
  if (sections.social) {
    const posts = sections.social
      .split(/(?:\n|^)(?:Post\s*\d+[:.]?|\d+[:.]|[•\-\*])\s*/i)
      .map(p => p.trim())
      .filter(p => p.length > 10);

    result.social = posts.length > 0 ? posts : [sections.social];
  }

  // Fallback if split failed
  if (!result.blog && !result.social.length && !result.email) {
    result.blog = raw.trim();
  }

  return result;
}