import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/decodeToken.middleware.js";
import { prisma } from "../setup/prisma.setup.js";

export const createWorkspace = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body;
    const { userId } = req.user;

    const doesWorkspaceExisits = await prisma.workspaces.findFirst({
      where: {
        owner_user_id: userId,
        name,
      },
      select: {
        id: true,
      },
    });

    if (doesWorkspaceExisits)
      return res.status(400).json({
        success: false,
        message: "Workspace exists with the same name",
      });

    const workspace = await prisma.workspaces.create({
      data: {
        name,
        owner_user_id: userId,
        meta: {},
        users_workspaces: {
          create: {
            user_id: userId,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "workspace created successfully",
      data: workspace,
    });
  } catch (error: any) {
    return res.status(error?.status || 500).json({
      success: false,
      message: error?.message || "Something went wrong",
      error: error?.response || error,
    });
  }
};

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
            owner: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    const formattedWorkspaces = workspaces.reduce((formattedRes, workspace) => {
      const obj = {
        joined_at: workspace.joined_at,
        owner_email: workspace.workspaces.owner.email,
        name: workspace.workspaces.name,
        created_at: workspace.workspaces.created_at,
      };
      formattedRes.push(obj);
      return formattedRes;
    }, [] as any);

    return res.json({
      success: true,
      data: formattedWorkspaces,
    });
  } catch (error: any) {
    return res.status(error?.status || 500).json({
      success: false,
      message: error?.message || "Something went wrong",
      error: error?.response || error,
    });
  }
};
