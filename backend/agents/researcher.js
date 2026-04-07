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
            content: `You are a strict data extraction and normalization engine.

You MUST follow ALL rules exactly. Do NOT ignore any rule.

### RULES:

1. PRICE:
- Ignore numbers related to reviews, ratings, or units sold.
- Extract ONLY real retail price (₹, $, £).
- If missing → "Not provided".

2. TARGET AUDIENCE:
- If not explicitly mentioned, infer logically (e.g., kitchen product → "Home cooks").
- NEVER return "Not specified".

3. FEATURES (CRITICAL - DO NOT DROP DATA):

STEP 1: Extract ALL features from input.
STEP 2: Clean and normalize them.

STRICT RULES:
- DO NOT reduce number of features unnecessarily
- Keep ALL meaningful features
- Each feature max 6–8 words
- Use sentence case (no ALL CAPS)

- Fix OCR typos:
  - IOOW → 100W
  - 10OW → 100W

- Merge broken lines into ONE feature

- Convert combined info:
  - "Color: Black/Grey/Blue" → "Available in multiple colors"

- REMOVE non-features:
  - Marketing phrases ("perfect for...", "best for...")
  - Generic fluff ("long-lasting performance")
  - Social proof (reviews, ratings, units sold)
  - Claims that are flagged as ambiguous

- KEEP only real features:
  → specs, capabilities, attributes (motor, blades, speeds, warranty, etc.)

4. VALUE PROPOSITION:
- Must be benefit-driven (NOT a feature)
- Must be broad and safe
- DO NOT include extreme/specific claims
- Example: "Fast and effortless food preparation"

5. AMBIGUITIES:

ONLY include:
- Missing critical info (e.g., price)
- Unrealistic or suspicious claims

STRICTLY DO NOT include:
- Units sold
- Reviews or ratings
- Popularity or social proof
- Marketing fluff

These must be completely ignored.

6. OUTPUT:
- Return ONLY valid JSON
- No explanation
- No markdown

### OUTPUT FORMAT:
{
  "product_name": "Name",
  "features": ["feature 1", "feature 2"],
  "price": "Symbol + Value or Not provided",
  "target_audience": "Audience",
  "value_proposition": "Main benefit",
  "ambiguities": ["issue 1", "issue 2"]
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