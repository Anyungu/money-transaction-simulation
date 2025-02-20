import type { NextFunction, Response, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import logger from "../lib/utils/logger.ts";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = uuidv4();
  req.headers["x-request-id"] = requestId;

  const { method, hostname, path, query, body } = req;

  logger.info({
    timestamp: new Date().toISOString(),
    requestId,
    method,
    hostname,
    path,
    query,
    body: method !== "GET" ? body : undefined,
  });

  res.setHeader("X-Request-ID", requestId);

  next();
};
