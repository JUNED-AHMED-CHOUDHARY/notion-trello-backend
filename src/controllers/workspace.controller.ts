import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/decodeToken.middleware.js";
import workspaceServices from "../dbServices/workspace.services.js";
import userWorkspaceServices from "../dbServices/userWorkspaces.services.js";

export const createWorkspace = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.body;
    const { userId } = req.user;

    const doesWorkspaceExisits = await workspaceServices.workspaceExistsWithSameNameForUser(userId, name);

    if (doesWorkspaceExisits) {
      return res.status(400).json({
        success: false,
        message: "Workspace exists with the same name",
      });
    }

    const workspace = await workspaceServices.createAWorkspace(userId, name);

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

    const workspaces = await userWorkspaceServices.getAllUserWorkspacesWithMinimumData(userId);
    // below will be shifted to frontend server actions in future..
    const formattedWorkspaces = workspaces.reduce((formattedRes, workspace) => {
      const obj = {
        joined_at: workspace.joined_at,
        owner_email: workspace.workspaces.owner.email,
        name: workspace.workspaces.name,
        created_at: workspace.workspaces.created_at,
        id: workspace.workspaces.id,
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
