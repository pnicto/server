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
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// routes
const tasksBoardRouter_1 = __importDefault(require("./routes/tasksBoardRouter"));
const cardRouter_1 = __importDefault(require("./routes/cardRouter"));
app.use("/api/tasksboards", tasksBoardRouter_1.default);
app.use("/api/taskCards", cardRouter_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}...`);
});
