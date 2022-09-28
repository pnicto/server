import { Router } from "express";
import { getAllUsers } from "../controllers/usersController";
const router = Router();
router.route("/").get(getAllUsers);
export default router;
