import { Request } from "express";
import prisma from "../clients/prismaClient";
import { oauth2Client } from "../clients/googleOauth2Client";
import { google, tasks_v1 } from "googleapis";
import { SMTPClient } from "emailjs";
import { Task } from "@prisma/client";

export const createAndUpdateGoogleCalendarEvent = async (
  req: Request,
  task: Task,
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

  if (!task.calendarEventId) {
    return (
      await service.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: task.title,
          start: {
            dateTime: eventStartDate,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: eventEndDate,
            timeZone: "Asia/Kolkata",
          },
        },
      })
    ).data.id;
  } else {
    return (
      await service.events.update({
        eventId: task.calendarEventId as string,
        requestBody: {
          summary: task.title,
          start: {
            dateTime: eventStartDate,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: eventEndDate,
            timeZone: "Asia/Kolkata",
          },
        },
      })
    ).data.id;
  }
};

export const deleteGoogleCalendarEvent = async (req: Request, task: Task) => {
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

  if (task.calendarEventId) {
    await service.events.delete({
      calendarId: "primary",
      eventId: task.calendarEventId as string,
    });
  }
};

export const createAndUpdateGoogleTask = async (
  req: Request,
  task: Task | null,
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
  let myTasklist: tasks_v1.Schema$TaskList | undefined;

  myTasklist = taskLists?.find(
    (taskList) => taskList.title === "taskboard app"
  );

  if (!myTasklist) {
    myTasklist = (
      await service.tasklists.insert({
        requestBody: {
          title: "taskboard app",
        },
      })
    ).data;
  }
  if (!task?.googleTaskId) {
    return (
      await service.tasks.insert({
        tasklist: myTasklist?.id as string | undefined,
        requestBody: {
          title: task?.title,
          due: task?.deadlineDate,
        },
      })
    ).data.id;
  } else {
    return (
      await service.tasks.update({
        tasklist: myTasklist?.id as string,
        requestBody: {
          title: task.title,
          due: task.deadlineDate,
        },
      })
    ).data.id;
  }
};

export const deleteGoogleTask = async (req: Request, task: Task | null) => {
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

  await service.tasks.delete({
    tasklist: myTasklist?.id as string,
    task: task?.googleTaskId as string,
  });
};

export const sendEmailNotification = async (
  sharedUsers: number[],
  message: string
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

    await client.sendAsync({
      text: message,
      subject: "Notification from taskboard",
      from: "Taskboards",
      to: user?.email as string,
    });
  }
};

export const isClashing = async (
  req: Request,
  eventStartDate: string,
  eventEndDate: string,
  task: Task | null
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

  let eventsList = (
    await service.events.list({
      calendarId: "primary",
      singleEvents: true,
      timeMin: eventStartDate,
      timeMax: eventEndDate,
    })
  ).data.items;
  eventsList = eventsList?.filter((event) => {
    event.id !== task?.calendarEventId;
  });

  if (eventsList?.length === 0) {
    return false;
  } else {
    return true;
  }
};
