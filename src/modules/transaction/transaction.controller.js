"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTransactionsController = exports.sendUserFundsController = void 0;
var user_validators_ts_1 = require("../../validators/user.validators.ts");
var BadRequestError_ts_1 = require("../../errors/BadRequestError.ts");
var transaction_service_ts_1 = require("./transaction.service.ts");
var transaction_queue_ts_1 = require("../../jobs/queues/transaction.queue.ts");
var redis_ts_1 = require("../../config/redis.ts");
var logger_ts_1 = require("../../lib/utils/logger.ts");
var sendUserFundsController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var senderId, _a, amount, receiverId, validation, senderBalance, createdTransaction, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                senderId = req.user.userId;
                _a = req.body, amount = _a.amount, receiverId = _a.receiverId;
                validation = user_validators_ts_1.transferFundsSchema.safeParse({
                    senderId: senderId,
                    receiverId: receiverId,
                    amount: amount,
                });
                if (!validation.success) {
                    throw new BadRequestError_ts_1.default({
                        code: 400,
                        message: JSON.stringify(validation.error),
                        customMessage: "Bad Request",
                        logging: true,
                    });
                }
                return [4 /*yield*/, Promise.all([
                        (0, transaction_service_ts_1.getUserBalance)(senderId),
                        (0, transaction_service_ts_1.getUserById)(receiverId),
                    ])];
            case 1:
                senderBalance = (_b.sent())[0];
                if (amount >= senderBalance) {
                    throw new BadRequestError_ts_1.default({
                        code: 400,
                        message: "Insufficient funds",
                        customMessage: "Insufficient funds",
                        logging: true,
                    });
                }
                return [4 /*yield*/, (0, transaction_service_ts_1.createTransaction)(senderId, receiverId, amount)];
            case 2:
                createdTransaction = _b.sent();
                return [4 /*yield*/, transaction_queue_ts_1.transactionQueue.add("process-transaction", {
                        senderId: senderId,
                        receiverId: receiverId,
                        amount: amount,
                        transactionId: createdTransaction.id,
                        reference: createdTransaction.reference,
                    })];
            case 3:
                _b.sent();
                logger_ts_1.default.info(__assign({}, createdTransaction), "Transaction initiated");
                res.status(200).json(createdTransaction);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.sendUserFundsController = sendUserFundsController;
var getUserTransactionsController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, success, data, error, size, page, skip, cacheKey, cachedData, cachedTransactions, transactions, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                userId = req.user.userId;
                _a = user_validators_ts_1.paginationSchema.safeParse(req.query), success = _a.success, data = _a.data, error = _a.error;
                if (!success) {
                    throw new BadRequestError_ts_1.default({
                        code: 400,
                        message: JSON.stringify(error),
                        customMessage: "Bad Request",
                        logging: true,
                    });
                }
                size = data.size, page = data.page;
                skip = (data.page - 1) * data.size;
                cacheKey = "transactions:".concat(userId, ":page-").concat(page, ":size-").concat(size);
                return [4 /*yield*/, redis_ts_1.default.get(cacheKey)];
            case 1:
                cachedData = _b.sent();
                if (cachedData) {
                    cachedTransactions = JSON.parse(cachedData);
                    logger_ts_1.default.info(__assign(__assign({}, cachedTransactions), { userId: userId, page: page, size: size }), "Transactions fetched from cache");
                    res.status(200).json(cachedTransactions);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, transaction_service_ts_1.getUserTransactionHistory)(userId, page, size, skip)];
            case 2:
                transactions = _b.sent();
                return [4 /*yield*/, redis_ts_1.default.setex(cacheKey, 600, JSON.stringify(transactions))];
            case 3:
                _b.sent();
                logger_ts_1.default.info(__assign(__assign({}, transactions), { userId: userId, page: page, size: size }), "Transactions fetched from db");
                res.status(200).json(transactions);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getUserTransactionsController = getUserTransactionsController;
