import { Router } from "express";
import { getAllWorkspaces } from "../controllers/workspace.controller.js";

const workspaceRoutes = Router();

workspaceRoutes.get("/", getAllWorkspaces);
// workspaceRoutes.post("/", getAllWorkspaces);

export default workspaceRoutes;
