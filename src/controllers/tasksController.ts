import { Request, Response } from "express";
import prisma from "../clients/prismaClient";
import { StatusCodes } from "http-status-codes";
import {
  sendEmailNotification,
  createAndUpdateGoogleTask,
  createAndUpdateGoogleCalendarEvent,
  isClashing,
  deleteGoogleCalendarEvent,
  deleteGoogleTask,
} from "../utils/externalServices";

export const getAllTasks = async (req: Request, res: Response) => {
  const { taskcardId } = req.params;
  const allTasks = await prisma.task.findMany({
    where: {
      taskcardId: Number(taskcardId),
    },
    orderBy: {
      createdAt: "asc",
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

  const taskboardId = (
    await prisma.taskcard.findUnique({
      where: {
        id: newTask.taskcardId,
      },
    })
  )?.taskboardId;

  const taskboard = await prisma.taskboard.findUnique({
    where: {
      id: taskboardId,
    },
  });

  if (taskboard?.sharedUsers) {
    await sendEmailNotification(
      taskboard?.sharedUsers as number[],
      `A new task ${newTask.title} is added to the taskboard ${taskboard?.boardTitle} by the owner.`
    );
  }
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

  let googleTaskId: string | null | undefined;

  const oldTask = await prisma.task.findUnique({
    where: {
      id: Number(taskId),
    },
  });

  if (deadlineDate) {
    googleTaskId = await createAndUpdateGoogleTask(req, oldTask);
  }

  let updatedTask = await prisma.task.update({
    where: {
      id: Number(taskId),
    },
    data: {
      title: taskTitle,
      taskcardId: taskcardId,
      description: description === "" ? null : description,
      completed: completed,
      deadlineDate,
      eventStartDate,
      eventEndDate,
      googleTaskId: googleTaskId,
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
    if (
      eventStartDate &&
      eventEndDate &&
      !(await isClashing(req, eventStartDate, eventEndDate, oldTask))
    ) {
      const eventId = await createAndUpdateGoogleCalendarEvent(
        req,
        updatedTask,
        eventStartDate,
        eventEndDate
      );

      updatedTask = await prisma.task.update({
        where: {
          id: Number(taskId),
        },
        data: {
          calendarEventId: eventId,
        },
      });
    }

    await sendEmailNotification(
      taskboard?.sharedUsers as number[],
      `The taskboard ${taskboard?.boardTitle}, has been made some changes by the owner.`
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

  const taskboardId = (
    await prisma.taskcard.findUnique({
      where: {
        id: deletedTask.taskcardId,
      },
    })
  )?.taskboardId;

  const taskboard = await prisma.taskboard.findUnique({
    where: {
      id: taskboardId,
    },
  });

  if (deletedTask.calendarEventId) deleteGoogleCalendarEvent(req, deletedTask);

  if (deletedTask.googleTaskId) deleteGoogleTask(req, deletedTask);

  if (taskboard?.sharedUsers) {
    await sendEmailNotification(
      taskboard?.sharedUsers as number[],
      `The taskboard ${taskboard?.boardTitle} is deleted by the owner.`
    );
  }
  res.status(StatusCodes.OK).json(deletedTask);
};
