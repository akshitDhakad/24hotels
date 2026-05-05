import { requireSession } from "@/lib/auth/require-session";

export async function requireHostSession() {
  return requireSession({ allowRoles: ["HOST"] });
}
