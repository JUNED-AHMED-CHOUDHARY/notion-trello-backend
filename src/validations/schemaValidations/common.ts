import { z as zod } from "zod";

export const userIdSchema = zod.string().min(1, "UserId is required").regex(/^\d+$/, "UserId must be a numeric string");

export const workspaceIdInParamsValidation = zod.object({
  workspaceId: zod.string().min(1, "workspaceId is required").regex(/^\d+$/, "workspaceId must be a numeric string"),
});
