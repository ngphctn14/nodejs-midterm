import express from "express";
import prisma from "./utils/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, category, message } = req.body;
    const feedback = await prisma.feedback.create({
      data: { name, email, category, message },
    });
    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

router.get("/", async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.feedback.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

export default router;