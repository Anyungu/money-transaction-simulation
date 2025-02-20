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
  getUserTransactionHistory,
} from "./transaction.service.ts";
import { transactionQueue } from "../../jobs/queues/transaction.queue.ts";

export const sendUserFundsController = async (
  req: Request<unknown, unknown, TransferFunds>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const senderId = req.user.id;
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

    const userBalance = await getUserBalance(senderId);

    if (amount >= userBalance) {
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
    const userId = req.user.id;
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

    if (size === -1) {
      // Fetch all records logic
    }
    const skip = (data.page - 1) * data.size;

    res
      .status(200)
      .json(await getUserTransactionHistory(userId, page, size, skip));
  } catch (error) {
    next(error);
  }
};
