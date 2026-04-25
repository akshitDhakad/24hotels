import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/server/config/auth";
import type { SessionUser } from "@/server/types/auth.types";

export type CustomerSession = {
  user: SessionUser;
};

/** Ensures a signed-in customer for `/user/*` routes (JWT session). */
export async function requireCustomerSession(): Promise<CustomerSession> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/sign-in?callbackUrl=/user/dashboard");
  }
  const { role } = session.user;
  if (role === "HOST") redirect("/host/dashboard");
  if (role === "ADMIN") redirect("/admin/dashboard");
  if (role !== "USER") redirect("/");
  return { user: session.user };
}
