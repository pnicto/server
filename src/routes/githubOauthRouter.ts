import { Router } from "express";
import { getUserDetails } from "../controllers/githubOauthController";

const router = Router();

router.route("/").post(getUserDetails);

export default router;
