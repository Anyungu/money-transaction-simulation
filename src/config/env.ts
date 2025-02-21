import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(8080),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),
  BCRYPT_SALT: z.coerce.number().int().positive().default(10),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  LIMITER_WINDOW_MS: z.coerce.number().int().positive().default(900),
  LIMITER_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
});

export const env = envSchema.parse(process.env);
