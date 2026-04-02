// backend/agents/researcher.js
import "../config/env.js";
import axios from "axios";

export async function researchAgent(content) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: `You are a data extractor. Extract info into a FLAT JSON object. 
            Keep 'features' as a simple array of strings, NOT objects. 
            Be extremely brief to avoid truncation.
            
            Format:
            {
              "product_name": "Name",
              "features": ["feature 1", "feature 2"],
              "price": 0,
              "target_audience": "Audience"
            }`
          },
          {
            role: "user",
            content: `Extract from this text: ${content}`
          },
        ],
        // Force the AI to finish early
        max_tokens: 300, 
        temperature: 0.1, // Lower temperature makes it more stable/less "creative"
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

    let raw = response.data.choices[0].message.content.trim();

    // Clean up any potential markdown code blocks
    raw = raw.replace(/```json|```/g, "").trim();

    // Surgical extraction of the JSON object
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    
    if (start !== -1 && end !== -1) {
      raw = raw.substring(start, end + 1);
    }

    // --- AUTO-FIX FOR TRUNCATED JSON ---
    // If the AI still cuts off, we try to close the brackets manually
    if (!raw.endsWith("}")) {
        console.log("⚠️ JSON was cut off. Attempting manual closure...");
        if (raw.includes("[") && !raw.includes("]")) raw += '"]';
        raw += "}";
    }

    return raw;
  } catch (err) {
    console.error("RESEARCH_AGENT_ERROR:", err.response?.data || err.message);
    throw err;
  }
}