"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cardController_1 = require("../controllers/cardController");
const router = (0, express_1.Router)();
router.route("/").get(cardController_1.getAllCards).post(cardController_1.createCard);
router.route("/:taskcardId").patch(cardController_1.updateCard).delete(cardController_1.deleteCard);
exports.default = router;
