"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasksBoardController_1 = require("../controllers/tasksBoardController");
const router = (0, express_1.Router)();
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
router.get("/", tasksBoardController_1.getAllTasksboards).post("/", tasksBoardController_1.createTaskboard);
router.patch("/:taskboardId", tasksBoardController_1.updateTaskboard).delete("/:taskboardId", tasksBoardController_1.deleteTaskboard);
exports.default = router;
