import { Request, Response } from "express";
import prisma from "../clients/prismaClient";
import { StatusCodes } from "http-status-codes";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      username: true,
      id: true,
    },
  });

  res.status(StatusCodes.OK).json({
    users,
  });
};
