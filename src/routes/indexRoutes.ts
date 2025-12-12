import { Router } from "express";
import authRoutes from "./authRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import { decodeAccessToken, userWorkspaceAccessMiddleware } from "../middlewares/decodeToken.middleware.js";
import filesRoutes from "./filesRoutes.js";
import kanbanRoutes from "./kanbanRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/workspace", decodeAccessToken, workspaceRoutes);
router.use("/files", decodeAccessToken, userWorkspaceAccessMiddleware, filesRoutes);
router.use("/kanban", decodeAccessToken, userWorkspaceAccessMiddleware, kanbanRoutes);

export default router;
