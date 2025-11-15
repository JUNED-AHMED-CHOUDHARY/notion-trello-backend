import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateJWTToken = (
  payload: JwtPayload,
  options: SignOptions = { expiresIn: "1d" },
): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, options);
};

export const decodeJWTToken = async (token: string): Promise<JwtPayload> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return decoded;
  } catch (error: any) {
    throw new Error("Invalid or expired token", error);
  }
};
