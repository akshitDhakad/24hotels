import { getServerSession } from "next-auth";

import { authOptions } from "@/server/config/auth";
import { Errors } from "@/server/errors/errorFactory";
import type { Role } from "@/server/types/auth.types";

export async function requireSessionApi(allowRoles?: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw Errors.Unauthorized();
  if (allowRoles && !allowRoles.includes(session.user.role)) throw Errors.Forbidden();
  return session.user;
}

