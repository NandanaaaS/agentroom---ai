// backend/agents/writer.js
import "../config/env.js";
import axios from "axios";

export async function writerAgent(factSheet, tone, fix = "") {
  const systemPrompt = `You are a world-class Marketing Copywriter. 
Your goal is to turn a Product Fact Sheet into a cohesive Campaign Kit.
You MUST output three sections clearly labeled with:
# Blog
# Social
# Email

CRITICAL: Start your response immediately with # Blog. 
Do NOT repeat the instructions, role, or input data in your response.
If the price is "Not provided", write "Contact for pricing."`;

  const userPrompt = `
### INPUT DATA
### IMPORTANT
- You MUST highlight the "value_proposition" from the input strongly across Blog, Social, and Email.
${factSheet}

### TONE
${tone}

### USER REQUESTS (FIXES)
${fix || "None"}

### CONSTRAINTS (MANDATORY)
1. **Blog**: Write a compelling, detailed blog post using markdown.
2. **Social**: You MUST write EXACTLY 5 distinct posts. 
   - Label them as "Post 1:", "Post 2:", etc.
   - Do NOT include image descriptions like "Image: A photo of..." or "*Image:*". 
   - Only provide the text/captions for the posts.
3. **Email**: Provide a Subject Line and a clear Body.

Begin your response now.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1500, // Slightly increased to ensure 5 posts + Blog + Email fit
        temperature: 0.7, 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AgentRoom AI"    
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("WRITER_AGENT_ERROR:", err.message);
    throw new Error("The Copywriter Agent failed.");
  }
}