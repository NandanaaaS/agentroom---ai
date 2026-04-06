import express from "express";
import mammoth from "mammoth";
import multer from "multer";
import { createRequire } from "module";
import { researchAgent } from "../agents/researcher.js";
import { writerAgent } from "../agents/writer.js";
import { editorAgent } from "../agents/editor.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔥 SSE STREAM ROUTE
router.post("/start-stream", upload.single("file"), async (req, res) => {
  try {
    const tone = req.body.tone || "professional";
    const content = req.body.content || "";
    let extractedText = "";

    // --- SSE HEADERS ---
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const send = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    send({ type: "log", message: "📥 Input received..." });

    // --- FILE PROCESSING (UNCHANGED LOGIC) ---
    if (req.file) {
      const mimetype = req.file.mimetype;

      if (
        mimetype.includes("officedocument.wordprocessingml.document") ||
        mimetype.includes("msword")
      ) {
        const result = await mammoth.extractRawText({
          buffer: req.file.buffer,
        });
        extractedText = result.value;
      } else if (mimetype.startsWith("image/") || mimetype === "application/pdf") {
        send({ type: "log", message: "🔍 Running OCR..." });

        const formData = new FormData();
        const fileBlob = new Blob([req.file.buffer], { type: mimetype });

        formData.append("file", fileBlob, req.file.originalname);
        formData.append("apikey", process.env.OCR_API_KEY);
        formData.append("OCREngine", "2");
        formData.append("isTable", "true");

        const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
          method: "POST",
          body: formData,
        });

        const ocrData = await ocrResponse.json();

        if (ocrData.OCRExitCode === 1) {
          extractedText = ocrData.ParsedResults.map((r) => r.ParsedText).join("\n");
        } else {
          throw new Error("OCR failed");
        }
      }
    }

    const finalInput = `${content}\n\n${extractedText}`.trim();

    if (!finalInput) {
      send({ type: "error", message: "No content detected." });
      return res.end();
    }

    // =========================
    // 🧠 RESEARCH AGENT
    // =========================
    send({ type: "agent", agent: "research", status: "thinking" });

    const factSheetRaw = await researchAgent(finalInput);
    let factSheet;

    try {
      factSheet = JSON.parse(factSheetRaw);
    } catch {
      send({ type: "error", message: "Research JSON failed" });
      return res.end();
    }

    send({ type: "agent", agent: "research", status: "done" });
    send({ type: "factsheet", data: factSheet });

    // =========================
    // ✍️ WRITER
    // =========================
    send({ type: "agent", agent: "writer", status: "writing" });

    let draft = await writerAgent(JSON.stringify(factSheet), tone);
    send({ type: "draft", data: draft });

    // =========================
    // 🧾 EDITOR LOOP
    // =========================
    let review = await editorAgent(draft, JSON.stringify(factSheet));
    let attempts = 0;

    while (review.status === "REJECTED" && attempts < 2) {
      send({
        type: "log",
        message: `❌ Editor rejected: ${review.issues.join(", ")}`,
      });

      send({ type: "agent", agent: "writer", status: "fixing" });

      draft = await writerAgent(
        JSON.stringify(factSheet),
        tone,
        review.fix_instructions
      );

      send({ type: "draft", data: draft });

      review = await editorAgent(draft, JSON.stringify(factSheet));
      attempts++;
    }

    send({ type: "agent", agent: "editor", status: "approved" });

    send({ type: "final", data: draft });

    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`);
    res.end();
  }
});

export default router;