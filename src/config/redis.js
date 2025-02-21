"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = require("ioredis");
var env_ts_1 = require("./env.ts");
var redisClientSingleton = function () {
    return new ioredis_1.default({
        host: env_ts_1.env.REDIS_HOST,
        port: env_ts_1.env.REDIS_PORT,
        maxRetriesPerRequest: null,
    });
};
var redisClient = (_a = globalThis.redisGlobal) !== null && _a !== void 0 ? _a : redisClientSingleton();
exports.default = redisClient;
if (process.env.NODE_ENV !== "production")
    globalThis.redisGlobal = redisClient;
