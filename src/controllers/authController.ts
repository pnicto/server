import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import prisma from "../clients/prismaClient";
import { BadRequestError } from "../errors/badRequestError";
import { generateJWT } from "../utils/generateJWT";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { oauth2Client } from "../clients/googleOauth2Client";

type authRequestBody = {
  username: string;
  email?: string;
  password?: string;
  code?: string;
};

prisma.$use(async (params, next) => {
  if (params.model === "User" && params.action === "create") {
    const user = params.args.data as authRequestBody;
    if (user.password) {
      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(user.password, salt);
      user.password = hashedPassword;
    }
    params.args.data = user;
    const result: any = await next(params);

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
  const { email, password, code } = req.body as authRequestBody;

  if (code) {
    const { tokens } = await oauth2Client.getToken(code);
    const decodedPayload = (
      await oauth2Client.verifyIdToken({
        idToken: tokens.id_token as string,
      })
    ).getPayload();

    const user = await prisma.user.findUnique({
      where: {
        email: decodedPayload?.email,
      },
    });
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          email: decodedPayload?.email as string,
          username: decodedPayload?.name as string,
          refreshToken: tokens.refresh_token,
        },
      });
      const accessToken = generateJWT({ userId: newUser.id });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(StatusCodes.OK).json({
        user: {
          email: newUser.email,
          id: newUser.id,
          username: newUser.username,
        },
        accessToken,
      });
    } else {
      await prisma.user.update({
        where: {
          email: decodedPayload?.email as string,
        },
        data: {
          refreshToken: tokens.refresh_token,
        },
      });

      const accessToken = generateJWT({ userId: user?.id as number });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(StatusCodes.OK).json({
        user: { email: user.email, id: user?.id, username: user?.username },
        accessToken,
      });
    }
  } else {
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
    } else {
      const isPasswordCorrect = await bcryptjs.compare(
        password as string,
        user.password as string
      );
      if (!isPasswordCorrect) {
        throw new UnauthorizedError("Password is invalid");
      }
      const accessToken = generateJWT({ userId: user?.id as number });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(StatusCodes.OK).json({
        user: { email, id: user?.id, username: user?.username },
        accessToken,
      });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: true,
  });

  res.status(StatusCodes.OK).send();
};
