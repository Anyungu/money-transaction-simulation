import type { NextFunction, Response, Request } from "express";
import type {
  PageQueryParams,
  TransferFunds,
} from "../../lib/types/transaction.types.ts";
import {
  paginationSchema,
  transferFundsSchema,
} from "../../validators/user.validators.ts";
import BadRequestError from "../../errors/BadRequestError.ts";
import {
  createTransaction,
  getUserBalance,
  getUserById,
  getUserTransactionHistory,
} from "./transaction.service.ts";
import { transactionQueue } from "../../jobs/queues/transaction.queue.ts";
import redisClient from "../../config/redis.ts";
import logger from "../../lib/utils/logger.ts";

export const sendUserFundsController = async (
  req: Request<unknown, unknown, TransferFunds>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const senderId = req.user.userId;
    const { amount, receiverId } = req.body;

    const validation = transferFundsSchema.safeParse({
      senderId,
      receiverId,
      amount,
    });
    if (!validation.success) {
      throw new BadRequestError({
        code: 400,
        message: JSON.stringify(validation.error),
        customMessage: "Bad Request",
        logging: true,
      });
    }

    const [senderBalance] = await Promise.all([
      getUserBalance(senderId),
      getUserById(receiverId),
    ]);

    if (amount >= senderBalance) {
      throw new BadRequestError({
        code: 400,
        message: "Insufficient funds",
        customMessage: "Insufficient funds",
        logging: true,
      });
    }

    const createdTransaction = await createTransaction(
      senderId,
      receiverId,
      amount
    );

    await transactionQueue.add("process-transaction", {
      senderId,
      receiverId,
      amount,
      transactionId: createdTransaction.id,
      reference: createdTransaction.reference,
    });
    logger.info({ ...createdTransaction }, "Transaction initiated");
    res.status(200).json(createdTransaction);
  } catch (error) {
    next(error);
  }
};

export const getUserTransactionsController = async (
  req: Request<unknown, unknown, unknown, PageQueryParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.userId;
    const { success, data, error } = paginationSchema.safeParse(req.query);

    if (!success) {
      throw new BadRequestError({
        code: 400,
        message: JSON.stringify(error),
        customMessage: "Bad Request",
        logging: true,
      });
    }
    const { size, page } = data;

    const skip = (data.page - 1) * data.size;

    const cacheKey = `transactions:${userId}:page-${page}:size-${size}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const cachedTransactions = JSON.parse(cachedData);
      logger.info(
        { ...cachedTransactions, userId, page, size },
        "Transactions fetched from cache"
      );
      res.status(200).json(cachedTransactions);
      return;
    }

    const transactions = await getUserTransactionHistory(
      userId,
      page,
      size,
      skip
    );
    await redisClient.setex(cacheKey, 600, JSON.stringify(transactions));

    logger.info(
      { ...transactions, userId, page, size },
      "Transactions fetched from db"
    );

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
