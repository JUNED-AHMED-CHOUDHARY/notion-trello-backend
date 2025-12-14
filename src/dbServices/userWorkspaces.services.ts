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

const userWorkspaceServices = {
  getAllUserWorkspacesWithMinimumData,
};

export default userWorkspaceServices;
