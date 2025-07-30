
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      avatarUrl: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    username: string;
    avatarUrl: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    username: string;
    avatarUrl: string;
  }
}
