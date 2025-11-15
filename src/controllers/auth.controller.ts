import { type Request, type Response } from "express";
import { Prisma } from "@prisma/client";
import { createUser, findUniqueUser } from "../dbServices/users.service.js";
import { createAccount, updateAccount } from "../dbServices/account.service.js";
import { prisma } from "../setup/prisma.setup.js";
import type { JwtPayload } from "jsonwebtoken";
import { generateJWTToken } from "../utility/controller.utility.js";

export const oAuthLoginSignUp = async (req: Request, res: Response) => {
  try {
    const { user, account } = req.body;
    if (!user || !account || !user.email) {
      return res
        .status(400)
        .json({ message: "Missing required user or account data" });
    }

    const { email, name } = user; // image remains will have to add this in db..
    const { provider, provider_account_id, access_token } = account;

    // delete account.provider;

    const includeClause: Prisma.UsersInclude = {
      accounts: {
        where: {
          provider,
        },
      },
    };
    const { dbUser, newAccount } = await prisma.$transaction(
      async (transactionalPrisma) => {
        let dbUser = await findUniqueUser(
          { email },
          includeClause,
          transactionalPrisma,
        );
        let newAccount = false;
        if (!dbUser) {
          const payload: Prisma.UsersCreateInput = {
            name,
            email,
            meta: {},
            accounts: {
              create: account,
            },
          };

          dbUser = await createUser(
            payload,
            includeClause,
            transactionalPrisma,
          );
          newAccount = true;
        }
        const existingAccount = dbUser.accounts.find(
          (account) => provider_account_id === account.provider_account_id,
        );
        if (!existingAccount) {
          await createAccount(
            {
              user: {
                connect: {
                  id: dbUser.id,
                },
              },
              ...account,
            },
            transactionalPrisma,
          );
        } else if (existingAccount.access_token !== access_token) {
          await updateAccount(
            { id: existingAccount.id },
            { access_token },
            transactionalPrisma,
          );
        }

        return { dbUser, newAccount };
      },
    );

    // jwt send..
    // TODO :-
    // new user send welcome mail..

    return res.status(newAccount ? 201 : 200).json({
      message: `${newAccount ? "User Created " : "Logged in "} Successfully`,
      data: {
        dbUser,
        provider,
        provider_account_id,
      },
    });
  } catch (error: any) {
    return res.status(error.status || 500).json({
      message: error.message || error,
    });
  }
};

export const getToken = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    const jwtPayload: JwtPayload = { email, name };

    const token = generateJWTToken(jwtPayload);

    return res.json({
      message: "Got token successfully",
      token,
    });
  } catch (error: any) {
    return res.status(error.status || 500).json({
      message: error.message || "Error while generating token",
    });
  }
};
