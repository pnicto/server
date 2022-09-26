import { Request, Response } from "express";
import prisma from "../clients/prismaClient";
import { StatusCodes } from "http-status-codes";
import {
  sendEmailNotification,
  createGoogleTask,
  createGoogleCalendarEvent,
} from "../utils/externalServices";

export const getAllTasks = async (req: Request, res: Response) => {
  const { taskcardId } = req.params;
  const allTasks = await prisma.task.findMany({
    where: {
      taskcardId: Number(taskcardId),
    },
  });
  res.status(StatusCodes.OK).json(allTasks);
};

export const createTask = async (req: Request, res: Response) => {
  const { taskcardId } = req.params;
  const { taskTitle, description, completed } = req.body;

  const newTask = await prisma.task.create({
    data: {
      title: taskTitle,
      taskcardId: Number(taskcardId),
      description: description,
      completed: completed,
      userId: Number(req.userId),
    },
  });
  res.status(StatusCodes.CREATED).json(newTask);
};

export const updateTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const {
    taskcardId,
    taskTitle,
    description,
    completed,
    deadlineDate,
    eventStartDate,
    eventEndDate,
  } = req.body;

  if (deadlineDate) {
    await createGoogleTask(req, taskTitle, description);
  }

  if (eventStartDate && eventEndDate) {
    await createGoogleCalendarEvent(
      req,
      taskTitle,
      eventStartDate,
      eventEndDate
    );
  }
  const oldTask = await prisma.task.findUnique({
    where: {
      id: Number(taskId),
    },
  });

  const updatedTask = await prisma.task.update({
    where: {
      id: Number(taskId),
    },
    data: {
      title: taskTitle,
      taskcardId: taskcardId,
      description: description,
      completed: completed,
      deadlineDate,
      eventStartDate,
      eventEndDate,
    },
  });

  const taskboardId = (
    await prisma.taskcard.findUnique({
      where: {
        id: updatedTask.taskcardId,
      },
    })
  )?.taskboardId;

  const taskboard = await prisma.taskboard.findUnique({
    where: {
      id: taskboardId,
    },
  });

  if (!(JSON.stringify(oldTask) === JSON.stringify(updatedTask))) {
    await sendEmailNotification(
      taskboard?.boardTitle as string,
      taskboard?.sharedUsers as number[]
    );
  }

  res.status(StatusCodes.OK).json(updatedTask);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const deletedTask = await prisma.task.delete({
    where: {
      id: Number(taskId),
    },
  });
  res.status(StatusCodes.OK).json(deletedTask);
};
