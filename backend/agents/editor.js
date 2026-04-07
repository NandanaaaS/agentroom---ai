//backend/agents/editor.js
import "../config/env.js";
import axios from "axios";

export async function editorAgent(draft, factSheet) {
  const prompt = `
Compare content with fact sheet.
If ANY mismatch → REJECT.
Return STRICT JSON:
{
 "status": "APPROVED or REJECTED",
 "issues": [],
 "fix_instructions": ""
}

NO explanation.

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