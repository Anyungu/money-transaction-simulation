import express from "express";
import {
  userLoginController,
  userSignUpController,
} from "../../../modules/auth/auth.controller.ts";

export const authRouter = express.Router();

authRouter.route("/sign-up").get(userSignUpController);
authRouter.route("/login").get(userLoginController);
