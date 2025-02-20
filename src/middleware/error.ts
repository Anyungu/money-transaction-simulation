import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError.ts";
import logger from "../lib/utils/logger.ts";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.headers["x-request-id"] || "N/A";

  if (err instanceof CustomError) {
    const { statusCode, errors, logging } = err;

    if (logging) {
      logger.error({
        requestId,
        statusCode,
        errors,
        stack: err.stack,
      });
    }

    res.status(statusCode).json({ errors });
  } else {
    logger.error({
      requestId,
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
