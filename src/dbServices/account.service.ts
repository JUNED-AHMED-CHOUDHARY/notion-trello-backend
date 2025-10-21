import type { Prisma } from "@prisma/client";
import { prisma } from "../setup/prisma.setup.js";

export const createAccount = async (
  payload: Prisma.AccountCreateInput,
  transactionalPrisma?: Prisma.TransactionClient | undefined,
) => {
  const client = transactionalPrisma ?? prisma;
  return await client.account.create({
    data: payload,
  });
};

export const updateAccount = async (
  where: Prisma.AccountWhereUniqueInput,
  payload: Prisma.AccountUpdateInput,
  transactionalPrisma?: Prisma.TransactionClient | undefined,
) => {
  const client = transactionalPrisma ?? prisma;
  return await client.account.update({
    where,
    data: payload,
  });
};
