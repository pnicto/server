"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskboardController_1 = require("../controllers/taskboardController");
const router = (0, express_1.Router)();
router.route("/").get(taskboardController_1.getAllTaskboards).post(taskboardController_1.createTaskboard);
router.route("/:taskboardId").patch(taskboardController_1.updateTaskboard).delete(taskboardController_1.deleteTaskboard);
exports.default = router;
