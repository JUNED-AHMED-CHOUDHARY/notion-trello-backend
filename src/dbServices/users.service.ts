import type { Prisma, Users } from "@prisma/client";
import { prisma } from "../config/prisma.setup.js";

// overloads it...
export function createUser(payload: Prisma.UsersCreateInput): Promise<Users>;
export function createUser(
  payload: Prisma.UsersCreateInput,
  include: Prisma.UsersInclude,
  transactionalPrisma?: Prisma.TransactionClient | undefined,
): Promise<Prisma.UsersGetPayload<{ include: Prisma.UsersInclude }>>;

export async function createUser(
  payload: Prisma.UsersCreateInput,
  include?: Prisma.UsersInclude,
  transactionalPrisma?: Prisma.TransactionClient | undefined,
): Promise<unknown> {
  const client = transactionalPrisma ?? prisma;
  return await client.users.create({
    data: payload,
    include,
  });
}

export function findUniqueUser(
  where: Prisma.UsersWhereUniqueInput,
): Promise<Users>;
export function findUniqueUser(
  where: Prisma.UsersWhereUniqueInput,
  include: Prisma.UsersInclude,
  transactionalPrisma?: Prisma.TransactionClient | undefined,
): Promise<Prisma.UsersGetPayload<{ include: Prisma.UsersInclude }>>;

export async function findUniqueUser(
  where: Prisma.UsersWhereUniqueInput,
  include?: Prisma.UsersInclude,
  transactionalPrisma?: Prisma.TransactionClient | undefined,
): Promise<unknown> {
  const client = transactionalPrisma ?? prisma;
  return await client.users.findUnique({
    where,
    include,
  });
}
