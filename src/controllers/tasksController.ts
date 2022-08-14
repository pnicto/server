import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

const getAllTasks = async (req: Request, res: Response) => {
  const { taskcardId } = req.body;
  const allTasks = await prisma.task.findMany({
    where: {
      taskcardId: Number(taskcardId),
    },
  });
  res.status(StatusCodes.OK).json(allTasks);
};

const createTask = async (req: Request, res: Response) => {
  const { taskcardId, taskTitle, description, completed } = req.body;
  const newTask = await prisma.task.create({
    data: {
      title: taskTitle,
      taskcardId: taskcardId,
      description: description,
      completed: completed,
    },
  });
  res.status(StatusCodes.CREATED).json(newTask);
};

export { getAllTasks, createTask };
