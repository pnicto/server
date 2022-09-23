import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/badRequestError";
import prisma from "../client";

export const getAllTaskboards = async (req: Request, res: Response) => {
  const userTaskboards = await prisma.taskboard.findMany({
    where: {
      userId: req.userId,
    },
  });

  const sharedTaskboards = await prisma.taskboard.findMany({
    where: {
      sharedUsers: {
        has: req.userId,
      },
    },
  });

  res.status(StatusCodes.OK).json({
    userTaskboards,
    sharedTaskboards,
  });
};

export const createTaskboard = async (req: Request, res: Response) => {
  const { taskboardTitle } = req.body;

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
  const {
    taskboardTitle,
    emails,
  }: {
    taskboardTitle: string;
    emails: string[];
  } = req.body;
  const sharedIds: number[] = [];

  const taskboardToBeUpdated = await prisma.taskboard.findFirst({
    where: {
      id: Number(taskboardId),
    },
  });
  const originalOwnerId = taskboardToBeUpdated?.userId;

  if (originalOwnerId !== req.userId) {
    throw new BadRequestError("Action not allowed");
  }

  if (emails) {
    for (const email of emails) {
      const sharedUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      sharedIds.push(sharedUser?.id as number);
    }
    const updatedTaskboard = await prisma.taskboard.update({
      where: {
        id: Number(taskboardId),
      },
      data: {
        boardTitle: taskboardTitle,
        sharedUsers: sharedIds,
      },
    });
    return res.status(StatusCodes.OK).json(updatedTaskboard);
  } else {
    const updatedTaskboard = await prisma.taskboard.update({
      where: {
        id: Number(taskboardId),
      },
      data: {
        boardTitle: taskboardTitle,
      },
    });
    return res.status(StatusCodes.OK).json(updatedTaskboard);
  }
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
