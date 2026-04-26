"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

const e164Phone = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Use international format (e.g., +919876543210)");

const schema = z.object({
  businessName: z.string().trim().min(2).max(160).optional(),
  businessEmail: z.string().trim().email("Enter a valid email").optional(),
  businessPhone: e164Phone.optional(),
  businessAddress: z.string().trim().min(3).max(240).optional(),
  taxId: z.string().trim().min(2).max(60).optional(),

  accountHolderName: z.string().trim().min(2).max(160).optional(),
  bankName: z.string().trim().min(2).max(160).optional(),
  accountNumber: z.string().trim().min(6).max(34).optional(),
  ifsc: z.string().trim().min(6).max(20).optional(),
  swift: z.string().trim().min(6).max(20).optional(),
});
type Values = z.infer<typeof schema>;

type SettingsDto = {
  businessName: string | null;
  businessEmail: string | null;
  businessPhone: string | null;
  businessAddress: string | null;
  taxId: string | null;
  accountHolderName: string | null;
  bankName: string | null;
  accountNumberLast4: string | null;
  ifsc: string | null;
  swift: string | null;
  payoutStatus: string;
  complianceStatus: string;
  complianceNotes: string | null;
};

function StatusPill({ label, tone }: { label: string; tone: "ok" | "warn" | "bad" | "neutral" }) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-800"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800"
        : tone === "bad"
          ? "bg-red-50 text-red-800"
          : "bg-black/[0.04] text-black/60";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold", cls)}>
      {label}
    </span>
  );
}

function toneFromStatus(status: string): "ok" | "warn" | "bad" | "neutral" {
  if (status === "VERIFIED") return "ok";
  if (status === "MANUAL_REVIEW" || status === "PENDING" || status === "SUBMITTED") return "warn";
  if (status === "REJECTED") return "bad";
  return "neutral";
}

export function HostSettingsClient() {
  const [loading, setLoading] = React.useState(true);
  const [server, setServer] = React.useState<SettingsDto | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {},
    mode: "onBlur",
  });

  const errors = form.formState.errors;

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/v1/host/settings", { cache: "no-store" });
        const json = (await res.json()) as { success?: boolean; data?: SettingsDto | null; message?: string };
        if (!res.ok || json.success === false) throw new Error(json.message ?? "Failed to load settings");
        if (cancelled) return;
        setServer(json.data ?? null);
        if (json.data) {
          form.reset({
            businessName: json.data.businessName ?? undefined,
            businessEmail: json.data.businessEmail ?? undefined,
            businessPhone: json.data.businessPhone ?? undefined,
            businessAddress: json.data.businessAddress ?? undefined,
            taxId: json.data.taxId ?? undefined,
            accountHolderName: json.data.accountHolderName ?? undefined,
            bankName: json.data.bankName ?? undefined,
            ifsc: json.data.ifsc ?? undefined,
            swift: json.data.swift ?? undefined,
          });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [form]);

  async function onSave(values: Values) {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/v1/host/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || json.success === false) throw new Error(json.message ?? "Could not save settings");
      // reload to refresh masked bank info + status pills
      setLoading(true);
      const next = await fetch("/api/v1/host/settings", { cache: "no-store" });
      const nextJson = (await next.json()) as { success?: boolean; data?: SettingsDto | null };
      setServer(nextJson.data ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save settings");
    } finally {
      setSaving(false);
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="border-black/5 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Settings</div>
            <div className="mt-1 text-sm text-black/50">
              Business profile, bank verification, and compliance settings.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill
              label={`Compliance: ${server?.complianceStatus ?? "DRAFT"}`}
              tone={toneFromStatus(server?.complianceStatus ?? "DRAFT")}
            />
            <StatusPill
              label={`Payouts: ${server?.payoutStatus ?? "DRAFT"}`}
              tone={toneFromStatus(server?.payoutStatus ?? "DRAFT")}
            />
          </div>
        </div>
      </Card>

      {error ? (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </Card>
      ) : null}

      <form onSubmit={form.handleSubmit(onSave)} className="grid gap-4">
        <Card className="border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold">Business profile</div>
              <div className="mt-1 text-sm text-black/50">Shown on invoices and verification.</div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="businessName">Business name</Label>
              <Input id="businessName" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("businessName")} />
              {errors.businessName ? <p className="text-xs text-red-600">{errors.businessName.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="taxId">Tax ID (GST/PAN/VAT)</Label>
              <Input id="taxId" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("taxId")} />
              {errors.taxId ? <p className="text-xs text-red-600">{errors.taxId.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="businessEmail">Business email</Label>
              <Input id="businessEmail" type="email" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("businessEmail")} />
              {errors.businessEmail ? <p className="text-xs text-red-600">{errors.businessEmail.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="businessPhone">Business phone</Label>
              <Input id="businessPhone" placeholder="+919876543210" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("businessPhone")} />
              {errors.businessPhone ? <p className="text-xs text-red-600">{errors.businessPhone.message}</p> : null}
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="businessAddress">Business address</Label>
              <Input id="businessAddress" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("businessAddress")} />
              {errors.businessAddress ? <p className="text-xs text-red-600">{errors.businessAddress.message}</p> : null}
            </div>
          </div>
        </Card>

        <Card className="border-black/5 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">Payout / bank details</div>
          <div className="mt-1 text-sm text-black/50">
            Used for payouts. We store only the last 4 digits of account number.
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="accountHolderName">Account holder name</Label>
              <Input id="accountHolderName" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("accountHolderName")} />
              {errors.accountHolderName ? <p className="text-xs text-red-600">{errors.accountHolderName.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="bankName">Bank name</Label>
              <Input id="bankName" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("bankName")} />
              {errors.bankName ? <p className="text-xs text-red-600">{errors.bankName.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="accountNumber">
                Account number {server?.accountNumberLast4 ? <span className="text-black/40">(ends ••••{server.accountNumberLast4})</span> : null}
              </Label>
              <Input id="accountNumber" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("accountNumber")} />
              {errors.accountNumber ? <p className="text-xs text-red-600">{errors.accountNumber.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="ifsc">IFSC (India)</Label>
              <Input id="ifsc" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("ifsc")} />
              {errors.ifsc ? <p className="text-xs text-red-600">{errors.ifsc.message}</p> : null}
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="swift">SWIFT (International)</Label>
              <Input id="swift" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("swift")} />
              {errors.swift ? <p className="text-xs text-red-600">{errors.swift.message}</p> : null}
            </div>
          </div>
        </Card>

        <Card className="border-black/5 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">Compliance</div>
          <div className="mt-1 text-sm text-black/50">
            Status is updated after document verification and admin review.
          </div>
          {server?.complianceNotes ? (
            <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm text-black/60">
              {server.complianceNotes}
            </div>
          ) : null}
        </Card>

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            className="h-11 rounded-xl bg-black px-5 text-white hover:bg-black/90"
            disabled={saving || loading}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

