import { z as zod } from "zod";
import { userIdSchema } from "./common.js";

const workspaceNameSchema = zod.string().min(3, "Workspace name must have at least 3 charactors").max(60, "Workspace name at most have 60 charactors long");

export const createWorkspaceSchema = zod.object({
  name: workspaceNameSchema,
});

export const updateWorkspaceSchema = zod
  .object({
    name: workspaceNameSchema,
    meta: zod.json(),
  })
  .partial();

export const transferWorkspaceSchema = zod.object({
  ownerUserId: userIdSchema,
});
