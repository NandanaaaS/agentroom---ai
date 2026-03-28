import "../config/env.js";
import axios from "axios";
//This is the Research Agent - it takes raw content and extracts a structured fact sheet in JSON format. This fact sheet is then used by the Writer and Editor agents to create and refine content.
export async function researchAgent(content) {
    try{
 const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        {
          role: "system",
          content: `
            Extract product info and return ONLY valid JSON.
            Extract ALL features mentioned (do not miss any)
            Rules:
            - No markdown
            - No explanation
            - Must be valid JSON
            - Close all brackets
            - Use snake_case keys

            Format:
            {
            "product_name": "",
            "features": [],
            "price": 0,
            "target_audience": ""
            }
            `,
        },
        {
          role: "user",
          content: content,
        },
      ],
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
}catch (err) {
  console.log("FULL ERROR:", err.response?.data || err.message);
  throw err;
}
}
 