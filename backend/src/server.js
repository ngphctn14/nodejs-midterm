import dotenv from "dotenv";
import cors from "cors";
import express from "express";

import feedbackRouter from "./feedback.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hellodfdsafds");
});

app.use("/api/feedback", feedbackRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});