"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
var uuid_1 = require("uuid");
var logger_ts_1 = require("../lib/utils/logger.ts");
var loggerMiddleware = function (req, res, next) {
    var requestId = (0, uuid_1.v4)();
    req.headers["x-request-id"] = requestId;
    var method = req.method, hostname = req.hostname, path = req.path, query = req.query, body = req.body;
    logger_ts_1.default.info({
        timestamp: new Date().toISOString(),
        requestId: requestId,
        method: method,
        hostname: hostname,
        path: path,
        query: query,
        body: method !== "GET" ? body : undefined,
    });
    res.setHeader("X-Request-ID", requestId);
    next();
};
exports.loggerMiddleware = loggerMiddleware;
