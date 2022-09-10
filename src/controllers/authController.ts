import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import prisma from "../client";
import jwt from "jsonwebtoken";

type authRequestBody = {
  username: string;
  email: string;
  password: string;
};

prisma.$use(async (params, next) => {
  if (params.model === "User" && params.action === "create") {
    const user = params.args.data as authRequestBody;
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(user.password, salt);
    user.password = hashedPassword;
    params.args.data = user;
    const result = await next(params);

    return result;
  }
  return await next(params);
});

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body as authRequestBody;
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "User already exists" });
  } else {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    const accessToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET as string
    );

    res.status(StatusCodes.CREATED).json({
      username,
      email,
      accessToken,
    });
  }
};

export const login = async (req: Request, res: Response) => {};
