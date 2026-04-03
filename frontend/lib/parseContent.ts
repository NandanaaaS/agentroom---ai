export interface ContentData {
  blog: string;
  social: string[];
  email: string;
}

export function parseContent(raw: string): ContentData {
  const result: ContentData = { blog: "", social: [], email: "" };
  if (!raw) return result;

  // 1. IMPROVED ANCHORS: Catch headers even if they are just #Blog or **Blog**
  const blogIdx = raw.search(/(?:^|\n)[#* \t]*Blog/i);
  const socialIdx = raw.search(/(?:^|\n)[#* \t]*Social/i);
  const emailIdx = raw.search(/(?:^|\n)[#* \t]*Email/i);

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
    
    // Wipe out the header line itself
    content = content.replace(/^[#* \t]*(?:Blog|Social|Email)[^\n]*\n/i, "").trim();
    sections[anchor.type] = content;
  });

  result.blog = sections.blog || "";
  result.email = sections.email || "";

  // 2. THE FIX FOR MULTIPLE SOCIAL CARDS
  if (sections.social) {
    // This Regex looks for "Post 1:", "Post 2", "Post 1.", etc. 
    // It captures them even if they don't have a newline before them!
    const posts = sections.social
      .split(/(?=Post\s*\d+[:.]?)/i) // Use lookahead so we don't delete the "Post 1" label
      .map(p => p.trim())
      .filter(p => p.length > 15); 

    result.social = posts.length > 0 ? posts : [sections.social];
  }

  // Final fallback
  if (!result.blog && !result.social.length && !result.email) {
    result.blog = raw.trim();
  }

  return result;
}