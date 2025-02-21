"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
var express_1 = require("express");
var transaction_controller_ts_1 = require("../../../modules/transaction/transaction.controller.ts");
exports.transactionRouter = express_1.default.Router();
exports.transactionRouter.route("/user/send").post(transaction_controller_ts_1.sendUserFundsController);
exports.transactionRouter
    .route("/user/transactions")
    .get(transaction_controller_ts_1.getUserTransactionsController);
