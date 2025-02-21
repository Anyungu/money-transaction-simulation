"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var zod_1 = require("zod");
var envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    DIRECT_URL: zod_1.z.string().url(),
    PORT: zod_1.z.coerce.number().int().positive().default(8080),
    JWT_SECRET: zod_1.z
        .string()
        .min(32, "JWT_SECRET must be at least 32 characters long"),
    BCRYPT_SALT: zod_1.z.coerce.number().int().positive().default(10),
    REDIS_HOST: zod_1.z.string().default("localhost"),
    REDIS_PORT: zod_1.z.coerce.number().int().positive().default(6379),
    LIMITER_WINDOW_MS: zod_1.z.coerce.number().int().positive().default(900),
    LIMITER_MAX_REQUESTS: zod_1.z.coerce.number().int().positive().default(100),
});
exports.env = envSchema.parse(process.env);
