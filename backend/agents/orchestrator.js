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

  let review = await editorAgent(draft, JSON.stringify(factSheet));

  let attempts = 0;

  while (review.status === "REJECTED" && attempts < 2) {
    logs.push("Editor rejected: " + review.issues.join(", "));
    logs.push("Copywriter fixing content...");

    draft = await writerAgent(
      JSON.stringify(factSheet),
      tone,
      review.fix_instructions
    );

    review = await editorAgent(draft, JSON.stringify(factSheet));

    attempts++;
  }

  logs.push("Final content approved");

  return {
    factSheet,
    finalContent: draft,
    logs,
  };
}