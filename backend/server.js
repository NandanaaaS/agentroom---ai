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


// REMOVED: upload.single("file") from here. 
// It is already inside your workflow.js, so we don't need it twice.
app.use("/api/workflow", workFlowRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});