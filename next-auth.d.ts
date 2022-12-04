import { User } from "@prisma/client";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    // what ever properties added, add type here
    id: User.id;
    email: User.email;
    nomorInduk: User.nomorInduk;
    role: User.role;
  }
}
