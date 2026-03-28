import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import workFlowRoutes from "./routes/workflow.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/workflow", workFlowRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});