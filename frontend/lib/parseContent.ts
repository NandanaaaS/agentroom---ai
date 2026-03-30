export interface ContentData {
  blog: string;
  social: string;
  email: string;
}

/**
 * Parses the LLM's freeform finalContent string into blog / social / email sections.
 *
 * The writer agent prompt asks for:
 *   1. Blog (500 words)
 *   2. Social thread (5 posts)
 *   3. Email teaser
 *
 * In practice the model may use various headings. We try a cascade of strategies:
 *   1. Explicit BLOG: / SOCIAL: / EMAIL: uppercase labels (your mock format)
 *   2. Markdown headings (## Blog Post, # Social Media, etc.)
 *   3. Numbered sections (1. Blog …  2. Social …  3. Email …)
 *   4. Fallback — put everything in blog, leave others empty
 */
export function parseContent(raw: string): ContentData {
  if (!raw || typeof raw !== "string") {
    return { blog: "", social: "", email: "" };
  }

  // ── Strategy 1: explicit uppercase labels (BLOG:, SOCIAL:, EMAIL:) ──────────
  const upperResult = parseByUpperLabels(raw);
  if (upperResult) return upperResult;

  // ── Strategy 2: markdown headings ────────────────────────────────────────────
  const mdResult = parseByMarkdownHeadings(raw);
  if (mdResult) return mdResult;

  // ── Strategy 3: numbered sections ────────────────────────────────────────────
  const numberedResult = parseByNumberedSections(raw);
  if (numberedResult) return numberedResult;

  // ── Fallback ──────────────────────────────────────────────────────────────────
  return { blog: raw.trim(), social: "", email: "" };
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function clean(s: string): string {
  return s.trim();
}

function parseByUpperLabels(raw: string): ContentData | null {
  // Matches: BLOG:, SOCIAL:, SOCIAL MEDIA:, EMAIL:, EMAIL TEASER:
  // Also handles lowercase variants like "Blog:", "Social:", "Email:"
  const BLOG_RE    = /(?:^|\n)[ \t]*BLOG\s*:/i;
  const SOCIAL_RE  = /(?:^|\n)[ \t]*SOCIAL(?:\s+MEDIA)?(?:\s+THREAD)?(?:\s+POSTS?)?\s*:/i;
  const EMAIL_RE   = /(?:^|\n)[ \t]*EMAIL(?:\s+TEASER)?\s*:/i;

  const blogMatch   = BLOG_RE.exec(raw);
  const socialMatch = SOCIAL_RE.exec(raw);
  const emailMatch  = EMAIL_RE.exec(raw);

  // Need at least 2 of 3 to trust this strategy
  const found = [blogMatch, socialMatch, emailMatch].filter(Boolean).length;
  if (found < 2) return null;

  // Collect anchors sorted by position
  type Anchor = { key: "blog" | "social" | "email"; index: number; labelEnd: number };
  const anchors: Anchor[] = [];

  if (blogMatch)   anchors.push({ key: "blog",   index: blogMatch.index,   labelEnd: blogMatch.index   + blogMatch[0].length });
  if (socialMatch) anchors.push({ key: "social", index: socialMatch.index, labelEnd: socialMatch.index + socialMatch[0].length });
  if (emailMatch)  anchors.push({ key: "email",  index: emailMatch.index,  labelEnd: emailMatch.index  + emailMatch[0].length });

  anchors.sort((a, b) => a.index - b.index);

  const result: ContentData = { blog: "", social: "", email: "" };

  anchors.forEach((anchor, i) => {
    const start = anchor.labelEnd;
    const end   = i + 1 < anchors.length ? anchors[i + 1].index : raw.length;
    result[anchor.key] = clean(raw.slice(start, end));
  });

  return result;
}

function parseByMarkdownHeadings(raw: string): ContentData | null {
  // Match lines like: ## Blog Post, # Social Media Thread, ### Email Teaser
  const BLOG_RE   = /^#{1,3}\s+.*blog/im;
  const SOCIAL_RE = /^#{1,3}\s+.*social/im;
  const EMAIL_RE  = /^#{1,3}\s+.*email/im;

  const blogMatch   = BLOG_RE.exec(raw);
  const socialMatch = SOCIAL_RE.exec(raw);
  const emailMatch  = EMAIL_RE.exec(raw);

  const found = [blogMatch, socialMatch, emailMatch].filter(Boolean).length;
  if (found < 2) return null;

  type Anchor = { key: "blog" | "social" | "email"; index: number };
  const anchors: Anchor[] = [];
  if (blogMatch)   anchors.push({ key: "blog",   index: blogMatch.index });
  if (socialMatch) anchors.push({ key: "social", index: socialMatch.index });
  if (emailMatch)  anchors.push({ key: "email",  index: emailMatch.index });
  anchors.sort((a, b) => a.index - b.index);

  const result: ContentData = { blog: "", social: "", email: "" };
  anchors.forEach((anchor, i) => {
    const start = anchor.index;
    const end   = i + 1 < anchors.length ? anchors[i + 1].index : raw.length;
    result[anchor.key] = clean(raw.slice(start, end));
  });

  return result;
}

function parseByNumberedSections(raw: string): ContentData | null {
  // Matches: 1. Blog, 2. Social, 3. Email (with optional subtitles)
  const BLOG_RE   = /(?:^|\n)\s*1[.)]\s+(?:Blog|Content)/i;
  const SOCIAL_RE = /(?:^|\n)\s*2[.)]\s+(?:Social|Posts?|Thread)/i;
  const EMAIL_RE  = /(?:^|\n)\s*3[.)]\s+(?:Email|Teaser)/i;

  const blogMatch   = BLOG_RE.exec(raw);
  const socialMatch = SOCIAL_RE.exec(raw);
  const emailMatch  = EMAIL_RE.exec(raw);

  const found = [blogMatch, socialMatch, emailMatch].filter(Boolean).length;
  if (found < 2) return null;

  type Anchor = { key: "blog" | "social" | "email"; index: number };
  const anchors: Anchor[] = [];
  if (blogMatch)   anchors.push({ key: "blog",   index: blogMatch.index });
  if (socialMatch) anchors.push({ key: "social", index: socialMatch.index });
  if (emailMatch)  anchors.push({ key: "email",  index: emailMatch.index });
  anchors.sort((a, b) => a.index - b.index);

  const result: ContentData = { blog: "", social: "", email: "" };
  anchors.forEach((anchor, i) => {
    const start = anchor.index;
    const end   = i + 1 < anchors.length ? anchors[i + 1].index : raw.length;
    result[anchor.key] = clean(raw.slice(start, end));
  });

  return result;
}