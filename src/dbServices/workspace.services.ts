import type { Prisma } from "@prisma/client";
import { prisma } from "../setup/prisma.setup.js";

const workspaceExistsWithSameNameForUser = async (userId: number, name: string) => {
  return await prisma.workspaces.findFirst({
    where: {
      owner_user_id: userId,
      name,
    },
    select: {
      id: true,
    },
  });
};

const createAWorkspace = async (userId: number, name: string) => {
  return await prisma.workspaces.create({
    data: {
      name,
      owner_user_id: userId,
      meta: {},
      users_workspaces: {
        create: {
          user_id: userId,
        },
      },
    },
  });
};

const getWorkspaceById = async (workspaceId: number) => {
  return await prisma.workspaces.findUnique({
    where: {
      id: workspaceId,
    },
  });
};

const updateWorkspaceById = async (workspaceId: number, payload: Prisma.WorkspacesUpdateInput) => {
  return await prisma.workspaces.update({
    where: { id: workspaceId },
    data: payload,
  });
};

const workspaceServices = {
  workspaceExistsWithSameNameForUser,
  createAWorkspace,
  getWorkspaceById,
  updateWorkspaceById,
};

export default workspaceServices;
