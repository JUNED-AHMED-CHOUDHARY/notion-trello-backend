import { z as zod } from "zod";

export const createWorkspaceSchema = zod.object({
  name: zod.string().min(3, "Workspace name must have at least 3 charactors").max(60, "Workspace name at most have 60 charactors long"),
});
