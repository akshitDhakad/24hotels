"use client";

import * as React from "react";
import { ExternalLink, Eye, ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { ActionMenu } from "@/components/ui/action-menu";
import { Button } from "@/components/ui/button";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function AdminPropertyActions({
  hotelId,
  hotelSlug,
  ownerId,
  isActive,
  isVerified,
  nightlyInr,
}: {
  hotelId: string;
  hotelSlug: string;
  ownerId: string;
  isActive: boolean;
  isVerified: boolean;
  nightlyInr: number;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [busy, setBusy] = React.useState<null | "status" | "verify" | "deleteHotel" | "deleteHost" | "details">(null);
  const [error, setError] = React.useState<string | null>(null);
  const [details, setDetails] = React.useState<any>(null);

  async function patchHotel(next: { isActive?: boolean; isVerified?: boolean }) {
    setError(null);
    const res = await fetch(`/api/v1/admin/hotels/${hotelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const json = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok || json.success === false) throw new Error(json.message ?? "Could not update listing.");
    router.refresh();
  }

  async function removeHotel() {
    setError(null);
    const res = await fetch(`/api/v1/admin/hotels/${hotelId}`, { method: "DELETE" });
    const json = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok || json.success === false) throw new Error(json.message ?? "Could not delete listing.");
    router.refresh();
  }

  async function removeHost() {
    setError(null);
    const res = await fetch(`/api/v1/admin/users/${ownerId}`, { method: "DELETE" });
    const json = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok || json.success === false) throw new Error(json.message ?? "Could not delete host.");
    router.refresh();
  }

  async function openDetails() {
    setError(null);
    setDetailsOpen(true);
    if (details) return;
    setBusy("details");
    try {
      const res = await fetch(`/api/v1/admin/hotels/${hotelId}`, { method: "GET" });
      const json = (await res.json()) as { success?: boolean; message?: string; data?: unknown };
      if (!res.ok || json.success === false) throw new Error(json.message ?? "Could not load details.");
      setDetails(json.data ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load details.");
    } finally {
      setBusy(null);
    }
  }

  const statusLabel = !isActive ? "Paused" : isVerified ? "Live" : "Pending";
  const fmtDate = React.useMemo(
    () => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    [],
  );
  const host = details?.owner;
  const kyc = host?.hostKyc;
  const settings = host?.hostSettings;
  const profile = host?.profile;

  return (
    <div className="h-full">
      <ActionMenu
        items={[
          {
            key: "details",
            label: "View details",
            icon: <Eye className="h-4 w-4 text-black/55" />,
            onClick: openDetails,
          },
          {
            type: "link",
            key: "public",
            label: "Open public page",
            icon: <ExternalLink className="h-4 w-4 text-black/55" />,
            href: `/hotels/${hotelSlug}`,
            target: "_blank",
          },
          { type: "separator", key: "sep-1" },
          ...(!isActive || !isVerified
            ? ([
              {
                key: "go-live",
                label: "Go live",
                icon: <ShieldCheck className="h-4 w-4 text-black/55" />,
                onClick: async () => {
                  setBusy("status");
                  try {
                    await patchHotel({ isActive: true, isVerified: true });
                  } finally {
                    setBusy(null);
                  }
                },
                disabled: busy !== null,
                rightLabel: statusLabel,
              },
              { type: "separator", key: "sep-go-live" },
            ] satisfies Array<Parameters<typeof ActionMenu>[0]["items"][number]>)
            : []),
          {
            key: "active",
            label: isActive ? "Pause listing" : "Activate listing",
            onClick: async () => {
              setBusy("status");
              try {
                await patchHotel({ isActive: !isActive });
              } finally {
                setBusy(null);
              }
            },
            disabled: busy !== null,
            rightLabel: isActive ? "Active" : "Inactive",
          },
          {
            key: "verify",
            label: isVerified ? "Unverify listing" : "Mark as verified",
            icon: isVerified ? <ShieldX className="h-4 w-4 text-black/55" /> : <ShieldCheck className="h-4 w-4 text-black/55" />,
            onClick: async () => {
              setBusy("verify");
              try {
                await patchHotel({ isVerified: !isVerified });
              } finally {
                setBusy(null);
              }
            },
            disabled: busy !== null,
            rightLabel: isVerified ? "Verified" : "Not verified",
          },
          { type: "separator", key: "sep-2" },
          {
            key: "delete-hotel",
            label: "Delete property",
            icon: <Trash2 className="h-4 w-4" />,
            tone: "destructive",
            onClick: async () => {
              if (!confirm("Delete this property? This will hide it from the platform.")) return;
              setBusy("deleteHotel");
              try {
                await removeHotel();
              } finally {
                setBusy(null);
              }
            },
            disabled: busy !== null,
          },
          {
            key: "delete-host",
            label: "Delete host",
            icon: <Trash2 className="h-4 w-4" />,
            tone: "destructive",
            onClick: async () => {
              if (!confirm("Delete this host? This will disable all their properties.")) return;
              setBusy("deleteHost");
              try {
                await removeHost();
              } finally {
                setBusy(null);
              }
            },
            disabled: busy !== null,
          },
        ]}
      />

      {detailsOpen ? (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close details"
            onClick={() => setDetailsOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[min(760px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-black/10 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-black/45">Property details</div>
                <div className="mt-1 truncate text-xl font-semibold">{details?.name ?? "—"}</div>
                <div className="mt-1 text-sm text-black/55">
                  {details?.city ? `${details.city}, ${details.country ?? ""}` : "—"}
                </div>
              </div>
              <Button variant="outline" className="h-9 rounded-xl border-black/10 bg-white px-3" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">{error}</div>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-[11px] font-semibold tracking-wide text-black/45">STATUS</div>
                <div className="mt-2 text-sm font-semibold">
                  {details ? (details.isActive && details.isVerified ? "Live" : "Paused") : statusLabel}
                </div>
                <div className="mt-1 text-xs text-black/45">Active: {String(details?.isActive ?? isActive)} · Verified: {String(details?.isVerified ?? isVerified)}</div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-[11px] font-semibold tracking-wide text-black/45">NIGHTLY</div>
                <div className="mt-2 text-sm font-semibold">{formatInr(Math.round(details?.priceUsd ?? nightlyInr))}</div>
                <div className="mt-1 text-xs text-black/45">Stored as ₹ (legacy field name `priceUsd`).</div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-[11px] font-semibold tracking-wide text-black/45">HOST</div>
                <div className="mt-2 text-sm font-semibold">{host?.name ?? "—"}</div>
                <div className="mt-1 truncate text-xs text-black/55">{host?.email ?? "—"}</div>
                <div className="mt-1 truncate text-xs text-black/55">{host?.phone ?? "—"}</div>
                <div className="mt-2 grid gap-1 text-[11px] text-black/45">
                  <div>
                    KYC: <span className="font-semibold text-black/70">{kyc?.status ?? "—"}</span>
                  </div>
                  <div>
                    Payout: <span className="font-semibold text-black/70">{settings?.payoutStatus ?? "—"}</span>
                  </div>
                  <div>
                    Compliance: <span className="font-semibold text-black/70">{settings?.complianceStatus ?? "—"}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-[11px] font-semibold tracking-wide text-black/45">COUNTS</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-black/60">
                  <div>Rooms: <span className="font-semibold text-black/80">{details?._count?.rooms ?? "—"}</span></div>
                  <div>Gallery: <span className="font-semibold text-black/80">{details?._count?.gallery ?? "—"}</span></div>
                  <div>Bookings: <span className="font-semibold text-black/80">{details?._count?.bookings ?? "—"}</span></div>
                  <div>Reviews: <span className="font-semibold text-black/80">{details?._count?.reviews ?? "—"}</span></div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-[11px] font-semibold tracking-wide text-black/45">HOST BUSINESS</div>
                <div className="mt-2 grid gap-1 text-xs text-black/60">
                  <div>
                    Business name: <span className="font-semibold text-black/80">{settings?.businessName ?? "—"}</span>
                  </div>
                  <div className="truncate">
                    Business email:{" "}
                    <span className="font-semibold text-black/80">{settings?.businessEmail ?? profile?.businessEmail ?? "—"}</span>
                  </div>
                  <div className="truncate">
                    Business phone:{" "}
                    <span className="font-semibold text-black/80">{settings?.businessPhone ?? profile?.businessPhone ?? "—"}</span>
                  </div>
                  <div className="truncate">
                    Business address: <span className="font-semibold text-black/80">{settings?.businessAddress ?? "—"}</span>
                  </div>
                  <div>
                    Tax ID: <span className="font-semibold text-black/80">{settings?.taxId ? "Provided" : "—"}</span>
                  </div>
                  {settings?.complianceNotes ? (
                    <div className="mt-1 rounded-xl bg-black/[0.03] p-2 text-[11px] text-black/60">
                      {settings.complianceNotes}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-[11px] font-semibold tracking-wide text-black/45">KYC & PAYOUT</div>
                <div className="mt-2 grid gap-1 text-xs text-black/60">
                  <div>
                    Document: <span className="font-semibold text-black/80">{kyc?.documentType ?? "—"}</span>
                  </div>
                  <div>
                    Submitted:{" "}
                    <span className="font-semibold text-black/80">
                      {kyc?.submittedAt ? fmtDate.format(new Date(kyc.submittedAt)) : "—"}
                    </span>
                  </div>
                  <div>
                    Verified:{" "}
                    <span className="font-semibold text-black/80">
                      {kyc?.verifiedAt ? fmtDate.format(new Date(kyc.verifiedAt)) : "—"}
                    </span>
                  </div>
                  {kyc?.reviewReason ? (
                    <div className="mt-1 rounded-xl bg-amber-50 p-2 text-[11px] text-amber-900">{kyc.reviewReason}</div>
                  ) : null}

                  <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-black/[0.03] p-2 text-[11px] text-black/60">
                    <div>
                      Bank: <span className="font-semibold text-black/80">{settings?.bankName ?? "—"}</span>
                    </div>
                    <div>
                      A/C:{" "}
                      <span className="font-semibold text-black/80">
                        {settings?.accountNumberLast4 ? `•••• ${settings.accountNumberLast4}` : "—"}
                      </span>
                    </div>
                    <div>
                      IFSC: <span className="font-semibold text-black/80">{settings?.ifsc ?? "—"}</span>
                    </div>
                    <div>
                      SWIFT: <span className="font-semibold text-black/80">{settings?.swift ?? "—"}</span>
                    </div>
                  </div>
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

