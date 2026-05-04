"use client";

import * as React from "react";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button";

export function AdminUserActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [busy, setBusy] = React.useState<null | "details" | "delete">(null);
  const [error, setError] = React.useState<string | null>(null);
  const [details, setDetails] = React.useState<any>(null);

  async function loadDetails() {
    setError(null);
    setDetailsOpen(true);
    if (details) return;
    setBusy("details");
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`);
      const json = (await res.json()) as { success?: boolean; message?: string; data?: unknown };
      if (!res.ok || json.success === false) throw new Error(json.message ?? "Could not load details.");
      setDetails(json.data ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load details.");
    } finally {
      setBusy(null);
    }
  }

  async function deleteUser() {
    setError(null);
    if (!confirm("Delete this user? This will disable their account.")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || json.success === false) throw new Error(json.message ?? "Could not delete user.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete user.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="h-full">
      <ActionMenu
        items={[
          { key: "details", label: "View details", icon: <Eye className="h-4 w-4 text-black/55" />, onClick: loadDetails },
          { type: "separator", key: "sep-1" },
          { key: "delete", label: "Delete user", icon: <Trash2 className="h-4 w-4" />, tone: "destructive", onClick: deleteUser, disabled: busy !== null },
        ]}
      />

      {detailsOpen ? (
        <div className="fixed inset-0 z-[80]">
          <button type="button" className="absolute inset-0 bg-black/30" aria-label="Close details" onClick={() => setDetailsOpen(false)} />
          <div className="absolute left-1/2 top-1/2 w-[min(760px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-black/10 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-black/45">User details</div>
                <div className="mt-1 truncate text-xl font-semibold">{details?.name ?? "—"}</div>
                <div className="mt-1 truncate text-sm text-black/55">{details?.email ?? "—"}</div>
              </div>
              <Button variant="outline" className="h-9 rounded-xl border-black/10 bg-white px-3" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </div>

            {error ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">{error}</div> : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-[11px] font-semibold tracking-wide text-black/45">ROLE</div>
                <div className="mt-2 text-sm font-semibold">{details?.role ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-[11px] font-semibold tracking-wide text-black/45">COUNTS</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-black/60">
                  <div>Bookings: <span className="font-semibold text-black/80">{details?._count?.bookings ?? "—"}</span></div>
                  <div>Hotels: <span className="font-semibold text-black/80">{details?._count?.hotels ?? "—"}</span></div>
                  <div>Reviews: <span className="font-semibold text-black/80">{details?._count?.reviews ?? "—"}</span></div>
                  <div>Loyalty: <span className="font-semibold text-black/80">{details?.loyaltyPoints ?? "—"}</span></div>
                </div>
              </div>
            </div>

            {busy === "details" ? <div className="mt-4 text-xs text-black/45">Loading…</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

