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
exports.deleteTaskboard = exports.updateTaskboard = exports.createTaskboard = exports.getAllTaskboards = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const prisma = new client_1.PrismaClient();
const getAllTaskboards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allTasksboards = yield prisma.taskboard.findMany({});
    res.status(http_status_codes_1.StatusCodes.OK).json(allTasksboards);
});
exports.getAllTaskboards = getAllTaskboards;
const createTaskboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskboardTitle } = req.body;
    const newTaskboard = yield prisma.taskboard.create({
        data: {
            boardTitle: taskboardTitle,
        },
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json(newTaskboard);
});
exports.createTaskboard = createTaskboard;
const updateTaskboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskboardId } = req.params;
    const { taskboardTitle } = req.body;
    const updatedTaskboard = yield prisma.taskboard.update({
        where: {
            id: Number(taskboardId),
        },
        data: {
            boardTitle: taskboardTitle,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedTaskboard);
});
exports.updateTaskboard = updateTaskboard;
const deleteTaskboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskboardId } = req.params;
    const deletedTaskboard = yield prisma.taskboard.delete({
        where: {
            id: Number(taskboardId),
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(deletedTaskboard);
});
exports.deleteTaskboard = deleteTaskboard;
