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

const updateTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { taskcardId, taskTitle, description, completed } = req.body;
  const updatedTask = await prisma.task.update({
    where: {
      id: Number(taskId),
    },
    data: {
      title: taskTitle,
      taskcardId: taskcardId,
      description: description,
      completed: completed,
    },
  });
  res.status(StatusCodes.OK).json(updatedTask);
};

const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const deletedTask = await prisma.task.delete({
    where: {
      id: Number(taskId),
    },
  });
  res.status(StatusCodes.OK).json(deletedTask);
};

export { getAllTasks, createTask, updateTask, deleteTask };
