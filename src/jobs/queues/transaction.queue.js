"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionQueue = void 0;
var bullmq_1 = require("bullmq");
var redis_ts_1 = require("../../config/redis.ts");
exports.transactionQueue = new bullmq_1.Queue("transactions", {
    connection: redis_ts_1.default,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
    },
});
