import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/tasksController";
const router = Router();

router.route("/").get(getAllTasks).post(createTask);

export default router;
