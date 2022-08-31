import { Router } from "express";
import {
  createCard,
  deleteCard,
  getAllCards,
  updateCard,
  clearAllTaskcards,
} from "../controllers/taskcardController";

const router = Router();
router.route("/:taskboardId").get(getAllCards).post(createCard);
router.route("/:taskcardId").patch(updateCard).delete(deleteCard);
router.route("/clearTaskcards/:taskboardId").delete(clearAllTaskcards);

export default router;
