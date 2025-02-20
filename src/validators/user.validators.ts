import type { UserSignUp } from "../lib/types/user.types";
import { z } from "zod";

export const userSignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .optional(),
});

export const transferFundsSchema = z
  .object({
    senderId: z.string().uuid(),
    receiverId: z.string().uuid(),
    amount: z.number().min(9.99, "Amount must be greater than 10"),
  })
  .refine((data) => data.senderId !== data.receiverId, {
    message: "Sender and receiver cannot be the same",
    path: ["receiverId"],
  });

export const paginationSchema = z.object({
  page: z
    .string()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1, { message: "Page must be at least 1" }),
  size: z
    .string()
    .default("50")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 || val === -1, {
      message: "Size must be at least 1 or -1",
    }),
});
