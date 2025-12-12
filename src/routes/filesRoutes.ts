import { Router } from "express";
import { getAllFiles, getFileData } from "../controllers/files.controller.js";

const router = Router();

router.get("/get-all", getAllFiles);
router.get("/:fileId", getFileData);
export default router;
