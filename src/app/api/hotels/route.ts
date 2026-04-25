import { NextResponse } from "next/server";

import { readDb } from "@/app/api/_db/db";

type DbHotel = Record<string, unknown>;

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

function matchesQ(hotel: DbHotel, q: string) {
  if (!q) return true;
  const hay = `${String(hotel.name ?? "")} ${String(hotel.location ?? "")} ${String(hotel.city ?? "")} ${String(hotel.country ?? "")}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sp = url.searchParams;

  const q = getString(sp, "q");
  const page = Math.max(1, getInt(sp, "_page", 1));
  const limit = Math.min(60, Math.max(1, getInt(sp, "_limit", 6)));

  const sortKey = getString(sp, "_sort") || "rating";
  const order = (getString(sp, "_order") || "desc").toLowerCase() === "asc" ? 1 : -1;

  const { hotels } = await readDb();
  const list = hotels as DbHotel[];
  const filtered = list.filter((h) => matchesQ(h, q));

  filtered.sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * order;
    const as = String(av ?? "");
    const bs = String(bv ?? "");
    return as.localeCompare(bs) * order;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  const res = NextResponse.json(items, {
    headers: {
      "x-total-count": String(total),
      "cache-control": "no-store",
    },
  });
  return res;
}

