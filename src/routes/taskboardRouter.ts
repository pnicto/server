import { Router } from "express";
import {
  getAllTaskboards,
  createTaskboard,
  updateTaskboard,
  deleteTaskboard,
} from "../controllers/taskboardController";

const router = Router();
router.route("/").get(getAllTaskboards).post(createTaskboard);
router.route("/:taskboardId").patch(updateTaskboard).delete(deleteTaskboard);

export default router;
