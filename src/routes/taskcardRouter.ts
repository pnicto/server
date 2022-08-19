import { Router } from "express";
import {
  createCard,
  deleteCard,
  getAllCards,
  updateCard,
} from "../controllers/taskcardController";

const router = Router();
router.route("/").get(getAllCards).post(createCard);
router.route("/:taskcardId").patch(updateCard).delete(deleteCard);

export default router;
