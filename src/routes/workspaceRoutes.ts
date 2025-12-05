import { Router } from "express";
import { createWorkspace, getAllWorkspaces } from "../controllers/workspace.controller.js";

const workspaceRoutes = Router();

workspaceRoutes.post("/", createWorkspace);
workspaceRoutes.get("/", getAllWorkspaces);

export default workspaceRoutes;
