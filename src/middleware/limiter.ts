import type { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis.ts";
import logger from "../lib/utils/logger.ts";
import { env } from "../config/env.ts";

const { LIMITER_WINDOW_MS, LIMITER_MAX_REQUESTS } = env;

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;
  const key = `rate-limit:${ip}`;

  const currentCount = await redisClient.incr(key);

  if (currentCount === 1) {
    await redisClient.expire(key, LIMITER_WINDOW_MS);
  }

  if (currentCount > LIMITER_MAX_REQUESTS) {
    logger.info({ ip }, "Too many requests");
    res.status(429).json({ message: "Too many requests, try again later." });
  }

  next();
};
