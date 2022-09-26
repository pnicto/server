import express from "express";
import dotenv from "dotenv";
import { Request, Response } from "express";
require("express-async-errors");

const app = express();
dotenv.config();

// middleware
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// custom middleware
import { authenticateToken } from "./middleware/authenticateToken";
import { errorHandler } from "./middleware/errorHandler";
app.use("/api/*", authenticateToken);

// routes
import {
  authRouter,
  githubOauthRouter,
  taskboardRouter,
  taskcardRouter,
  tasksRouter,
} from "./routes";

app.use("/github/auth", githubOauthRouter);
app.use("/api/taskboards", taskboardRouter);
app.use("/api/taskcards", taskcardRouter);
app.use("/api/tasks", tasksRouter);
app.use("/user", authRouter);
app.get("*", async (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}...`);
});
