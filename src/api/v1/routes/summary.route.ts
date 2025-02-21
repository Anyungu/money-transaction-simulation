import express from "express";
import { authRouter } from "./auth.route.ts";
import { loggerMiddleware } from "../../../middleware/logger.ts";
import { errorHandler } from "../../../middleware/error.ts";
import { transactionRouter } from "./transaction.route.ts";
import { rateLimiter } from "../../../middleware/limiter.ts";
import { authGuard } from "../../../middleware/auth.ts";
import { docsRouter } from "./docs.route.ts";


const apiRouter = express.Router();

apiRouter.use(loggerMiddleware);
apiRouter.use(rateLimiter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/docs", docsRouter)
apiRouter.use("/transaction", authGuard, transactionRouter);
apiRouter.use(errorHandler);

export default apiRouter;
