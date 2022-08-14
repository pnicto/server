"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasksController_1 = require("../controllers/tasksController");
const router = (0, express_1.Router)();
router.route("/").get(tasksController_1.getAllTasks).post(tasksController_1.createTask);
exports.default = router;
