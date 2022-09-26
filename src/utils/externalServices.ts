import { Request } from "express";
import prisma from "../clients/prismaClient";
import { oauth2Client } from "../clients/googleOauth2Client";
import { google } from "googleapis";
import { SMTPClient } from "emailjs";

export const createGoogleCalendarEvent = async (
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

export const createGoogleTask = async (
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

export const sendEmailNotification = async (
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

    await client.sendAsync({
      text: `The taskboard ${taskboardTitle},which is shared to you by has some changes made by his owner.`,
      subject: "Notification from taskboard",
      from: "Taskboards",
      to: user?.email as string,
    });
  }
};

export const isClashing = async (
  req: Request,
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

  const eventsList = (
    await service.events.list({
      calendarId: "primary",
      singleEvents: true,
      timeMin: eventStartDate,
      timeMax: eventEndDate,
    })
  ).data.items;

  if (eventsList?.length === 0) {
    return false;
  } else {
    return true;
  }
};
