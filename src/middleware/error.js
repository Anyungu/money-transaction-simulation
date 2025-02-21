"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var CustomError_ts_1 = require("../errors/CustomError.ts");
var logger_ts_1 = require("../lib/utils/logger.ts");
var errorHandler = function (err, req, res, next) {
    var requestId = req.headers["x-request-id"] || "N/A";
    if (err instanceof CustomError_ts_1.CustomError) {
        var statusCode = err.statusCode, errors = err.errors, logging = err.logging, message = err.message;
        if (logging) {
            logger_ts_1.default.error({
                requestId: requestId,
                statusCode: statusCode,
                errors: errors,
                stack: err.stack,
            });
        }
        res.status(statusCode).json({
            error: {
                message: err.message,
            },
        });
    }
    else {
        logger_ts_1.default.error({
            requestId: requestId,
            message: err.message,
            stack: err.stack,
        });
        res.status(500).json({
            error: {
                message: err.message,
            },
        });
    }
};
exports.errorHandler = errorHandler;
