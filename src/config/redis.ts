import Redis from "ioredis";
import { env } from "./env.ts";

const redisClientSingleton = () =>
  new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    maxRetriesPerRequest: null,
  });

declare const globalThis: {
  redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

const redisClient: Redis = globalThis.redisGlobal ?? redisClientSingleton();

export default redisClient;

if (process.env.NODE_ENV !== "production") globalThis.redisGlobal = redisClient;
