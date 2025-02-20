import type { TransactionStatus } from "@prisma/client";

export type UserLogin = { email: string; password: string };
export type UserSignUp = UserLogin & {
  password: string;
  firstName?: string;
  lastName?: string;
};

export type CreatedTransaction = {
  id: string;
  reference: string;
  status: TransactionStatus;
};
