import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/badRequestError";
import prisma from "../client";

export const getAllTaskboards = async (req: Request, res: Response) => {
  const allTasksboards = await prisma.taskboard.findMany({
    where: {
      userId: req.userId,
    },
  });
  res.status(StatusCodes.OK).json(allTasksboards);
};

export const createTaskboard = async (req: Request, res: Response) => {
  const { taskboardTitle } = req.body;

  if (!taskboardTitle) {
    throw new BadRequestError("Taskboard title cannot be empty");
  }

  const newTaskboard = await prisma.taskboard.create({
    data: {
      boardTitle: taskboardTitle,
      userId: req.userId as number,
    },
  });

  return res.status(StatusCodes.CREATED).json(newTaskboard);
};

export const updateTaskboard = async (req: Request, res: Response) => {
  const { taskboardId } = req.params;
  const { taskboardTitle } = req.body;

  const taskboardToBeUpdated = await prisma.taskcard.findFirst({
    where: {
      id: Number(taskboardId),
    },
  });
  const originalOwnerId = taskboardToBeUpdated?.userId;

  if (originalOwnerId !== req.userId) {
    throw new BadRequestError("Action not allowed");
  }

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

  const taskboardToBeDeleted = await prisma.taskboard.findFirst({
    where: {
      id: Number(taskboardId),
    },
  });
  const originalOwnerId = taskboardToBeDeleted?.userId;

  if (originalOwnerId !== req.userId) {
    throw new BadRequestError("Action not allowed");
  }

  const deletedTaskboard = await prisma.taskboard.delete({
    where: {
      id: Number(taskboardId),
    },
  });
  res.status(StatusCodes.OK).json(deletedTaskboard);
};
