"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cardController_1 = require("../controllers/cardController");
const router = (0, express_1.Router)();
router.get("/", cardController_1.getAllCards).post("/", cardController_1.createCard);
exports.default = router;
