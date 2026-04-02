import express from "express";
import mammoth from "mammoth"; // Keep this
import multer from "multer";
import Tesseract from "tesseract.js";
import { runCampaign } from "../agents/orchestrator.js";
import { createRequire } from "module";

// Fix for pdf-parse ESM compatibility
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/start", upload.single("file"), async (req, res) => {
  try {
    const tone = req.body.tone || "professional";
    const content = req.body.content || ""; 
    
    let extractedText = "";

    if (req.file) {
      const mimetype = req.file.mimetype;
      console.log(`[Backend] Processing file: ${req.file.originalname} (${mimetype})`);

      // 1. Handle PDF
      if (mimetype === "application/pdf") {
        try {
          const data = await pdf(req.file.buffer);
          extractedText = data.text;
        } catch (pdfErr) {
          console.error("PDF Parsing Error:", pdfErr);
          throw new Error("Could not read PDF content.");
        }
      } 
      // 2. Handle WORD DOCS (.docx)
      else if (
        mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        mimetype === "application/msword"
      ) {
        try {
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          extractedText = result.value; // Mammoth returns text in the .value property
        } catch (docErr) {
          console.error("Word Doc Parsing Error:", docErr);
          throw new Error("Could not read Word document content.");
        }
      }
      // 3. Handle IMAGES
      else if (mimetype.startsWith("image/")) {
        try {
          const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');
          extractedText = text;
        } catch (ocrErr) {
          console.error("OCR Error:", ocrErr);
          throw new Error("Could not read text from image.");
        }
      }
    }

    // Combine manual text input + extracted file text
    const finalInput = `${content} \n\n ${extractedText}`.trim();

    // Validation
    if (!finalInput) {
      return res.status(400).json({ error: "Please provide either text description or a document/image." });
    }

    console.log(`[Backend] Starting Agent Orchestrator with ${finalInput.length} characters.`);

    const result = await runCampaign(finalInput, tone);
    res.json(result);

  } catch (err) {
    console.error("AGENT_ROOM_CRASH:", err);
    res.status(500).json({ error: err.message || "An internal error occurred in the Agent Room." });
  }
});

export default router;