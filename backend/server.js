// backend/server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import workFlowRoutes from "./routes/workflow.js";

const app = express();

app.use(cors());

// IMPORTANT: Keep express.json() but it only handles raw JSON, 
// not the FormData/Files you are sending now.
app.use(express.json());

// --- API Key Middleware ---
app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  const apiKey = authHeader?.split(" ")[1]; 

  if (!apiKey || apiKey !== process.env.BACKEND_API_KEY) {
    console.log("❌ Unauthorized attempt");
    return res.status(401).json({ error: "Unauthorized. Missing or invalid API key." });
  }
  next();
});

// REMOVED: upload.single("file") from here. 
// It is already inside your workflow.js, so we don't need it twice.
app.use("/api/workflow", workFlowRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});