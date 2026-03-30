export interface ContentData {
  blog: string;
  social: string[];
  email: string;
}

export function parseContent(raw: string): ContentData {
  const result: ContentData = { blog: "", social: [], email: "" };
  if (!raw) return result;

  // 1. Identify the starting positions of each section
  const blogIdx = raw.search(/(?:^|\n)(?:\d\.|\*\*|##|#|[ \t]*)(?:Blog)/i);
  const socialIdx = raw.search(/(?:^|\n)(?:\d\.|\*\*|##|#|[ \t]*)(?:Social|Post|Thread)/i);
  const emailIdx = raw.search(/(?:^|\n)(?:\d\.|\*\*|##|#|[ \t]*)(?:Email|Teaser)/i);

  // 2. Extract substrings based on those positions
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
    
    // Remove the header line itself (e.g., "**Social Media Posts**")
    content = content.replace(/^(?:\d\.|\*\*|##|#|[ \t]*)*(?:Blog|Social|Email|Post|Teaser)[^]*?\n/i, "").trim();
    sections[anchor.type] = content;
  });

  // 3. Map to result object
  result.blog = sections.blog || "";
  result.email = sections.email || "";

  // 4. Handle Social Posts Array
  if (sections.social) {
    const posts = sections.social
      .split(/(?:\n|^)(?:Post\s*\d+[:.]?|\d+[:.]|[•\-\*])\s*/i)
      .map(p => p.trim())
      .filter(p => p.length > 10);

    result.social = posts.length > 0 ? posts : [sections.social];
  }

  // Fallback: If everything failed, put raw text in blog
  if (!result.blog && !result.social.length && !result.email) {
    result.blog = raw.trim();
  }

  return result;
}