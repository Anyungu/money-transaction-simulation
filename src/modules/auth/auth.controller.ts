import type { NextFunction, Response, Request } from "express";
import type { UserLogin, UserSignUp } from "../../lib/types/user.types.ts";
import { login, signup } from "./auth.service.ts";
import { userSignUpSchema } from "../../validators/user.validators.ts";
import BadRequestError from "../../errors/BadRequestError.ts";

export const userLoginController = async (
  req: Request<unknown, unknown, UserLogin>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = userSignUpSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError({
        code: 400,
        message: JSON.stringify(validation.error),
        customMessage: "Bad Request",
        logging: true,
      });
    }

    const { email, password } = validation.data;

    res.status(200).json({ ...(await login(email, password)) });
  } catch (error) {
    next(error);
  }
};

export const userSignUpController = async (
  req: Request<unknown, unknown, UserSignUp>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = userSignUpSchema.safeParse(req.body);
    if (!validation.success) {
      throw new BadRequestError({
        code: 400,
        message: JSON.stringify(validation.error),
        customMessage: "Bad Request",
        logging: true,
      });
    }

    const { email, password, lastName, firstName } = validation.data;
    res
      .status(201)
      .json({ ...(await signup(email, password, firstName, lastName)) });
  } catch (error) {
    next(error);
  }
};
