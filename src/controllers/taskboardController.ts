import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/badRequestError";
import prisma from "../clients/prismaClient";
import { sendEmailNotification } from "../utils/externalServices";

export const getAllTaskboards = async (req: Request, res: Response) => {
  const userTaskboards = await prisma.taskboard.findMany({
    where: {
      userId: req.userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const sharedTaskboards = await prisma.taskboard.findMany({
    where: {
      sharedUsers: {
        has: req.userId,
      },
    },
    include: {
      User: {
        select: {
          username: true,
        },
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

    console.log(updatedTaskboard);
    
    const originalOwner = await prisma.user.findUnique({
      where: {
        id: originalOwnerId,
      },
    });

    await sendEmailNotification(
      updatedTaskboard?.sharedUsers as number[],
      `${updatedTaskboard?.boardTitle} is shared with you by ${originalOwner?.email}.`
    );
    return res.status(StatusCodes.OK).json(updatedTaskboard);
  } else {
    await sendEmailNotification(
      taskboardToBeUpdated?.sharedUsers as number[],
      `Your access to ${taskboardToBeUpdated?.boardTitle} is revoked by the owner.`
    );
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

  await sendEmailNotification(
    deletedTaskboard?.sharedUsers as number[],
    `${deletedTaskboard?.boardTitle} is deleted  by the owner.`
  );
  res.status(StatusCodes.OK).json(deletedTaskboard);
};
