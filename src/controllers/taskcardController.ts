import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();
export const getAllCards = async (req: Request, res: Response) => {
  const { taskboardId } = req.body;
  const allCards = await prisma.taskcard.findMany({
    where: {
      taskboardId: Number(taskboardId),
    },
  });
  res.status(StatusCodes.OK).json(allCards);
};

export const createCard = async (req: Request, res: Response) => {
  const { taskboardId, cardTitle } = req.body;
  const newTaskCard = await prisma.taskcard.create({
    data: {
      cardTitle: cardTitle,
      taskboardId: Number(taskboardId),
    },
  });
  res.status(StatusCodes.CREATED).json(newTaskCard);
};

export const updateCard = async (req: Request, res: Response) => {
  const { taskboardId, cardTitle } = req.body;
  const { taskcardId } = req.params;
  const updatedCard = await prisma.taskcard.update({
    where: {
      id: Number(taskcardId),
    },
    data: {
      cardTitle: cardTitle,
      taskboardId: Number(taskboardId),
    },
  });
  res.status(StatusCodes.OK).json(updatedCard);
};

export const deleteCard = async (req: Request, res: Response) => {
  const { taskcardId } = req.params;
  const deletedCard = await prisma.taskcard.delete({
    where: {
      id: Number(taskcardId),
    },
  });
  res.status(StatusCodes.OK).json(deletedCard);
};
