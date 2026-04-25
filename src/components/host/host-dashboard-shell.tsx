import type * as React from "react";

import { HostDashboardSidebar } from "@/components/host/host-dashboard-sidebar";
import { HostDashboardTopbar } from "@/components/host/host-dashboard-topbar";
import { cn } from "@/lib/cn";

export function HostDashboardShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-[#f6f6f7] text-foreground", className)}>
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[280px_1fr]">
        <HostDashboardSidebar />
        <div className="min-w-0">
          <HostDashboardTopbar />
          <main className="min-w-0 p-5 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

