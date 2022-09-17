import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { BadRequestError } from "../errors/badRequestError";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new BadRequestError("Token missing");
  }

  const { userId } = jwt.verify(
    accessToken,
    process.env.JWT_SECRET as string
  ) as jwt.JwtPayload;
  req.userId = userId;

  next();
};
