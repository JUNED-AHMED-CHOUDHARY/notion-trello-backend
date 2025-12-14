// src/validations/validators/validateRequest.ts
import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodIssue, type ZodSchema } from "zod";

type RequestParts = "body" | "query" | "params";

type SchemaMap = Partial<Record<RequestParts, ZodSchema<any>>>;

export const zodValidationMiddleWare = (schemas: SchemaMap) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue: ZodIssue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        return res.status(400).json({
          status: "fail",
          errors: formattedErrors,
        });
      }
      return next(error);
    }
  };
};
