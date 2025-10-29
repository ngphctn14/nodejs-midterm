import express from "express";
import prisma from "./utils/prisma.js";
import redis from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient
  .connect()
  .then(() => console.log("Redis client connected successfully."))
  .catch((err) => console.error("Could not connect to Redis:", err));

redisClient.on("error", (err) => console.error("Redis Client Error", err));

const DEFAULT_EXPIRATION = 60;

const clearFeedbackCache = async () => {
  if (!redisClient.isReady) return;
  try {
    let cursor = "0";
    do {
      const { keys, cursor: nextCursor } = await redisClient.scan(cursor, {
        MATCH: "feedback:*",
        COUNT: 100,
      });
      if (keys.length > 0) await redisClient.del(...keys);
      cursor = nextCursor;
    } while (cursor !== "0");
    console.log("All feedback caches invalidated.");
  } catch (err) {
    console.error("Error invalidating cache:", err);
  }
};


const router = express.Router();

// Disable browser caching
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

const fetchAndCache = async (cacheKey, queryFn) => {
  if (redisClient.isReady) {
    const redisStart = Date.now();
    const cached = await redisClient.get(cacheKey);
    const redisTime = Date.now() - redisStart;

    if (cached) {
      console.log(`Cache hit: ${cacheKey}`);
      console.log(`Redis fetch time: ${redisTime} ms`);
      return JSON.parse(cached);
    }

    console.log(`Cache miss: ${cacheKey}`);
    console.log(`Redis get time (miss): ${redisTime} ms`);
  }

  const dbStart = Date.now();
  const data = await queryFn();
  console.log(`DB fetch time for ${cacheKey}: ${Date.now() - dbStart} ms`);

  if (redisClient.isReady) {
    const setStart = Date.now();
    await redisClient.setEx(cacheKey, DEFAULT_EXPIRATION, JSON.stringify(data));
    console.log(`Redis set time: ${Date.now() - setStart} ms`);
  }

  return data;
};

// 📬 Create feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, category, message } = req.body;
    const feedback = await prisma.feedback.create({
      data: { name, email, category, message },
    });
    await clearFeedbackCache();
    return res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// 📥 Get all feedback
router.get("/", async (req, res) => {
  console.log(`Served by: ${process.env.HOSTNAME}`);
  try {
    const feedbacks = await fetchAndCache("feedback:all", () =>
      prisma.feedback.findMany({ orderBy: { createdAt: "desc" } })
    );
    return res.json(feedbacks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// 📥 Get by category
router.get("/category/:category", async (req, res) => {
  console.log(`Served by: ${process.env.HOSTNAME}`);
  try {
    const { category } = req.params;
    const feedbacks = await fetchAndCache(`feedback:category:${category}`, () =>
      prisma.feedback.findMany({
        where: { category },
        orderBy: { createdAt: "desc" },
      })
    );
    return res.json(feedbacks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch feedback by category" });
  }
});

// 📥 Get by status
router.get("/status/:status", async (req, res) => {
  console.log(`Served by: ${process.env.HOSTNAME}`);
  try {
    const { status } = req.params;
    const feedbacks = await fetchAndCache(`feedback:status:${status}`, () =>
      prisma.feedback.findMany({
        where: { status },
        orderBy: { createdAt: "desc" },
      })
    );
    return res.json(feedbacks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch feedback by status" });
  }
});

// 📝 Update feedback
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.feedback.update({
      where: { id: Number(id) },
      data: { status },
    });
    await clearFeedbackCache();
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update feedback" });
  }
});

// ❌ Delete feedback
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.feedback.delete({ where: { id: Number(id) } });
    await clearFeedbackCache();
    return res.json(deleted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete feedback" });
  }
});

export default router;
