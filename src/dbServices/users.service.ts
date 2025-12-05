import { Prisma, type Users } from "@prisma/client";
import { prisma } from "../setup/prisma.setup.js";
import { getDataFromRedis, storeInCacheWithTTL } from "../utility/redisUtility.js";
const userEmailToIdsPrefix = "userEmail-userId";
// overloads it...
export function createUser(payload: Prisma.UsersCreateInput): Promise<Users>;
export function createUser(
  payload: Prisma.UsersCreateInput,
  include: Prisma.UsersInclude,
  transactionalPrisma?: Prisma.TransactionClient | undefined
): Promise<Prisma.UsersGetPayload<{ include: Prisma.UsersInclude }>>;

export async function createUser(
  payload: Prisma.UsersCreateInput,
  include?: Prisma.UsersInclude,
  transactionalPrisma?: Prisma.TransactionClient | undefined
): Promise<unknown> {
  const client = transactionalPrisma ?? prisma;
  return await client.users.create({
    data: payload,
    include,
  });
}

export function findUniqueUser(where: Prisma.UsersWhereUniqueInput): Promise<Users>;
export function findUniqueUser(
  where: Prisma.UsersWhereUniqueInput,
  include: Prisma.UsersInclude,
  transactionalPrisma?: Prisma.TransactionClient | undefined
): Promise<Prisma.UsersGetPayload<{ include: Prisma.UsersInclude }>>;

export async function findUniqueUser(
  where: Prisma.UsersWhereUniqueInput,
  include?: Prisma.UsersInclude,
  transactionalPrisma?: Prisma.TransactionClient | undefined
): Promise<unknown> {
  const client = transactionalPrisma ?? prisma;
  return await client.users.findUnique({
    where,
    include,
  });
}

export const getUserIdFromCacheFromEmail = async (email: string): Promise<number | undefined> => {
  const key = `${userEmailToIdsPrefix}:${email}`;
  const cacheData = (await getDataFromRedis(key)) as number;
  if (cacheData) return cacheData;

  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
    },
  });

  if (user?.id) await storeInCacheWithTTL(key, user?.id, 5 * 60); // 5 minutes
  return user?.id;
};
