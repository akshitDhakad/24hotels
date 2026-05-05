import { requireSession } from "@/lib/auth/require-session";

export async function requireAdminSession() {
  return requireSession({ allowRoles: ["ADMIN"] });
}
