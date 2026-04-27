"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { UseFormRegister } from "react-hook-form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function RoomHourlyRateBox({ nightlyInr }: { nightlyInr: number }) {
  const [hoursRaw, setHoursRaw] = React.useState("3");
  const hours = (() => {
    const n = parseInt(hoursRaw, 10);
    if (!Number.isFinite(n)) return 3;
    return Math.min(48, Math.max(1, n));
  })();
  const perClockHour = nightlyInr > 0 ? nightlyInr / 24 : 0;
  const slotTotal = perClockHour * hours;

  return (
    <div className="rounded-xl border border-dashed border-black/15 bg-[#fafafa] p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-black/50">Hourly rate calculator</div>
      <p className="mt-1 text-xs text-black/55">Indicative: nightly rate spread evenly over 24 hours.</p>
      <div className="mt-3 flex flex-wrap items-end gap-4">
        <div className="grid gap-1">
          <Label className="text-[10px] text-black/50">Stay (hours)</Label>
          <Input
            inputMode="numeric"
            className="h-9 w-20 rounded-lg border-black/10 bg-white text-sm"
            value={hoursRaw}
            onChange={(e) => setHoursRaw(e.target.value.replace(/\D/g, "").slice(0, 2))}
            aria-label="Hours for hourly estimate"
          />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-medium text-black/45">Per clock hour (÷24)</div>
          <div className="text-sm font-semibold text-foreground">{formatInr(Math.round(perClockHour))}</div>
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-medium text-black/45">Indicative total ({hours}h)</div>
          <div className="text-sm font-semibold text-[#0a2540]">{formatInr(Math.round(slotTotal))}</div>
        </div>
      </div>
    </div>
  );
}

const roomSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Enter room type").max(120),
  sleeps: z.number().int().min(1).max(12),
  bed: z.string().trim().min(2).max(60),
  refundable: z.boolean(),
  /** Amount in Indian Rupees (stored in DB field `priceUsd`). */
  priceUsd: z.number().positive().max(50_000_000),
  perksCsv: z.string().trim().max(800).optional().or(z.literal("")),
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter hotel name").max(120),
  location: z.string().trim().min(3, "Enter location").max(160),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  address: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(30, "Description must be at least 30 characters").max(2000),
  priceUsd: z.number().positive().max(50_000_000),
  reviewLabel: z.string().trim().min(2).max(40).optional(),
  perksCsv: z.string().trim().max(500).optional(),
  amenitiesCsv: z.string().trim().min(2, "Enter at least 1 amenity").max(1200),
  gallery: z
    .array(z.object({ url: z.string().url("Enter a valid image URL") }))
    .min(4, "At least 4 images are required")
    .max(20),
  rooms: z.array(roomSchema).min(1, "Add at least one room type"),
  isActive: z.boolean().optional(),
});
type Values = z.infer<typeof schema>;

function isProbablyImageUrl(raw: string) {
  const u = raw.trim();
  if (!u || !/^https?:\/\//i.test(u)) return false;
  try {
    new URL(u);
    return true;
  } catch {
    return false;
  }
}

function GalleryImageSlot({
  idx,
  fieldId,
  url,
  register,
  canRemove,
  onRemove,
  hasUrlError,
}: {
  idx: number;
  fieldId: string;
  url: string;
  register: UseFormRegister<Values>;
  canRemove: boolean;
  onRemove: () => void;
  hasUrlError: boolean;
}) {
  const [broken, setBroken] = React.useState(false);
  React.useEffect(() => {
    setBroken(false);
  }, [url]);
  const showPreview = isProbablyImageUrl(url) && !broken;

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-black/[0.03]",
          hasUrlError ? "ring-2 ring-red-500/40" : "border-black/10",
        )}
      >
        {showPreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary host-uploaded URLs
          <img
            src={url.trim()}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="flex h-full min-h-[100px] flex-col items-center justify-center gap-1 px-3 text-center">
            <span className="text-[11px] font-medium text-black/35">Preview</span>
            <span className="text-[10px] text-black/40">Add a direct image URL (https)</span>
          </div>
        )}
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          title={canRemove ? "Remove image" : "Minimum 4 images required"}
          aria-label={canRemove ? "Remove image" : "Cannot remove — minimum 4 images"}
          className={cn(
            "absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-[2px] transition-colors",
            canRemove
              ? "hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
              : "cursor-not-allowed opacity-40",
          )}
        >
          <X className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </div>
      <Input
        id={`gallery-url-${fieldId}`}
        className={cn("h-9 rounded-lg border-black/10 bg-white text-xs", hasUrlError ? "ring-2 ring-red-500/40" : "")}
        placeholder={`Image URL ${idx + 1}`}
        {...register(`gallery.${idx}.url` as const)}
      />
    </div>
  );
}

export function HostListingForm({
  mode,
  hotelId,
  initial,
}: {
  mode: "create" | "edit";
  hotelId?: string;
  initial?: {
    id: string;
    name: string;
    location?: string | null;
    city: string;
    country: string;
    address: string | null;
    description?: string | null;
    priceUsd?: number | null;
    reviewLabel?: string | null;
    perks?: string[];
    amenities?: string[];
    gallery?: string[];
    rooms?: Array<{
      id?: string;
      name: string;
      sleeps: number;
      bed: string;
      refundable: boolean;
      priceUsd: number;
      perks?: string[];
    }>;
    isActive: boolean;
  } | null;
}) {
  const router = useRouter();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "edit" && initial
        ? {
            name: initial.name,
            location: initial.location ?? `${initial.city}, ${initial.country}`,
            city: initial.city,
            country: initial.country,
            address: initial.address ?? undefined,
            description: initial.description ?? "",
            priceUsd: initial.priceUsd ?? 0,
            reviewLabel: initial.reviewLabel ?? "New",
            perksCsv: (initial.perks ?? []).join(", "),
            amenitiesCsv: (initial.amenities ?? []).join(", "),
            gallery: initial.gallery?.length
              ? initial.gallery.map((url) => ({ url }))
              : [{ url: "" }, { url: "" }, { url: "" }, { url: "" }],
            rooms: initial.rooms?.length
              ? initial.rooms.map((r) => ({
                  id: r.id,
                  name: r.name,
                  sleeps: r.sleeps,
                  bed: r.bed,
                  refundable: r.refundable,
                  priceUsd: r.priceUsd,
                  perksCsv: (r.perks ?? []).join(", "),
                }))
              : [{ name: "Deluxe Room", sleeps: 2, bed: "Double", refundable: true, priceUsd: 120, perksCsv: "" }],
            isActive: initial.isActive,
          }
        : {
            country: "India",
            location: "",
            description: "",
            priceUsd: 120,
            reviewLabel: "New",
            perksCsv: "",
            amenitiesCsv: "WiFi, AC",
            gallery: [{ url: "" }, { url: "" }, { url: "" }, { url: "" }],
            rooms: [{ name: "Deluxe Room", sleeps: 2, bed: "Double", refundable: true, priceUsd: 120, perksCsv: "" }],
            isActive: false,
          },
    mode: "onBlur",
  });
  const errors = form.formState.errors;

  const galleryArray = useFieldArray({ control: form.control, name: "gallery" });
  const galleryRows = useWatch({ control: form.control, name: "gallery" });
  const roomsArray = useFieldArray({ control: form.control, name: "rooms" });

  async function onSubmit(values: Values) {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const perks = values.perksCsv
        ? values.perksCsv
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const amenities = values.amenitiesCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res =
        mode === "create"
          ? await fetch("/api/v1/host/hotels", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: values.name,
                location: values.location,
                city: values.city,
                country: values.country,
                address: values.address,
                description: values.description,
                priceUsd: values.priceUsd,
                reviewLabel: values.reviewLabel ?? "New",
                perks,
                amenities,
                gallery: values.gallery.map((g) => g.url),
                rooms: values.rooms.map((r) => ({
                  name: r.name,
                  sleeps: r.sleeps,
                  bed: r.bed,
                  refundable: r.refundable,
                  priceUsd: r.priceUsd,
                  perks: r.perksCsv
                    ? r.perksCsv
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : [],
                })),
              }),
            })
          : await fetch(`/api/v1/host/hotels/${hotelId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: values.name,
                location: values.location,
                city: values.city,
                country: values.country,
                address: values.address ?? null,
                description: values.description,
                priceUsd: values.priceUsd,
                reviewLabel: values.reviewLabel ?? "New",
                perks,
                amenities,
                gallery: values.gallery.map((g) => g.url),
                rooms: values.rooms.map((r) => ({
                  id: r.id,
                  name: r.name,
                  sleeps: r.sleeps,
                  bed: r.bed,
                  refundable: r.refundable,
                  priceUsd: r.priceUsd,
                  perks: r.perksCsv
                    ? r.perksCsv
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : [],
                })),
                isActive: values.isActive ?? false,
              }),
            });

      const json = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
      if (!res.ok || json?.success === false) {
        setSubmitError(json?.message ?? "Could not save listing.");
        return;
      }
      router.push("/host/listings");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold tracking-tight">
            {mode === "create" ? "Add New Property" : "Edit Property"}
          </div>
          <div className="mt-1 text-sm text-black/50">
            Keep details accurate for verification and payouts.
          </div>
        </div>
        <Button asChild variant="outline" className="h-10 rounded-xl border-black/10 bg-white px-4">
          <Link href="/host/listings">Back</Link>
        </Button>
      </div>

      <Card className="mt-6 border-black/5 bg-white p-6 shadow-sm">
        {submitError ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
            {submitError}
          </div>
        ) : null}

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 text-left">
          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="name">
              Hotel name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              className={cn("h-12 rounded-xl border-black/10 bg-white", errors.name ? "ring-2 ring-red-500/40" : "")}
              {...form.register("name")}
            />
            {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="location">
              Location (display) <span className="text-red-600">*</span>
            </Label>
            <Input
              id="location"
              placeholder="Bandra West, Mumbai"
              className={cn(
                "h-12 rounded-xl border-black/10 bg-white",
                errors.location ? "ring-2 ring-red-500/40" : "",
              )}
              {...form.register("location")}
            />
            {errors.location ? <p className="text-xs text-red-600">{errors.location.message}</p> : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="city">
                City <span className="text-red-600">*</span>
              </Label>
              <Input
                id="city"
                className={cn("h-12 rounded-xl border-black/10 bg-white", errors.city ? "ring-2 ring-red-500/40" : "")}
                {...form.register("city")}
              />
              {errors.city ? <p className="text-xs text-red-600">{errors.city.message}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="country">
                Country <span className="text-red-600">*</span>
              </Label>
              <Input
                id="country"
                className={cn(
                  "h-12 rounded-xl border-black/10 bg-white",
                  errors.country ? "ring-2 ring-red-500/40" : "",
                )}
                {...form.register("country")}
              />
              {errors.country ? <p className="text-xs text-red-600">{errors.country.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="address">
              Address
            </Label>
            <Input
              id="address"
              className={cn(
                "h-12 rounded-xl border-black/10 bg-white",
                errors.address ? "ring-2 ring-red-500/40" : "",
              )}
              {...form.register("address")}
            />
            {errors.address ? <p className="text-xs text-red-600">{errors.address.message}</p> : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="priceUsd">
                Base price (₹ / night) <span className="text-red-600">*</span>
              </Label>
              <Input
                id="priceUsd"
                inputMode="decimal"
                className={cn(
                  "h-12 rounded-xl border-black/10 bg-white",
                  errors.priceUsd ? "ring-2 ring-red-500/40" : "",
                )}
                {...form.register("priceUsd", { valueAsNumber: true })}
              />
              <p className="text-[11px] text-black/45">Amounts are in Indian Rupees (₹).</p>
              {errors.priceUsd ? <p className="text-xs text-red-600">{errors.priceUsd.message}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs text-[#0f2d1c]" htmlFor="reviewLabel">
                Review label
              </Label>
              <Input
                id="reviewLabel"
                placeholder="Excellent"
                className={cn(
                  "h-12 rounded-xl border-black/10 bg-white",
                  errors.reviewLabel ? "ring-2 ring-red-500/40" : "",
                )}
                {...form.register("reviewLabel")}
              />
              {errors.reviewLabel ? <p className="text-xs text-red-600">{errors.reviewLabel.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="description">
              Description <span className="text-red-600">*</span>
            </Label>
            <textarea
              id="description"
              className={cn(
                "min-h-[120px] w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
                errors.description ? "ring-2 ring-red-500/40" : "",
              )}
              {...form.register("description")}
            />
            {errors.description ? <p className="text-xs text-red-600">{errors.description.message}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="amenitiesCsv">
              Amenities (comma separated) <span className="text-red-600">*</span>
            </Label>
            <Input
              id="amenitiesCsv"
              placeholder="WiFi, AC, Parking, Pool"
              className={cn(
                "h-12 rounded-xl border-black/10 bg-white",
                errors.amenitiesCsv ? "ring-2 ring-red-500/40" : "",
              )}
              {...form.register("amenitiesCsv")}
            />
            {errors.amenitiesCsv ? <p className="text-xs text-red-600">{errors.amenitiesCsv.message}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label className="text-xs text-[#0f2d1c]" htmlFor="perksCsv">
              Perks (comma separated)
            </Label>
            <Input
              id="perksCsv"
              placeholder="Free breakfast, Airport pickup"
              className="h-12 rounded-xl border-black/10 bg-white"
              {...form.register("perksCsv")}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-xs text-[#0f2d1c]">
                Gallery images <span className="text-red-600">*</span> <span className="text-black/40">(min 4)</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl border-black/10 bg-white px-3 text-xs"
                onClick={() => galleryArray.append({ url: "" })}
              >
                Add image
              </Button>
            </div>
            {errors.gallery ? (
              <p className="text-xs text-red-600">{errors.gallery.message as string}</p>
            ) : null}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {galleryArray.fields.map((f, idx) => (
                <GalleryImageSlot
                  key={f.id}
                  idx={idx}
                  fieldId={f.id}
                  url={String(galleryRows?.[idx]?.url ?? "")}
                  register={form.register}
                  canRemove={galleryArray.fields.length > 4}
                  onRemove={() => galleryArray.remove(idx)}
                  hasUrlError={Boolean(errors.gallery?.[idx]?.url)}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-xs text-[#0f2d1c]">
                Rooms <span className="text-red-600">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl border-black/10 bg-white px-3 text-xs"
                onClick={() =>
                  roomsArray.append({ name: "", sleeps: 2, bed: "Double", refundable: true, priceUsd: 120, perksCsv: "" })
                }
              >
                Add room
              </Button>
            </div>
            {errors.rooms ? (
              <p className="text-xs text-red-600">{errors.rooms.message as string}</p>
            ) : null}
            <div className="grid gap-3">
              {roomsArray.fields.map((f, idx) => {
                const nightlyInr = Number(form.watch(`rooms.${idx}.priceUsd`)) || 0;
                return (
                <div key={f.id} className="rounded-xl border border-black/10 bg-white p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] text-black/60">Room type</Label>
                      <Input
                        className={cn("h-11 rounded-xl border-black/10 bg-white", errors.rooms?.[idx]?.name ? "ring-2 ring-red-500/40" : "")}
                        {...form.register(`rooms.${idx}.name` as const)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] text-black/60">Bed</Label>
                      <Input
                        className={cn("h-11 rounded-xl border-black/10 bg-white", errors.rooms?.[idx]?.bed ? "ring-2 ring-red-500/40" : "")}
                        {...form.register(`rooms.${idx}.bed` as const)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] text-black/60">Sleeps</Label>
                      <Input
                        inputMode="numeric"
                        className={cn("h-11 rounded-xl border-black/10 bg-white", errors.rooms?.[idx]?.sleeps ? "ring-2 ring-red-500/40" : "")}
                        {...form.register(`rooms.${idx}.sleeps` as const, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] text-black/60">Price (₹ / night)</Label>
                      <Input
                        inputMode="decimal"
                        className={cn("h-11 rounded-xl border-black/10 bg-white", errors.rooms?.[idx]?.priceUsd ? "ring-2 ring-red-500/40" : "")}
                        {...form.register(`rooms.${idx}.priceUsd` as const, { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                  <div className="mt-3 grid gap-1.5">
                    <Label className="text-[11px] text-black/60">Room perks (comma separated)</Label>
                    <Input
                      placeholder="Breakfast included, Late checkout, Airport pickup"
                      className={cn("h-11 rounded-xl border-black/10 bg-white", errors.rooms?.[idx]?.perksCsv ? "ring-2 ring-red-500/40" : "")}
                      {...form.register(`rooms.${idx}.perksCsv` as const)}
                    />
                    {errors.rooms?.[idx]?.perksCsv ? (
                      <p className="text-xs text-red-600">{errors.rooms[idx]?.perksCsv?.message as string}</p>
                    ) : null}
                  </div>
                  <div className="mt-3">
                    <RoomHourlyRateBox nightlyInr={nightlyInr} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-black/60">
                      <input type="checkbox" className="h-4 w-4" {...form.register(`rooms.${idx}.refundable` as const)} />
                      Refundable
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-xl border-black/10 bg-white px-3 text-xs"
                      onClick={() => roomsArray.remove(idx)}
                      disabled={roomsArray.fields.length <= 1}
                    >
                      Remove room
                    </Button>
                  </div>
                </div>
              );
              })}
            </div>
          </div>

          <Button className="mt-2 h-11 rounded-xl bg-black px-4 text-white hover:bg-black/90" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

