import express from "express";
import { runCampaign } from "../agents/orchestrator.js";

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const { content, tone } = req.body;

    const result = await runCampaign(content, tone);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;