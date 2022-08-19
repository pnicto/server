"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
// middleware
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("tiny"));
// routes
const taskboardRouter_1 = __importDefault(require("./routes/taskboardRouter"));
const taskcardRouter_1 = __importDefault(require("./routes/taskcardRouter"));
const tasksRouter_1 = __importDefault(require("./routes/tasksRouter"));
app.use("/api/taskboards", taskboardRouter_1.default);
app.use("/api/taskcards", taskcardRouter_1.default);
app.use("/api/tasks", tasksRouter_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}...`);
});
