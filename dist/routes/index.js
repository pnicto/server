"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = exports.tasksRouter = exports.taskcardRouter = exports.taskboardRouter = void 0;
const taskboardRouter_1 = __importDefault(require("./taskboardRouter"));
exports.taskboardRouter = taskboardRouter_1.default;
const taskcardRouter_1 = __importDefault(require("./taskcardRouter"));
exports.taskcardRouter = taskcardRouter_1.default;
const tasksRouter_1 = __importDefault(require("./tasksRouter"));
exports.tasksRouter = tasksRouter_1.default;
const authRouter_1 = __importDefault(require("./authRouter"));
exports.authRouter = authRouter_1.default;
