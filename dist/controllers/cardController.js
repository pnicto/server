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
exports.deleteCard = exports.updateCard = exports.createCard = exports.getAllCards = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const prisma = new client_1.PrismaClient();
const getAllCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskboardId } = req.body;
    const allCards = yield prisma.taskcard.findMany({
        where: {
            taskboardId: Number(taskboardId),
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(allCards);
});
exports.getAllCards = getAllCards;
const createCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskboardId, cardTitle } = req.body;
    const newTaskCard = yield prisma.taskcard.create({
        data: {
            cardTitle: cardTitle,
            taskboardId: Number(taskboardId),
        },
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json(newTaskCard);
});
exports.createCard = createCard;
const updateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskboardId, cardTitle } = req.body;
    const { taskcardId } = req.params;
    const updatedCard = yield prisma.taskcard.update({
        where: {
            id: Number(taskcardId),
        },
        data: {
            cardTitle: cardTitle,
            taskboardId: Number(taskboardId),
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedCard);
});
exports.updateCard = updateCard;
const deleteCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskcardId } = req.params;
    const deletedCard = yield prisma.taskcard.delete({
        where: {
            id: Number(taskcardId),
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(deletedCard);
});
exports.deleteCard = deleteCard;
