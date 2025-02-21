import prisma from "../../config/db.ts";
import BadRequestError from "../../errors/BadRequestError.ts";
import {
  comparePassword,
  createUserAccessToken,
  hashPassword,
} from "../../lib/utils/auth.ts";

export const signup = async (
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) => {
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      auth: { create: { password: hashedPassword } },
    },
    select: {
      id: true,
      email: true,
    },
  });

  return user;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
    include: { auth: true },
  });

  if (!user || !user.auth)
    throw new BadRequestError({
      code: 401,
      message: "Invalid login credentials",
      logging: true,
    });

  const isPasswordValid = await comparePassword(password, user.auth.password);
  if (!isPasswordValid)
    throw new BadRequestError({
      code: 401,
      message: "Invalid login credentials",
      logging: true,
    });

  const token = createUserAccessToken(user);
  const { auth, ...userWithoutAuth } = user;
  return { token, user: userWithoutAuth };
};
