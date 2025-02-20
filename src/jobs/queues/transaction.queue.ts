import { Queue } from "bullmq";
import redisClient from "../../config/redis.ts";

export const transactionQueue = new Queue("transactions", {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  },
});
