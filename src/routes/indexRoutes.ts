import { Router } from "express";
import authRoutes from "./authRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import { decodeAccessToken, userWorkspaceAccessMiddleware } from "../middlewares/decodeToken.middleware.js";
import filesRoutes from "./filesRoutes.js";
import kanbanRoutes from "./kanbanRoutes.js";
import { zodValidationMiddleWare } from "../middlewares/ZodValidationMiddleware.js";
import { workspaceIdInParamsValidation } from "../validations/schemaValidations/common.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/workspace", decodeAccessToken, workspaceRoutes);
router.use(
  "/files/:workspaceId",
  decodeAccessToken,
  zodValidationMiddleWare({ params: workspaceIdInParamsValidation }),
  userWorkspaceAccessMiddleware,
  filesRoutes
);
router.use(
  "/kanban",
  decodeAccessToken,
  zodValidationMiddleWare({ params: workspaceIdInParamsValidation }),
  userWorkspaceAccessMiddleware,
  kanbanRoutes
);

export default router;
