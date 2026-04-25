import type * as React from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { cn } from "@/lib/cn";

export function AdminShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-[#f6f6f7] text-foreground", className)}>
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[300px_1fr]">
        <AdminSidebar />
        <div className="min-w-0">
          <AdminTopbar />
          <main className="min-w-0 p-5 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

