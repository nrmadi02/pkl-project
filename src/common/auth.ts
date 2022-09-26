import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";

import { prisma } from "../server/db/client";
import { loginUserSchema } from "../server/schema/user.schema";
import { User } from "@prisma/client";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        nomorInduk: {
          label: "NIP/NIS",
          placeholder: "NIP/NIS",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const creds = await loginUserSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: { nomorInduk: creds.nomorInduk },
        }) as User;

        if (!user) {
          throw new Error('Pengguna tidak ditemukan')
        }

        const isValidPassword = await verify(user.password, creds.password);

        if (!isValidPassword) {
          throw new Error('Password salah')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          nomor_induk: user.nomorInduk,
          role: user.role
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nomor_induk = user.nomor_induk,
        token.role = user.role
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.email = token.email;
        session.nomor_induk = token.nomor_induk,
        session.role = token.role
      }

      return session;
    },
  },
  jwt: {
    secret: "super-secret",
    maxAge: 3 * 24 * 30 * 60, // 3 days
  },
  pages: {
    signIn: "/login",
    // newUser: "/sign-up",
  },
};