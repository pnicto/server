import { Router } from "express";
import {
  getAllTasksboards,
  createTaskboard,
} from "../controllers/tasksController";
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
router.get("/", getAllTasksboards);
router.post("/", createTaskboard);

export default router;
