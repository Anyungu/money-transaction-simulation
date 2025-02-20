import Redis from "ioredis";

const redisClientSingleton = () =>
  new Redis(process.env.REDIS_URL || "redis://localhost:63791");

declare const globalThis: {
  redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

const redisClient: Redis = globalThis.redisGlobal ?? redisClientSingleton();

export default redisClient;

if (process.env.NODE_ENV !== "production") globalThis.redisGlobal = redisClient;
