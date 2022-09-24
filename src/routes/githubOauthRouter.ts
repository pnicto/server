import { Router } from "express";
import { getUserDetails } from "../controllers/githubOauthController";

const router = Router();

router.route("/").get(getUserDetails);

export default router;
