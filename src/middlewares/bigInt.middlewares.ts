import type { NextFunction, Response, Request } from "express";
import JSONbig from "json-bigint";

export const stringToBigIntConverter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let rawData = "";
  req.on("data", (chunk) => {
    rawData += chunk;
  });
  req.on("end", () => {
    if (rawData) {
      try {
        req.body = JSONbig.parse(rawData);
      } catch {
        req.body = {};
      }
    }
    next();
  });
};

export const bigIntToStringConverter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.json = (data: any) => {
    const jsonStr = JSONbig.stringify(data);
    res.setHeader("Content-Type", "application/json");
    return res.send(jsonStr);
  };
  next();
};
