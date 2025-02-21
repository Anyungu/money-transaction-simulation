"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
var auth_ts_1 = require("../lib/utils/auth.ts");
var logger_ts_1 = require("../lib/utils/logger.ts");
var authGuard = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger_ts_1.default.warn({ requestId: req.headers["x-request-id"] || "N/A" }, "Unauthorized access attempt");
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    var token = authHeader.split(" ")[1];
    logger_ts_1.default.info({ requestId: req.headers["x-request-id"] || "N/A", token: token }, "Received Token");
    try {
        var decoded = (0, auth_ts_1.verifyAccessToken)(token);
        logger_ts_1.default.info({ requestId: req.headers["x-request-id"] || "N/A", user: decoded }, "Token verified");
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_ts_1.default.error({ requestId: req.headers["x-request-id"] || "N/A", error: error }, "Token Verification Failed");
        res.status(403).json({ message: "Invalid token" });
    }
};
exports.authGuard = authGuard;
