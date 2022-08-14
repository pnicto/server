"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasksController_1 = require("../controllers/tasksController");
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
router.get("/", tasksController_1.getAllTasksboards);
router.post("/", tasksController_1.createTaskboard);
exports.default = router;
