import type * as React from "react";

import { UserDashboardSidebar } from "@/components/user/user-dashboard-sidebar";
import { UserDashboardTopbar } from "@/components/user/user-dashboard-topbar";
import { cn } from "@/lib/cn";
import type { UserNavAccount } from "@/server/services/user-dashboard.service";

export function UserDashboardShell({
  children,
  account,
  className,
}: {
  children: React.ReactNode;
  account: UserNavAccount;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-[#f6f6f7] text-foreground", className)}>
      <UserDashboardTopbar account={account} />
      <div className="grid min-h-[calc(100vh-64px)] w-full grid-cols-1 lg:grid-cols-[260px_1fr]">
        <UserDashboardSidebar account={account} />
        <main className="min-w-0 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

