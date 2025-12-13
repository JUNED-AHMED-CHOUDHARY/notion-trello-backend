import { Router } from "express";
import { createWorkspace, getAllWorkspaces } from "../controllers/workspace.controller.js";
import { zodValidationMiddleWare } from "../middlewares/ZodValidationMiddleware.js";
import { createWorkspaceSchema } from "../validations/schemaValidations/workspaceValidations.js";

const workspaceRoutes = Router();

workspaceRoutes.post("/", zodValidationMiddleWare({ body: createWorkspaceSchema }), createWorkspace);
workspaceRoutes.get("/", getAllWorkspaces);

export default workspaceRoutes;
