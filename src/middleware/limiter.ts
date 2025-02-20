import type { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis.ts";
import logger from "../lib/utils/logger.ts";

const WINDOW_MS = 15 * 60;
const MAX_REQUESTS = 100;

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;
  const key = `rate-limit:${ip}`;

  const currentCount = await redisClient.incr(key);

  if (currentCount === 1) {
    await redisClient.expire(key, WINDOW_MS);
  }

  if (currentCount > MAX_REQUESTS) {
    logger.info({ ip }, "Too many requests");
    res.status(429).json({ message: "Too many requests, try again later." });
  }

  next();
};
