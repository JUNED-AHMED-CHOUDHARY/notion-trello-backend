import { prisma } from "../setup/prisma.setup.js";

const getAllUserWorkspacesWithMinimumData = async (userId: number) => {
  return await prisma.users_workspaces.findMany({
    where: {
      user_id: userId,
    },
    select: {
      joined_at: true,
      workspaces: {
        select: {
          id: true,
          name: true,
          owner_user_id: true,
          created_at: true,
          owner: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });
};

const doesUserHaveAccessInWorkspace = async (userId: number, workspaceId: number) => {
  return await prisma.users_workspaces.findUnique({
    where: {
      workspace_id_user_id: {
        user_id: userId,
        workspace_id: workspaceId,
      },
    },
    select: {
      id: true,
    },
  });
};

const userWorkspaceServices = {
  getAllUserWorkspacesWithMinimumData,
  doesUserHaveAccessInWorkspace,
};

export default userWorkspaceServices;
