export interface ContentData {
  blog: string;
  social: string[];
  email: string;
}

/**
 * Parses the finalContent string from the API response into structured sections.
 * Expects sections prefixed with BLOG:, SOCIAL:, EMAIL:
 */
export function parseContent(finalContent: string): ContentData {
  const result: ContentData = { blog: "", social: [], email: "" };

  // Split on known section headers
  const blogMatch = finalContent.match(/BLOG:\s*([\s\S]*?)(?=\nSOCIAL:|$)/i);
  const socialMatch = finalContent.match(/SOCIAL:\s*([\s\S]*?)(?=\nEMAIL:|$)/i);
  const emailMatch = finalContent.match(/EMAIL:\s*([\s\S]*?)$/i);

  if (blogMatch?.[1]) {
    result.blog = blogMatch[1].trim();
  }

  if (socialMatch?.[1]) {
    const raw = socialMatch[1].trim();
    // Split into individual posts by "Post N:" markers or double newlines
    const posts = raw
      .split(/\n(?=Post \d+:|^\d+\.)/im)
      .map(p => p.replace(/^Post \d+:\s*/i, "").trim())
      .filter(Boolean);

    if (posts.length > 0) {
      result.social = posts;
    } else {
      // Fallback: split by double newlines
      result.social = raw.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    }
  }

  if (emailMatch?.[1]) {
    result.email = emailMatch[1].trim();
  }

  return result;
}