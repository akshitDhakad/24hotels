import { NextResponse } from "next/server";

import { readDb, writeDb } from "@/app/api/_db/db";

type DbHotel = Record<string, unknown>;

type BookingInput = {
  hotelId: string;
  checkIn?: string | null;
  checkOut?: string | null;
  adults?: number;
  children?: number;
  rooms?: number;
  guestEmail?: string;
};

function safeString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function safeInt(v: unknown, fallback: number) {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.bookings ?? [], {
    headers: { "cache-control": "no-store" },
  });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<BookingInput> | null;
  if (!body) {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  const hotelId = safeString(body.hotelId);
  if (!hotelId) {
    return NextResponse.json(
      { message: "hotelId is required" },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  const db = await readDb();
  const hotels = db.hotels as DbHotel[];
  const exists = hotels.some((h) => String(h.id) === hotelId);
  if (!exists) {
    return NextResponse.json(
      { message: "Unknown hotelId" },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  const now = Date.now();
  const booking = {
    id: `bk_${now}`,
    createdAt: new Date(now).toISOString(),
    hotelId,
    checkIn: body.checkIn ?? null,
    checkOut: body.checkOut ?? null,
    adults: safeInt(body.adults, 2),
    children: safeInt(body.children, 0),
    rooms: safeInt(body.rooms, 1),
    guestEmail: safeString(body.guestEmail) || undefined,
  };

  const next = {
    ...db,
    bookings: [...(db.bookings ?? []), booking],
  };
  await writeDb(next);

  return NextResponse.json(booking, {
    status: 201,
    headers: { "cache-control": "no-store" },
  });
}

