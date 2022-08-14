import { Router } from "express";
import { createCard, getAllCards } from "../controllers/cardController";

const router = Router();
router.get("/", getAllCards).post("/", createCard);

export default router;
