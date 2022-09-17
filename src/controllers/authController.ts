import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import prisma from "../client";
import { BadRequestError } from "../errors/badRequestError";
import { generateJWT } from "../utils/generateJWT";
import { UnauthorizedError } from "../errors/unauthorizedError";

type authRequestBody = {
  username: string;
  email: string;
  password: string;
};

// TODO:Refresh tokens
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

  if (!username || !email || !password) {
    throw new BadRequestError("Please provide the required values.");
  }

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });

  const accessToken = generateJWT({ userId: newUser.id });

  res.status(StatusCodes.CREATED).json({
    username,
    email,
    accessToken,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as authRequestBody;

  if (!email || !password) {
    throw new BadRequestError("Please provide the required credentials.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new BadRequestError("User is not registered.");
  }

  const isPasswordCorrect = await bcryptjs.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Password is invalid");
  }

  const accessToken = generateJWT({ userId: user.id });
  console.log(accessToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
  });

  res.status(StatusCodes.OK).json({
    user: { email, id: user.id, username: user.username },
    accessToken,
  });
};
