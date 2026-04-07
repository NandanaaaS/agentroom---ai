//backend/agents/orchestrator.js
import "../config/env.js";
import { researchAgent } from "./researcher.js";
import { writerAgent } from "./writer.js";
import { editorAgent } from "./editor.js";

export async function runCampaign(content, tone) {
  let logs = [];

  logs.push("Research Agent analyzing...");

  const factSheetRaw = await researchAgent(content);

  let factSheet;
  try {
    factSheet = JSON.parse(factSheetRaw);
  } catch (err) {
    console.error("Invalid JSON from Research Agent:", factSheetRaw);
    throw new Error("Research Agent returned invalid JSON");
  }

  logs.push("Copywriter generating content...");

  let draft = await writerAgent(JSON.stringify(factSheet), tone);
  let review;  
  let attempts = 0;
    const MAX_ATTEMPTS = 4;

    while (attempts < MAX_ATTEMPTS) {
        logs.push(`🔁 Attempt ${attempts + 1}/${MAX_ATTEMPTS}`);
      review = await editorAgent(draft, JSON.stringify(factSheet));

      if (review.status === "APPROVED") {
        logs.push("✅ Editor approved content");
        break;
      }

      logs.push("❌ Editor rejected: " + review.issues.join(", "));
      logs.push("🔧 Fixing content based on feedback...");

      draft = await writerAgent(
        JSON.stringify(factSheet),
        tone,
        review.fix_instructions
      );

      attempts++;
    }
  if (review.status==="APPROVED"){
    logs.push("Final content approved");
  }
  else{
    logs.push("⚠️ Max attempts reached. Using best version.");
  }
  

  return {
    factSheet,
    finalContent: draft,
    logs,
  };
}