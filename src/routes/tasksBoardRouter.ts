import { Router } from "express";
import {
  getAllTasksboards,
  createTaskboard,
  updateTaskboard,
  deleteTaskboard,
} from "../controllers/tasksBoardController";

const router = Router();
/*
  API SCHEMA

  GET - All taskboards
        All cards of a taskboard
        All tasks of card
  POST - Add a taskboard
        Add a card in a taskboard
        Add a task in a card
  PATCH - Update a taskboard
          Update  a card in a taskboard
          Update a task in card
  DELETE- Delete a taskboard
          Delete a card in a taskboard
          Delete a task in card
*/
router.get("/", getAllTasksboards).post("/", createTaskboard);
router.patch("/:taskboardId", updateTaskboard).delete("/:taskboardId", deleteTaskboard);

export default router;
