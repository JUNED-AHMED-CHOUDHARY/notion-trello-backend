import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/decodeToken.middleware.js";

export const getAllWorkspaces = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user = req.user;
    console.log(user);

    return res.status(201).json({
      success: true,
    });
  } catch (error: any) {
    return res.status(error?.status || 500).json({
      success: false,
      message: error?.message || "Something went wrong",
      error: error?.response || error,
    });
  }
};
