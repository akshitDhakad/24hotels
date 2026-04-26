"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { OtpModal } from "@/components/auth/otp-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { VerifiedPill } from "@/components/ui/verified-pill";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, "Use international format (e.g., +919876543210)")
    .optional()
    .or(z.literal("")),
  image: z.string().trim().url("Enter a valid image URL").optional().or(z.literal("")),
  address1: z.string().trim().min(3, "Enter address").max(200),
  address2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80),
});
type Values = z.infer<typeof schema>;

type ProfileDto = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  registrationChannel: "EMAIL" | "PHONE";
  nameLocked: boolean;
  emailLocked: boolean;
  phoneLocked: boolean;
  emailSynthetic: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
};

export function HostProfileClient() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [server, setServer] = React.useState<ProfileDto | null>(null);
  const toast = useToast();
  const { update: updateSession } = useSession();

  const [otpOpen, setOtpOpen] = React.useState(false);
  const [otpNonce, setOtpNonce] = React.useState(0);
  const [otpMasked, setOtpMasked] = React.useState("");
  const [otpExpires, setOtpExpires] = React.useState<Date>(new Date());
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const pendingSave = React.useRef<Values | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      image: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
    mode: "onBlur",
  });

  const errors = form.formState.errors;

  async function syncSessionFromProfile(data: ProfileDto) {
    await updateSession({
      name: data.name ?? "",
      email: data.email,
      phone: data.phone ?? null,
      image: data.image ?? null,
      emailVerified: data.emailVerified,
      phoneVerified: data.phoneVerified,
      registrationChannel: data.registrationChannel,
    });
  }

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/v1/host/profile", { cache: "no-store" });
        const json = (await res.json()) as { success?: boolean; message?: string; data?: ProfileDto };
        if (!res.ok || json.success === false || !json.data) throw new Error(json.message ?? "Failed to load profile");
        if (cancelled) return;
        setServer(json.data);
        form.reset({
          name: json.data.name ?? "",
          email: json.data.email,
          phone: json.data.phone ?? "",
          image: json.data.image ?? "",
          address1: json.data.address1 ?? "",
          address2: json.data.address2 ?? "",
          city: json.data.city ?? "",
          state: json.data.state ?? "",
          postalCode: json.data.postalCode ?? "",
          country: json.data.country ?? "India",
        });
        await syncSessionFromProfile(json.data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- initial profile load only

  async function startProfileOtp() {
    const res = await fetch("/api/v1/host/profile/verify/start", { method: "POST" });
    const json = (await res.json()) as {
      success?: boolean;
      message?: string;
      data?: { maskedContact: string; expiresAt: string };
    };
    if (!res.ok || json.success === false || !json.data) throw new Error(json.message ?? "Could not send verification code");
    setOtpMasked(json.data.maskedContact);
    setOtpExpires(new Date(json.data.expiresAt));
    setOtpNonce((n) => n + 1);
  }

  async function onSave(values: Values) {
    setError(null);
    setSaving(true);
    try {
      pendingSave.current = values;
      setOtpError(null);
      await startProfileOtp();
      setOtpOpen(true);
    } catch (e) {
      pendingSave.current = null;
      const msg = e instanceof Error ? e.message : "Could not start verification";
      setError(msg);
      toast.push({ tone: "error", title: "Verification", message: msg });
    } finally {
      setSaving(false);
    }
  }

  async function performPut(values: Values, profileEditToken: string) {
    const res = await fetch("/api/v1/host/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileEditToken,
        name: values.name,
        email: values.email,
        phone: values.phone?.trim() ? values.phone.trim() : null,
        image: values.image?.trim() ? values.image.trim() : null,
        address1: values.address1.trim(),
        address2: values.address2?.trim() ? values.address2.trim() : null,
        city: values.city.trim(),
        state: values.state.trim(),
        postalCode: values.postalCode.trim(),
        country: values.country.trim(),
      }),
    });
    const json = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok || json.success === false) throw new Error(json.message ?? "Could not save profile");
  }

  async function reloadProfile() {
    const res = await fetch("/api/v1/host/profile", { cache: "no-store" });
    const json = (await res.json()) as { success?: boolean; message?: string; data?: ProfileDto };
    if (!res.ok || json.success === false || !json.data) throw new Error(json.message ?? "Failed to reload profile");
    setServer(json.data);
    form.reset({
      name: json.data.name ?? "",
      email: json.data.email,
      phone: json.data.phone ?? "",
      image: json.data.image ?? "",
      address1: json.data.address1 ?? "",
      address2: json.data.address2 ?? "",
      city: json.data.city ?? "",
      state: json.data.state ?? "",
      postalCode: json.data.postalCode ?? "",
      country: json.data.country ?? "India",
    });
    await syncSessionFromProfile(json.data);
  }

  async function handleOtpVerify(otp: string) {
    setOtpError(null);
    setIsVerifying(true);
    try {
      const res = await fetch("/api/v1/host/profile/verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        message?: string;
        data?: { profileEditToken: string };
      };
      if (!res.ok || json.success === false || !json.data?.profileEditToken) {
        throw new Error(json.message ?? "Invalid code");
      }
      const values = pendingSave.current;
      if (!values) throw new Error("Missing form data");
      await performPut(values, json.data.profileEditToken);
      pendingSave.current = null;
      setOtpOpen(false);
      await reloadProfile();
      toast.push({ tone: "success", title: "Profile updated", message: "Your profile was saved successfully." });
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleOtpResend() {
    setOtpError(null);
    setIsResending(true);
    try {
      const res = await fetch("/api/v1/host/profile/verify/resend", { method: "POST" });
      const json = (await res.json()) as {
        success?: boolean;
        message?: string;
        data?: { maskedContact: string; expiresAt: string };
      };
      if (!res.ok || json.success === false || !json.data) throw new Error(json.message ?? "Could not resend");
      setOtpMasked(json.data.maskedContact);
      setOtpExpires(new Date(json.data.expiresAt));
      setOtpNonce((n) => n + 1);
    } catch (e) {
      setOtpError(e instanceof Error ? e.message : "Could not resend");
    } finally {
      setIsResending(false);
    }
  }

  async function onClearProfile() {
    setError(null);
    if (!confirm("Clear address and profile photo? Your sign-in email/phone and name are kept for security.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/v1/host/profile", { method: "DELETE" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(json?.message ?? "Could not clear profile");
      }
      await reloadProfile();
      toast.push({ tone: "success", title: "Profile cleared", message: "Address and photo were cleared." });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not clear profile");
      toast.push({ tone: "error", title: "Action failed", message: "Could not clear profile fields." });
    } finally {
      setSaving(false);
    }
  }

  async function onDeactivate() {
    setError(null);
    if (!confirm("Deactivate your account? This will log you out and disable access.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/v1/host/profile/deactivate", { method: "POST" });
      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(json?.message ?? "Could not deactivate account");
      }
      window.location.href = "/auth/sign-in";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not deactivate account");
      toast.push({ tone: "error", title: "Action failed", message: "Could not deactivate your account." });
    } finally {
      setSaving(false);
    }
  }

  const locks = server
    ? {
        nameLocked: server.nameLocked,
        emailLocked: server.emailLocked || server.emailSynthetic,
        phoneLocked: server.phoneLocked,
      }
    : { nameLocked: false, emailLocked: false, phoneLocked: false };

  const phoneDisplay = (server?.phone ?? form.watch("phone") ?? "").trim();

  return (
    <div className="grid gap-4">
      <OtpModal
        key={otpNonce}
        open={otpOpen}
        title="Verify to save profile"
        maskedContact={otpMasked}
        expiresAt={otpExpires}
        error={otpError}
        isVerifying={isVerifying}
        isResending={isResending}
        onClose={() => {
          setOtpOpen(false);
          pendingSave.current = null;
          setOtpError(null);
        }}
        onVerify={(otp) => void handleOtpVerify(otp)}
        onResend={() => void handleOtpResend()}
      />

      <Card className="border-black/5 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold">Profile</div>
        <div className="mt-1 text-sm text-black/50">Manage your host account profile. Saving changes requires a one-time code sent to your verified contact.</div>
      </Card>

      {error ? <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</Card> : null}

      <Card className="border-black/5 bg-white p-6 shadow-sm">
        <form onSubmit={form.handleSubmit((v) => void onSave(v))} className="grid gap-4 text-left">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-black/[0.04]">
              {form.watch("image")?.trim() ? (
                <Image
                  src={form.watch("image")?.trim() ?? ""}
                  alt="Profile image"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-lg font-semibold text-black/50">
                  {(form.watch("name")?.trim()[0] ?? "?").toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">Profile photo</div>
              <div className="text-xs text-black/50">Paste an image URL to preview.</div>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="name">
                Name <span className="text-red-600">*</span>
              </Label>
              {locks.nameLocked ? <VerifiedPill label="Verified" /> : null}
            </div>
            <Input
              id="name"
              readOnly={locks.nameLocked}
              className={`h-11 rounded-xl border-black/10 bg-white ${locks.nameLocked ? "cursor-not-allowed bg-black/[0.03]" : ""}`}
              {...form.register("name")}
            />
            {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
            {locks.nameLocked ? <p className="text-[11px] text-black/45">Legal name is tied to your verified phone signup and cannot be changed here.</p> : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs text-[#0f2d1c]" htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </Label>
                {server?.emailVerified ? <VerifiedPill label="Verified" title="Email verified" /> : null}
              </div>
              <Input
                id="email"
                type="email"
                readOnly={locks.emailLocked}
                className={`h-11 rounded-xl border-black/10 bg-white ${locks.emailLocked ? "cursor-not-allowed bg-black/[0.03]" : ""}`}
                {...form.register("email")}
              />
              {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
              {locks.emailLocked ? <p className="text-[11px] text-black/45">Sign-in email is verified and cannot be changed here.</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor={server?.phoneVerified ? "host-phone-verified" : "phone"}>
                Phone
              </Label>
              {server?.phoneVerified ? (
                <>
                  <input type="hidden" {...form.register("phone")} />
                  <div
                    id="host-phone-verified"
                    role="status"
                    className="flex h-11 items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4"
                  >
                    <span className="min-w-0 truncate text-sm font-semibold text-foreground">{phoneDisplay || "—"}</span>
                    <VerifiedPill label="Verified" title="Phone verified" className="shrink-0" />
                  </div>
                  <p className="text-[11px] text-black/45">This phone number is verified and cannot be changed here.</p>
                </>
              ) : (
                <>
                  <Input
                    id="phone"
                    placeholder="+919876543210"
                    readOnly={locks.phoneLocked}
                    className={`h-11 rounded-xl border-black/10 bg-white ${locks.phoneLocked ? "cursor-not-allowed bg-black/[0.03]" : ""}`}
                    {...form.register("phone")}
                  />
                  {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}
                  {locks.phoneLocked ? <p className="text-[11px] text-black/45">Verified phone cannot be changed here.</p> : null}
                </>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="image">
              Avatar URL
            </Label>
            <Input id="image" placeholder="https://..." className="h-11 rounded-xl border-black/10 bg-white" {...form.register("image")} />
            {errors.image ? <p className="text-xs text-red-600">{errors.image.message}</p> : null}
          </div>

          <div className="pt-2 text-sm font-semibold">Address</div>
          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="address1">
              Address line 1 <span className="text-red-600">*</span>
            </Label>
            <Input id="address1" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("address1")} />
            {errors.address1 ? <p className="text-xs text-red-600">{errors.address1.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="address2">
              Address line 2
            </Label>
            <Input id="address2" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("address2")} />
            {errors.address2 ? <p className="text-xs text-red-600">{errors.address2.message}</p> : null}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="city">
                City <span className="text-red-600">*</span>
              </Label>
              <Input id="city" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("city")} />
              {errors.city ? <p className="text-xs text-red-600">{errors.city.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="state">
                State <span className="text-red-600">*</span>
              </Label>
              <Input id="state" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("state")} />
              {errors.state ? <p className="text-xs text-red-600">{errors.state.message}</p> : null}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="postalCode">
                Postal code <span className="text-red-600">*</span>
              </Label>
              <Input id="postalCode" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("postalCode")} />
              {errors.postalCode ? <p className="text-xs text-red-600">{errors.postalCode.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="country">
                Country <span className="text-red-600">*</span>
              </Label>
              <Input id="country" className="h-11 rounded-xl border-black/10 bg-white" {...form.register("country")} />
              {errors.country ? <p className="text-xs text-red-600">{errors.country.message}</p> : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Button type="submit" className="h-11 rounded-xl bg-black px-5 text-white hover:bg-black/90" disabled={saving || loading}>
                {saving ? "Sending code…" : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-black/10 bg-white px-5"
                disabled={saving}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-red-200 bg-white px-5 text-red-700 hover:bg-red-50"
                disabled={saving}
                onClick={() => void onClearProfile()}
              >
                Clear profile
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-red-200 bg-white px-5 text-red-700 hover:bg-red-50"
                disabled={saving}
                onClick={() => void onDeactivate()}
              >
                Deactivate account
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
