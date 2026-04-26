import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/server/config/auth";
import type { Role, SessionUser } from "@/server/types/auth.types";

export type AuthedSession = { user: SessionUser };

export async function requireSession(opts?: { allowRoles?: Role[]; callbackUrl?: string }): Promise<AuthedSession> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const cb = opts?.callbackUrl ? `?callbackUrl=${encodeURIComponent(opts.callbackUrl)}` : "";
    redirect(`/auth/sign-in${cb}`);
  }
  const allow = opts?.allowRoles;
  if (allow && !allow.includes(session.user.role)) {
    redirect("/");
  }
  return { user: session.user };
}

