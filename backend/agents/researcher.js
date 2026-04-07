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
            content: `You are a data extraction specialist. Output ONLY a flat JSON object.
            ### RULES:
            1. **Price**: If you see "units sold", "reviews", or "recommendations", IGNORE those numbers. 
            2. **Price**: Only extract a price if it is clearly a retail cost (usually has $, ₹, £, or says "Price:").
            3. **Price**: If no retail price is found, set "price": "Not provided".
            4. **Brief**: Keep 'features' as a simple array of strings. Do not truncate.
            5. **Value Proposition**: Identify the SINGLE most important selling point of the product from the text.
            6. **Ambiguities**: Identify unclear or missing information that could confuse a buyer.

            ### OUTPUT FORMAT:
            {
              "product_name": "Name",
              "features": ["feature 1", "feature 2"],
              "price": "Symbol + Value or Not provided",
              "target_audience": "Audience",
              "value_proposition": "Main selling point derived from input",
              "ambiguities": ["unclear point 1", "unclear point 2"]
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