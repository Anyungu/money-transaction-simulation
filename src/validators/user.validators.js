"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.transferFundsSchema = exports.userSignUpSchema = void 0;
var zod_1 = require("zod");
exports.userSignUpSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    firstName: zod_1.z
        .string()
        .min(2, { message: "First name must be at least 2 characters" })
        .optional(),
    lastName: zod_1.z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" })
        .optional(),
});
exports.transferFundsSchema = zod_1.z
    .object({
    senderId: zod_1.z.string().uuid(),
    receiverId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().min(9.99, "Amount must be greater than 10"),
})
    .refine(function (data) { return data.senderId !== data.receiverId; }, {
    message: "Sender and receiver cannot be the same",
    path: ["receiverId"],
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .default("1")
        .transform(function (val) { return parseInt(val, 10); })
        .refine(function (val) { return val >= 1; }, { message: "Page must be at least 1" }),
    size: zod_1.z
        .string()
        .default("50")
        .transform(function (val) { return parseInt(val, 10); })
        .refine(function (val) { return val >= 1 || val === -1; }, {
        message: "Size must be at least 1 or -1",
    }),
});
