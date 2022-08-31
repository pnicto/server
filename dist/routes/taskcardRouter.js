"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskcardController_1 = require("../controllers/taskcardController");
const router = (0, express_1.Router)();
router.route("/:taskboardId").get(taskcardController_1.getAllCards).post(taskcardController_1.createCard);
router.route("/:taskcardId").patch(taskcardController_1.updateCard).delete(taskcardController_1.deleteCard);
router.route("/clearTaskcards/:taskboardId").delete(taskcardController_1.clearAllTaskcards);
exports.default = router;
