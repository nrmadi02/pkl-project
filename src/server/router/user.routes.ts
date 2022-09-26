import { createRouter } from "./context";
import { createUserSchema } from '../schema/user.schema';
import { hash } from "argon2";
import * as trpc from "@trpc/server";
import { User } from "@prisma/client";

export const userRoutes = createRouter()
  .mutation("create", {
    input: createUserSchema,
    resolve: async ({ input, ctx }) => {
      const { email, name, nomorInduk, password, role } = input
      const exists = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            {nomorInduk},
            {email}
          ]
        },
      });

      if (exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "User sudah terdaftar.",
        });
      }
      const hashedPassword = await hash(password);

      const result = await ctx.prisma.user.create({
        data: { email, name, nomorInduk, password: hashedPassword, role },
      }) as User;


      return {
        status: 201,
        message: "Account created successfully",
        result: {
          email: result.email,
          nama: result.name,
          nomor_induk: result.nomorInduk,
          role: result.role
        },
      };
    }
  })
