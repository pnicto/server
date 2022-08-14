"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cardController_1 = require("../controllers/cardController");
const router = (0, express_1.Router)();
router.get("/", cardController_1.getAllCards).post("/", cardController_1.createCard);
router.patch("/:taskcardId", cardController_1.updateCard).delete("/:taskcardId", cardController_1.deleteCard);
exports.default = router;
