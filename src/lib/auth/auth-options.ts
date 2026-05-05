import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { loginWithGateway } from "@/lib/auth/gateway-login";
import { LoginSchema } from "@/lib/schemas/login.schema";
import { SESSION_MAX_AGE_SEC } from "@/lib/auth/session-constants";
import { mapGatewayRole, type Role, type SessionUser } from "@/lib/auth/types";
import { inferRegistrationChannel } from "@/lib/legacy-server/utils/registration-channel";

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
        email: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const identifier = (parsed.data.identifier ?? parsed.data.email ?? "").trim();
        const password = parsed.data.password;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const isPhone = /^\+[1-9]\d{7,14}$/.test(identifier);
        if (!isEmail && !isPhone) return null;

        if (isEmail) {
          const json = await loginWithGateway(identifier, password);
          if (json?.user?.id && json.accessToken) {
            const u = json.user;
            return {
              id: u.id,
              email: u.email,
              phone: u.phone ?? null,
              name: u.name ?? null,
              image: null,
              role: mapGatewayRole(u.role) as Role,
              loyaltyPoints: 0,
              emailVerified: !!u.isVerified,
              phoneVerified: false,
              registrationChannel: "EMAIL" as const,
              accessToken: json.accessToken,
              refreshToken: json.refreshToken ?? "",
            };
          }
        }

        const user = await prisma.user.findFirst({
          where: {
            deletedAt: null,
            ...(isEmail ? { email: identifier.toLowerCase() } : { phone: identifier }),
          },
          select: {
            id: true,
            email: true,
            phone: true,
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
          phone: user.phone,
          name: user.name,
          image: user.image,
          role: user.role as Role,
          loyaltyPoints: user.loyaltyPoints,
          accessToken: "",
          refreshToken: "",
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
      if (!row) return true;
      return !row.deletedAt;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        const dbUser = await prisma.user.findFirst({
          where: { id: user.id, deletedAt: null },
          select: {
            id: true,
            email: true,
            phone: true,
            name: true,
            image: true,
            role: true,
            loyaltyPoints: true,
            emailVerified: true,
            phoneVerified: true,
            registrationContactType: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.phone = dbUser.phone ?? null;
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.role = dbUser.role as Role;
          token.loyaltyPoints = dbUser.loyaltyPoints;
          token.emailVerified = !!dbUser.emailVerified;
          token.phoneVerified = !!dbUser.phoneVerified;
          token.registrationChannel = inferRegistrationChannel(dbUser);
        } else {
          const u = user as SessionUser & { accessToken?: string; refreshToken?: string };
          token.id = u.id;
          token.email = u.email;
          token.phone = u.phone ?? null;
          token.name = u.name;
          token.picture = u.image;
          token.role = u.role;
          token.loyaltyPoints = u.loyaltyPoints ?? 0;
          token.emailVerified = u.emailVerified;
          token.phoneVerified = u.phoneVerified;
          token.registrationChannel = u.registrationChannel;
          token.accessToken = (user as { accessToken?: string }).accessToken;
          token.refreshToken = (user as { refreshToken?: string }).refreshToken;
        }
      }
      if (trigger === "update") {
        const patch = session as
          | {
              role?: Role;
              loyaltyPoints?: number;
              name?: string | null;
              email?: string;
              image?: string | null;
              phone?: string | null;
              emailVerified?: boolean;
              phoneVerified?: boolean;
              registrationChannel?: "EMAIL" | "PHONE";
            }
          | undefined;
        if (patch?.role) token.role = patch.role;
        if (typeof patch?.loyaltyPoints === "number") token.loyaltyPoints = patch.loyaltyPoints;
        if (patch?.name !== undefined) token.name = patch.name;
        if (patch?.email) token.email = patch.email;
        if (patch?.image !== undefined) token.picture = patch.image;
        if (patch?.phone !== undefined) token.phone = patch.phone;
        if (typeof patch?.emailVerified === "boolean") token.emailVerified = patch.emailVerified;
        if (typeof patch?.phoneVerified === "boolean") token.phoneVerified = patch.phoneVerified;
        if (patch?.registrationChannel) token.registrationChannel = patch.registrationChannel;
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
        (session.user as SessionUser).phone = (token.phone as string | null | undefined) ?? null;
        (session.user as SessionUser).email = (token.email as string | undefined) ?? session.user.email;
        (session.user as SessionUser).name = (token.name as string | null | undefined) ?? session.user.name;
        (session.user as SessionUser).image = (token.picture as string | null | undefined) ?? session.user.image;
        (session.user as SessionUser).emailVerified =
          typeof token.emailVerified === "boolean" ? token.emailVerified : undefined;
        (session.user as SessionUser).phoneVerified =
          typeof token.phoneVerified === "boolean" ? token.phoneVerified : undefined;
        (session.user as SessionUser).registrationChannel =
          (token.registrationChannel as "EMAIL" | "PHONE" | undefined) ?? undefined;
      }
      (session as { accessToken?: string }).accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: SessionUser;
    accessToken?: string;
  }
  interface User {
    role?: Role;
    loyaltyPoints?: number;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    loyaltyPoints: number;
    phone?: string | null;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    registrationChannel?: "EMAIL" | "PHONE";
    accessToken?: string;
    refreshToken?: string;
  }
}
