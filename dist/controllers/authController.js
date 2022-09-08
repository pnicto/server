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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
prisma.$use((params, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (params.model === "User" && params.action === "create") {
        const user = params.args.data;
        const salt = yield bcryptjs_1.default.genSalt();
        const hashedPassword = yield bcryptjs_1.default.hash(user.password, salt);
        user.password = hashedPassword;
        params.args.data = user;
        const result = yield next(params);
        return result;
    }
}));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const newUser = yield prisma.user.create({
        data: {
            username,
            email,
            password,
        },
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        username,
        email,
        password: newUser.password,
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.login = login;
