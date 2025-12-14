import { z as zod } from "zod";

export const workspaceIdInParamsValidation = zod.object({
  workspaceId: zod.string().min(1, "workspaceId is required").regex(/^\d+$/, "workspaceId must be a numeric string"),
});
