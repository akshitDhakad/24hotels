import { requireSession } from "@/server/utils/require-session";

/** Ensures a signed-in admin for `/admin/*` routes (JWT session). */
export async function requireAdminSession() {
  return requireSession({ allowRoles: ["ADMIN"], callbackUrl: "/admin/dashboard" });
}

