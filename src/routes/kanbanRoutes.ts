import { Router } from "express";
import { getKanbanData } from "../controllers/kanban.controller.js";

const router = Router();

router.get("/:kanbanId", getKanbanData);
export default router;
