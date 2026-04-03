import express from "express";
import mammoth from "mammoth"; // Keep this
import multer from "multer";
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

      // 1. Handle WORD DOCS (.docx) -> Keep Mammoth, it works!
      if (mimetype.includes("officedocument.wordprocessingml.document") || mimetype.includes("msword")) {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        extractedText = result.value;
      } 
      
      // 2. Handle IMAGES & PDFs -> Use OCR.space (High Accuracy)
      else if (mimetype.startsWith("image/") || mimetype === "application/pdf") {
        console.log("🚀 Using High-Accuracy Engine for", mimetype);
        
        const formData = new FormData();
        const fileBlob = new Blob([req.file.buffer], { type: mimetype });
        formData.append("file", fileBlob, req.file.originalname);
        formData.append("apikey", process.env.OCR_API_KEY); // Replace "helloworld" with your free key from ocr.space
        formData.append("OCREngine", "2"); // Engine 2 is best for complex layouts
        formData.append("isTable", "true"); // Helps with those specs/feature lists

        const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
          method: "POST",
          body: formData,
        });

        const ocrData = await ocrResponse.json();

        if (ocrData.OCRExitCode === 1) {
          // Combine all pages if it's a multi-page PDF
          extractedText = ocrData.ParsedResults.map(res => res.ParsedText).join("\n");
          console.log(`✅ Extraction successful! (${extractedText.length} chars)`);
        } else {
          throw new Error(ocrData.ErrorMessage || "OCR Provider failed.");
        }
      }
    }

    // 3. Combine everything
    const finalInput = `${content} \n\n ${extractedText}`.trim();

    if (!finalInput) {
      return res.status(400).json({ error: "No content detected. Please type something or upload a file." });
    }

    console.log(`[Backend] Orchestrating campaign for ${finalInput.length} characters.`);
    const result = await runCampaign(finalInput, tone);
    
    res.json(result);

  } catch (err) {
    console.error("AGENT_ROOM_CRASH:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

export default router;