import { Router } from "express";
import { getToken, oAuthLoginSignUp } from "../controllers/auth.controller.js";

const router = Router();

router.post("/oauth", oAuthLoginSignUp);
router.post("/get-token", getToken);
export default router;
