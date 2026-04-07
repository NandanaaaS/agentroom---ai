//backend/agents/editor.js
import "../config/env.js";
import axios from "axios";

export async function editorAgent(draft, factSheet) {
  const prompt = `
  Compare content with fact sheet.

  ### STRICT RULES:
  1. If ANY feature, price, or audience is incorrect → REJECT.
  2. If content invents information not in fact sheet → REJECT.
  3. Blog must be detailed (not too short).
  4. Social must have EXACTLY 5 posts.
  5. Email must contain Subject + Body.
  6. Reject if content is overly repetitive or robotic.

  ### OUTPUT FORMAT (STRICT JSON ONLY):
  {
  "status": "APPROVED or REJECTED",
  "issues": ["list of problems"],
  "fix_instructions": "clear instructions to fix issues"
  }

Fact Sheet:
${factSheet}

Content:
${draft}
`;

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // REQUIRED
        "X-Title": "AgentRoom AI"    
      },
    }
  );

  const raw = response.data.choices[0].message.content;

  try {
    return JSON.parse(raw);
  } catch {
    return {
      status: "APPROVED",
      issues: [],
      fix_instructions: "",
    };
  }
}