import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/auth-options";
import type { SessionUser } from "@/lib/auth/types";

export async function requireCustomerSession(): Promise<{ user: SessionUser }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }
  if (session.user.role !== "USER") {
    redirect("/");
  }
  return { user: session.user };
}
