import type { NextFunction, Request, Response } from "express";
import { decodeJWTToken } from "../utility/controller.utility.js";
import { getUserIdFromCacheFromEmail } from "../dbServices/users.service.js";

export interface AuthenticatedRequest<T = any> extends Request {
  user?: T;
}
export const decodeAccessToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

    const token = authorization?.replace("Bearer ", "");

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

    const user = await decodeJWTToken(token);

    if (!user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

    const userId = await getUserIdFromCacheFromEmail(user?.email);

    req.user = { ...user, userId };

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: error?.message || error,
    });
  }
};
