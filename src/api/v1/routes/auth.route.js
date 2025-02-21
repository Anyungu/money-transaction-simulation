"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
var express_1 = require("express");
var auth_controller_ts_1 = require("../../../modules/auth/auth.controller.ts");
exports.authRouter = express_1.default.Router();
exports.authRouter.route("/sign-up").post(auth_controller_ts_1.userSignUpController);
exports.authRouter.route("/login").post(auth_controller_ts_1.userLoginController);
