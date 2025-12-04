import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/decodeToken.middleware.js";
import { prisma } from "../setup/prisma.setup.js";

export const getAllWorkspaces = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.user;

    const workspaces = await prisma.users_workspaces.findMany({
      where: {
        user_id: userId,
      },
      select: {
        joined_at: true,
        workspaces: {
          select: {
            id: true,
            name: true,
            owner_user_id: true,
            created_at: true,
          },
        },
      },
    });
    console.log(workspaces, "asfiafioafio");
    return res.json({
      success: true,
      data: workspaces,
    });
  } catch (error: any) {
    return res.status(error?.status || 500).json({
      success: false,
      message: error?.message || "Something went wrong",
      error: error?.response || error,
    });
  }
};
