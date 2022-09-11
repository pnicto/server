import express from "express";
import dotenv from "dotenv";
require("express-async-errors");

const app = express();
dotenv.config();

// middleware
import cors from "cors";
import morgan from "morgan";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// custom middleware
import { authenticateToken } from "./middleware/authenticateToken";
import { errorHandler } from "./middleware/errorHandler";
app.use("/api/*", authenticateToken);

// routes
import {
  authRouter,
  taskboardRouter,
  taskcardRouter,
  tasksRouter,
} from "./routes";

app.use("/api/taskboards", taskboardRouter);
app.use("/api/taskcards", taskcardRouter);
app.use("/api/tasks", tasksRouter);
app.use("/user", authRouter);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}...`);
});
