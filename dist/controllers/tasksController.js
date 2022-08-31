"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getAllTasks = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const prisma = new client_1.PrismaClient();
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskcardId } = req.params;
    const allTasks = yield prisma.task.findMany({
        where: {
            taskcardId: Number(taskcardId),
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(allTasks);
});
exports.getAllTasks = getAllTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskcardId } = req.params;
    const { taskTitle, description, completed } = req.body;
    const newTask = yield prisma.task.create({
        data: {
            title: taskTitle,
            taskcardId: Number(taskcardId),
            description: description,
            completed: completed,
        },
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json(newTask);
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { taskcardId, taskTitle, description, completed } = req.body;
    const updatedTask = yield prisma.task.update({
        where: {
            id: Number(taskId),
        },
        data: {
            title: taskTitle,
            taskcardId: taskcardId,
            description: description,
            completed: completed,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedTask);
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const deletedTask = yield prisma.task.delete({
        where: {
            id: Number(taskId),
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(deletedTask);
});
exports.deleteTask = deleteTask;
