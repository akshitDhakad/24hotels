import { requireSession } from "@/server/utils/require-session";

export async function requireHostSession() {
  return requireSession({ allowRoles: ["HOST"], callbackUrl: "/host/dashboard" });
}

