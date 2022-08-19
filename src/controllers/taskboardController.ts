import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

export const getAllTaskboards = async (req: Request, res: Response) => {
  const allTasksboards = await prisma.taskboard.findMany({});
  res.status(StatusCodes.OK).json(allTasksboards);
};

export const createTaskboard = async (req: Request, res: Response) => {
  const { taskboardTitle } = req.body;
  const newTaskboard = await prisma.taskboard.create({
    data: {
      boardTitle: taskboardTitle,
    },
  });
  res.status(StatusCodes.CREATED).json(newTaskboard);
};

export const updateTaskboard = async (req: Request, res: Response) => {
  const { taskboardId } = req.params;
  const { taskboardTitle } = req.body;
  const updatedTaskboard = await prisma.taskboard.update({
    where: {
      id: Number(taskboardId),
    },
    data: {
      boardTitle: taskboardTitle,
    },
  });
  res.status(StatusCodes.OK).json(updatedTaskboard);
};

export const deleteTaskboard = async (req: Request, res: Response) => {
  const { taskboardId } = req.params;
  const deletedTaskboard = await prisma.taskboard.delete({
    where: {
      id: Number(taskboardId),
    },
  });
  res.status(StatusCodes.OK).json(deletedTaskboard);
};
