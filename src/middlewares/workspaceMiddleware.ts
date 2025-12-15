import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./decodeToken.middleware.js";
import userWorkspaceServices from "../dbServices/userWorkspaces.services.js";

export const userWorkspaceAccessMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user;
    const workspaceId = Number(req.params.workspaceId);

    const entryFound = !!(await userWorkspaceServices.doesUserHaveAccessInWorkspace(userId, workspaceId));

    if (!entryFound) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
      error: error?.message || error,
    });
  }
};
