import type * as React from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/server/utils/require-admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();
  return <AdminShell>{children}</AdminShell>;
}

