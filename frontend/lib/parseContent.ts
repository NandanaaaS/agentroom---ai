// frontend/lib/parseContent.ts

export interface ContentData {
  blog: string;
  social: string[];
  email: string;
}

export function parseContent(raw: string): ContentData {
  const result: ContentData = { blog: "", social: [], email: "" };
  if (!raw) return result;

  const blogIdx = raw.search(/(?:^|\n)[#* \t]*Blog/i);
  const socialIdx = raw.search(/(?:^|\n)[#* \t]*Social/i);
  const emailIdx = raw.search(/(?:^|\n)[#* \t]*Email/i);

  const anchors = [
    { type: "blog", index: blogIdx },
    { type: "social", index: socialIdx },
    { type: "email", index: emailIdx },
  ]
    .filter((a) => a.index !== -1)
    .sort((a, b) => a.index - b.index);

  const sections: Record<string, string> = {};

  anchors.forEach((anchor, i) => {
    const start = anchor.index;
    const end = anchors[i + 1] ? anchors[i + 1].index : raw.length;
    let content = raw.slice(start, end).trim();

    content = content
      .replace(/^[#* \t]*(?:Blog|Social|Email)[^\n]*\n/i, "")
      .trim();

    sections[anchor.type] = content;
  });

  result.blog = sections.blog || "";
  result.email = sections.email || "";

  if (sections.social) {
    const socialRaw = sections.social
      .replace(/Here are .*?social media posts.*?:/i, "")
      .trim();

    let posts = socialRaw
      .split(/(?=Post\s*\d+[:.]?)/i)
      .map((p) => p.trim())
      .filter((p) => p.length > 15);

    if (posts.length <= 1) {
      posts = socialRaw
        .split(/\n\s*\*\s*\n|\n{2,}/)
        .map((p) => p.replace(/^\*+\s*/, "").trim())
        .filter((p) => p.length > 20);
    }

    result.social = posts.length > 0 ? posts : [socialRaw];
  }

  if (!result.blog && !result.social.length && !result.email) {
    result.blog = raw.trim();
  }

  return result;
}