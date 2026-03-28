import "../config/env.js";
import axios from "axios";

export async function writerAgent(factSheet, tone, fix = "") {
  const prompt = `
Use this fact sheet:
${factSheet}

Tone: ${tone}

Fix instructions: ${fix}

Generate:
1. Blog (500 words)
2. Social thread (5 posts)
3. Email teaser
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

  return response.data.choices[0].message.content;
}