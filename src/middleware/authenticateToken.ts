import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { BadRequestError } from "../errors/badRequestError";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new BadRequestError("Token missing");
  }
  const token = authHeader.split(" ")[1];

  const { userId } = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as jwt.JwtPayload;
  console.log(userId);
  req.userId = userId;

  next();
};
