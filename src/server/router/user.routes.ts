import { string, z } from 'zod';
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
            { nomorInduk },
            { email }
          ]
        },
      });
      if (exists) {
        return {
          status: "400",
          message: "User sudah terdaftar",
        };
      }
      const hashedPassword = await hash(password);
      const result = await ctx.prisma.user.create({
        data: { email, name, nomorInduk, password: hashedPassword, role },
      }) as User;
      return {
        status: 201,
        message: "User berhasil ditambahkan",
        result: {
          email: result.email,
          nama: result.name,
          nomor_induk: result.nomorInduk,
          role: result.role
        },
      };
    }
  })
  .mutation('deleteUser', {
    input: z.object({
      id: z.string()
    }),
    resolve: async ({ input, ctx }) => {
      const deleteGuru = ctx.prisma.guru.deleteMany({
        where: {
          userID: input.id
        }
      })
      const deleteUser = ctx.prisma.user.delete({
        where: {
          id: input.id
        }
      })
      await ctx.prisma.$transaction([deleteGuru, deleteUser])
      return {
        status: 200,
        message: 'User berhasil dihapus',
      }
    }
  })
  .query('getAllUsers', {
    resolve: async ({ ctx }) => {
      const users = await ctx.prisma.user.findMany({
        select: {
          email: true,
          id: true,
          nomorInduk: true,
          role: true,
          updatedAt: true,
          createdAt: true,
          name: true
        }
      }) as User[]
      return {
        status: 200,
        message: "Get all data user berhasil",
        result: users,
      };
    }
  })
