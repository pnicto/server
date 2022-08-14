import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/tasksController";
const router = Router();

router.route("/").get(getAllTasks).post(createTask);
router.route("/:taskId").patch(updateTask).delete(deleteTask);

export default router;
