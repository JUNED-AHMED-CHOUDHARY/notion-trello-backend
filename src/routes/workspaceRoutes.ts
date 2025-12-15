import { Router } from "express";
import { createWorkspace, getAllWorkspaces, getWorkspace, updateWorkspace } from "../controllers/workspace.controller.js";
import { zodValidationMiddleWare } from "../middlewares/ZodValidationMiddleware.js";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../validations/schemaValidations/workspaceValidations.js";
import { workspaceIdInParamsValidation } from "../validations/schemaValidations/common.js";

const workspaceRoutes = Router();

// create workspace..
workspaceRoutes.post("/", zodValidationMiddleWare({ body: createWorkspaceSchema }), createWorkspace);
// get all workspace..
workspaceRoutes.get("/", getAllWorkspaces);

// get workspace..
workspaceRoutes.get("/:workspaceId", zodValidationMiddleWare({ params: workspaceIdInParamsValidation }), getWorkspace);

// update workspace..
workspaceRoutes.patch("/:workspaceId", zodValidationMiddleWare({ body: updateWorkspaceSchema, params: workspaceIdInParamsValidation }), updateWorkspace);

export default workspaceRoutes;
