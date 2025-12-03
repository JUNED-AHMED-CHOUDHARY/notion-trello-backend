import { Router } from "express";
import authRoutes from "./authRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import { decodeAccessToken } from "../middlewares/decodeToken.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/workspace", decodeAccessToken, workspaceRoutes);

export default router;
