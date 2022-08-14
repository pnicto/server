import { Router } from "express";
import {
  createCard,
  deleteCard,
  getAllCards,
  updateCard,
} from "../controllers/cardController";

const router = Router();
router.get("/", getAllCards).post("/", createCard);
router.patch("/:taskcardId", updateCard).delete("/:taskcardId", deleteCard);

export default router;
