import prisma from "../../config/db.ts";
import type { CreatedTransaction } from "../../lib/types/user.types.ts";
import BadRequestError from "../../errors/BadRequestError.ts";

export const getUserBalance = async (senderId: string) => {
  const sender = await getUserById(senderId);
  return sender.balance;
};

export const getUserById = async (userId: string) => {
  const sender = await prisma.user.findUnique({
    where: { id: userId },
    select: { balance: true },
  });

  if (!sender) {
    throw new BadRequestError({
      code: 404,
      message: "user not found",
      customMessage: "user not found",
      logging: true,
    });
  }

  return sender;
};

export const createTransaction = async (
  senderId: string,
  receiverId: string,
  amount: number
): Promise<CreatedTransaction> => {
  const transaction = await prisma.transaction.create({
    data: {
      senderId,
      receiverId,
      amount,
      status: "PENDING",
    },
    select: {
      id: true,
      reference: true,
      status: true,
    },
  });
  return transaction;
};

export const processTransaction = async (transactionId: string) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      select: { senderId: true, receiverId: true, amount: true },
    });

    if (!transaction) throw new Error("Invalid Transaction");

    await prisma.$transaction(async (tx) => {
      const result = await tx.user.updateMany({
        where: {
          id: transaction.senderId,
          balance: { gte: transaction.amount },
        },
        data: { balance: { decrement: transaction.amount } },
      });

      if (result.count === 0) {
        throw new Error("Insufficient balance");
      }

      await Promise.all([
        tx.user.update({
          where: { id: transaction.receiverId },
          data: { balance: { increment: transaction.amount } },
        }),
        tx.transaction.update({
          where: { id: transactionId },
          data: { status: "COMPLETED" },
        }),
      ]);
    });
  } catch (error) {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "FAILED" },
    });
  }
};

export const getUserTransactionHistory = async (
  userId: string,
  page: number,
  pageSize: number,
  skip: number
) => {
  const transactionsQuery = prisma.$queryRaw`
      SELECT *,
        CASE 
          WHEN "senderId" = ${userId} THEN 'OUTGOING' 
          ELSE 'INCOMING' 
        END as type
      FROM "Transaction"
      WHERE "senderId" = ${userId} OR "receiverId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT ${Number(pageSize)} OFFSET ${skip};
    `;

  const totalFnQuery = prisma.transaction.count({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
  });

  const [transactions, total] = await Promise.all([
    transactionsQuery,
    totalFnQuery,
  ]);

  console.log(transactions);

  return {
    transactions,
    pagination: {
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(total / Number(pageSize)),
    },
  };
};
