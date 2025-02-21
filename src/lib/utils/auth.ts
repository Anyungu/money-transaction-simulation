import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  comparePassword: string
) => {
  return await bcrypt.compare(password, comparePassword);
};

export const createUserAccessToken = (user: User) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!!,
    {
      expiresIn: "3h",
    }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!!) as jwt.JwtPayload;
};
