import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const getAllTasksboards = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const allTasksboards = await prisma.taskboard.findMany({});
  res.status(StatusCodes.OK).json(allTasksboards);
};

const createTaskboard = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const newTaskboard = await prisma.taskboard.create({
    data: req.body,
  });
  res.status(StatusCodes.CREATED).json(newTaskboard);
};

export { getAllTasksboards, createTaskboard };
