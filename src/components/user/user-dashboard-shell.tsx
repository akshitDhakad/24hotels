import type * as React from "react";

import { UserDashboardSidebar } from "@/components/user/user-dashboard-sidebar";
import { UserDashboardTopbar } from "@/components/user/user-dashboard-topbar";
import { cn } from "@/lib/cn";

export function UserDashboardShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-[#f6f6f7] text-foreground", className)}>
      <UserDashboardTopbar />
      <div className="grid min-h-[calc(100vh-64px)] w-full grid-cols-1 lg:grid-cols-[260px_1fr]">
        <UserDashboardSidebar />
        <main className="min-w-0 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

