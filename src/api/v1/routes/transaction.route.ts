import express from "express";
import {
  getUserTransactionsController,
  sendUserFundsController,
} from "../../../modules/transaction/transaction.controller.ts";

export const transactionRouter = express.Router();

transactionRouter.route("/user/send").post(sendUserFundsController);
transactionRouter
  .route("/user/transactions")
  .get(getUserTransactionsController);
