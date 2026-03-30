// backend/server.js (or wherever your main app is)
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import workFlowRoutes from "./routes/workflow.js";

const app = express();

app.use(cors());
app.use(express.json());

// --- API Key Middleware ---
app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  const apiKey = authHeader?.split(" ")[1]; // Gets the part after "Bearer"

  if (!apiKey || apiKey !== process.env.BACKEND_API_KEY) {
    console.log("❌ Unauthorized attempt with key:", apiKey); // Check your backend terminal
    return res.status(401).json({ error: "Unauthorized. Missing or invalid API key." });
  }
  next();
});

app.use("/api/workflow", workFlowRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});