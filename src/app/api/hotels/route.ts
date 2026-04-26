import { NextResponse } from "next/server";

import { prisma } from "@/server/config/database";

function getInt(sp: URLSearchParams, key: string, fallback: number) {
  const raw = sp.get(key);
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

function getString(sp: URLSearchParams, key: string) {
  const v = sp.get(key);
  return v ? v.trim() : "";
}

function matchesQ(hay: string, q: string) {
  if (!q) return true;
  return hay.toLowerCase().includes(q.toLowerCase());
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sp = url.searchParams;

  const q = getString(sp, "q");
  const page = Math.max(1, getInt(sp, "_page", 1));
  const limit = Math.min(60, Math.max(1, getInt(sp, "_limit", 6)));

  const sortKey = getString(sp, "_sort") || "rating";
  const order = (getString(sp, "_order") || "desc").toLowerCase() === "asc" ? 1 : -1;

  const where = {
    deletedAt: null as Date | null,
    isActive: true,
  };

  const all = await prisma.hotel.findMany({
    where,
    select: {
      id: true,
      name: true,
      location: true,
      city: true,
      country: true,
      rating: true,
      stars: true,
      reviewLabel: true,
      priceUsd: true,
      image: true,
      coverImage: true,
    },
    orderBy:
      sortKey === "rating"
        ? { rating: order === 1 ? "asc" : "desc" }
        : sortKey === "priceUsd"
          ? { priceUsd: order === 1 ? "asc" : "desc" }
          : { createdAt: "desc" },
  });

  const filtered = all.filter((h) =>
    matchesQ(`${h.name} ${h.location ?? ""} ${h.city ?? ""} ${h.country ?? ""}`, q),
  );
  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit).map((h) => ({
    ...h,
    perks: [] as string[],
    image: h.image ?? h.coverImage ?? "",
  }));

  const res = NextResponse.json(items, {
    headers: {
      "x-total-count": String(total),
      "cache-control": "no-store",
    },
  });
  return res;
}

