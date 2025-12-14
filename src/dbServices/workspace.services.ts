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

const workspaceServices = {
  workspaceExistsWithSameNameForUser,
  createAWorkspace,
};

export default workspaceServices;
