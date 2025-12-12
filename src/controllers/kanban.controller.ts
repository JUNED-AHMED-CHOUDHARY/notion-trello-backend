import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/decodeToken.middleware.js";
import { prisma } from "../setup/prisma.setup.js";

export const getKanbanData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    console.log('hitted')
    const kanbanId = Number(req.params.kanbanId);
    if (isNaN(kanbanId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid kanban id",
      });
    }
    const kanbanBoard = await prisma.kanban_boards.findUnique({
      where: {
        id: kanbanId,
      },
      include: {
        kanban_sections: {
          orderBy: { index: "asc" },
          include: {
            kanban_fields: {
              orderBy: { index: "asc" },
            },
          },
        },
      }
    });
    if (!kanbanBoard) {
      return res.status(404).json({
        success: false,
        message: "Kanban board not found for given kanbanId",
      });
    }

    return res.json({
      success: true,
      message: "Kanban board fetched successfully",
      data: kanbanBoard,
    });
  } catch (error) {
    return res.json({
      success: true,
      message: "found",
      data: error,
    });
  }
};
