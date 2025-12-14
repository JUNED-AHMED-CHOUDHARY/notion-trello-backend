import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/decodeToken.middleware.js";
import { prisma } from "../setup/prisma.setup.js";

export const getAllFiles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const workspaceId = Number(req.params.workspaceId);

    const data = await prisma.files.findMany({
      where: {
        workspace_id: workspaceId,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        kanban_board: {
          select: {
            id: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: "files fetched successfully",
      data,
    });
  } catch (error) {
    return res.json({
      success: true,
      message: "found",
      data: error,
    });
  }
};

export const getFileData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const fileId = Number(req.params.fileId);
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "file id is required",
      });
    }

    // const file = await prisma.file
  } catch (error) {
    return res.json({
      success: true,
      message: "found",
      data: error,
    });
  }
};
