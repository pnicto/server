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
const routes_1 = require("./routes");
app.use("/api/taskboards", routes_1.taskboardRouter);
app.use("/api/taskcards", routes_1.taskcardRouter);
app.use("/api/tasks", routes_1.tasksRouter);
app.use("/user", routes_1.authRouter);
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}...`);
});
