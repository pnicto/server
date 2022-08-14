import express from "express";
import dotenv from "dotenv";
const app = express();
dotenv.config();

// middleware
import cors from "cors";
app.use(cors());
app.use(express.json());

// routes
import tasksboardRouter from "./routes/tasksBoardRouter";
app.use("/api/tasksboards", tasksboardRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}...`);
});
