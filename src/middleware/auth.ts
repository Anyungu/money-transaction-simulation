import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/utils/auth.ts";
import logger from "../lib/utils/logger.ts";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn(
      { requestId: req.headers["x-request-id"] || "N/A" },
      "Unauthorized access attempt"
    );
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  logger.info(
    { requestId: req.headers["x-request-id"] || "N/A", token },
    "Received Token"
  );

  try {
    const decoded = verifyAccessToken(token);
    logger.info(
      { requestId: req.headers["x-request-id"] || "N/A", user: decoded },
      "Token verified"
    );
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(
      { requestId: req.headers["x-request-id"] || "N/A", error },
      "Token Verification Failed"
    );
    res.status(403).json({ message: "Invalid token" });
  }
};
