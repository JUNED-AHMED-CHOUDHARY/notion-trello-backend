import { Router } from "express";
import { oAuthLoginSignUp } from "../controllers/auth.controller.js";

const router = Router();

router.post("/oauth", oAuthLoginSignUp);

export default router;
