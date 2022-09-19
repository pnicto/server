import { Router } from "express";
import { login, register, logout } from "../controllers/authController";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
export default router;
