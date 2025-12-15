import { prisma } from "../setup/prisma.setup.js";

const getAllFilesWithMinimumData = async (workspaceId: number) => {
  // TODO:- modify it in future..
  return await prisma.files.findMany({
    where: {
      workspace_id: workspaceId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      kanban_board: {
        select: {
          id: true,
        },
      },
    },
  });
};

const fileServices = {
  getAllFilesWithMinimumData,
};

export default fileServices;
