import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../clients/prismaClient";
import { BadRequestError } from "../errors/badRequestError";
import { sendEmailNotification } from "../utils/externalServices";

export const getAllCards = async (req: Request, res: Response) => {
  const { taskboardId, sharedOwnerId } = req.params;

  const allCards = await prisma.taskcard.findMany({
    where: {
      taskboardId: Number(taskboardId),
      userId: sharedOwnerId !== undefined ? Number(sharedOwnerId) : req.userId,
    },
  });
  res.status(StatusCodes.OK).json(allCards);
};

export const createCard = async (req: Request, res: Response) => {
  const { taskboardId } = req.params;
  const { cardTitle } = req.body;
  // verification that the same user is making changes
  const taskboard = await prisma.taskboard.findFirst({
    where: {
      id: Number(taskboardId),
    },
  });
  const originalOwnerId = taskboard?.userId;

  if (originalOwnerId !== req.userId) {
    throw new BadRequestError("Action not allowed");
  }

  const newTaskCard = await prisma.taskcard.create({
    data: {
      cardTitle: cardTitle,
      taskboardId: Number(taskboardId),
      userId: req.userId as number,
    },
  });

  await sendEmailNotification(
    taskboard?.sharedUsers as number[],
    `New tasklist  ${newTaskCard?.cardTitle} is created in the board ${taskboard?.boardTitle} by the owner.`
  );
  res.status(StatusCodes.CREATED).json(newTaskCard);
};

export const updateCard = async (req: Request, res: Response) => {
  const { cardTitle } = req.body;

  const { taskcardId } = req.params;

  const taskcard = await prisma.taskcard.findFirst({
    where: {
      id: Number(taskcardId),
    },
  });
  const originalOwnerId = taskcard?.userId;

  if (originalOwnerId !== req.userId) {
    throw new BadRequestError("Action not allowed");
  }

  const updatedCard = await prisma.taskcard.update({
    where: {
      id: Number(taskcardId),
    },
    data: {
      cardTitle: cardTitle,
    },
  });
  res.status(StatusCodes.OK).json(updatedCard);
};

export const deleteCard = async (req: Request, res: Response) => {
  const { taskcardId } = req.params;

  const taskcard = await prisma.taskcard.findFirst({
    where: {
      id: Number(taskcardId),
    },
  });
  const originalOwnerId = taskcard?.userId;

  if (originalOwnerId !== req.userId) {
    throw new BadRequestError("Action not allowed");
  }

  const deletedCard = await prisma.taskcard.delete({
    where: {
      id: Number(taskcardId),
    },
  });

  const taskboard = await prisma.taskboard.findUnique({
    where: {
      id: taskcard?.taskboardId,
    },
  });

  await sendEmailNotification(
    taskboard?.sharedUsers as number[],
    `New tasklist  ${deletedCard?.cardTitle} is deleted in the board ${taskboard?.boardTitle} by the owner.`
  );
  res.status(StatusCodes.OK).json(deletedCard);
};

export const clearAllTaskcards = async (req: Request, res: Response) => {
  const { taskboardId } = req.params;

  const taskboard = await prisma.taskboard.findFirst({
    where: {
      id: Number(taskboardId),
    },
  });
  const originalOwnerId = taskboard?.userId;

  if (originalOwnerId !== req.userId) {
    throw new BadRequestError("Action not allowed");
  }

  const clearedTaskcards = await prisma.taskcard.deleteMany({
    where: {
      taskboardId: Number(taskboardId),
    },
  });

  await sendEmailNotification(
    taskboard?.sharedUsers as number[],
    `All the tasklists in the board ${taskboard?.boardTitle} are deleted by the owner.`
  );
  res.status(StatusCodes.OK).json(clearedTaskcards);
};
