// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db/client";
import { unstable_getServerSession } from "next-auth"; 
import { nextAuthOptions } from "../../common/auth"; 

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  const {req, res} = opts
  const session = await unstable_getServerSession(req, res, nextAuthOptions); // 👈 added this
  return {
    prisma,
    session,
    req,
    res
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
