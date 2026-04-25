import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/server/config/database";
import { env } from "@/server/config/env";
import { SESSION_MAX_AGE_SEC } from "@/server/constants/session";
import { LoginSchema } from "@/server/schemas/auth.schema";
import type { Role, SessionUser } from "@/server/types/auth.types";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SEC },
  jwt: { maxAge: SESSION_MAX_AGE_SEC },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await prisma.user.findFirst({
          where: { email, deletedAt: null },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            loyaltyPoints: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role as Role,
          loyaltyPoints: user.loyaltyPoints,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.id) return true;
      const row = await prisma.user.findUnique({
        where: { id: user.id },
        select: { deletedAt: true },
      });
      return !row?.deletedAt;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        const dbUser = await prisma.user.findFirst({
          where: { id: user.id, deletedAt: null },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            loyaltyPoints: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.role = dbUser.role as Role;
          token.loyaltyPoints = dbUser.loyaltyPoints;
        }
      }
      if (trigger === "update") {
        const patch = session as { role?: Role; loyaltyPoints?: number } | undefined;
        if (patch?.role) token.role = patch.role;
        if (typeof patch?.loyaltyPoints === "number") token.loyaltyPoints = patch.loyaltyPoints;
      }
      return token;
    },
    async session({ session, token }) {
      const role = (token.role as Role | undefined) ?? "USER";
      const loyaltyPoints = typeof token.loyaltyPoints === "number" ? token.loyaltyPoints : 0;
      if (session.user) {
        (session.user as SessionUser).id = token.id as string;
        (session.user as SessionUser).role = role;
        (session.user as SessionUser).loyaltyPoints = loyaltyPoints;
      }
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
  interface User {
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    loyaltyPoints: number;
  }
}
