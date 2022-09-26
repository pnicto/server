import { Request, Response } from "express";
import prisma from "../clients/prismaClient";
import { StatusCodes } from "http-status-codes";
import { oauth2Client } from "../clients/googleOauth2Client";
import { google } from "googleapis";
import { SMTPClient } from "emailjs";

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
    createGoogleTask(req, taskTitle, description);
  }

  if (eventStartDate && eventEndDate) {
    createGoogleCalendarEvent(req, taskTitle, eventStartDate, eventEndDate);
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
    sendEmailNotification(
      taskboard?.boardTitle as string,
      taskboard?.sharedUsers as number[]
    );
  }

  res.status(StatusCodes.OK).json(updatedTask);
};

const createGoogleCalendarEvent = async (
  req: Request,
  taskTitle: string,
  eventStartDate: string,
  eventEndDate: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  oauth2Client.setCredentials({
    refresh_token: user?.refreshToken,
  });

  const service = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  await service.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: taskTitle,
      start: {
        dateTime: eventStartDate,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: eventEndDate,
        timeZone: "Asia/Kolkata",
      },
    },
  });
};

const createGoogleTask = async (
  req: Request,
  taskTitle: string,
  deadlineDate: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  oauth2Client.setCredentials({
    refresh_token: user?.refreshToken,
  });

  const service = google.tasks({
    version: "v1",
    auth: oauth2Client,
  });

  const taskLists = (await service.tasklists.list()).data.items;
  const myTasklist = taskLists?.find(
    (taskList) => taskList.title === "taskboard app"
  );

  if (!myTasklist) {
    const taskListId = (
      await service.tasklists.insert({
        requestBody: {
          title: "taskboard app",
        },
      })
    ).data.id;
  }

  await service.tasks.insert({
    tasklist: myTasklist?.id as string | undefined,
    requestBody: {
      title: taskTitle,
      due: deadlineDate,
    },
  });
};

const sendEmailNotification = async (
  taskboardTitle: string,
  sharedUsers: number[]
) => {
  const client = new SMTPClient({
    user: process.env.GMAIL,
    password: process.env.GOOGLE_APP_PASSWORD,
    host: "smtp.gmail.com",
    ssl: true,
  });
  for (const userId of sharedUsers) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log(
      await client.sendAsync({
        text: `The taskboard ${taskboardTitle},which is shared to you by has some changes made by his owner.`,
        subject: "Notification from taskboard",
        from: "Taskboards",
        to: user?.email as string,
      })
    );
  }
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
