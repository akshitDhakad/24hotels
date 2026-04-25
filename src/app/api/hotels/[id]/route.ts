import { NextResponse } from "next/server";

import { readDb } from "@/app/api/_db/db";

type DbHotel = Record<string, unknown>;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const { hotels } = await readDb();
  const list = hotels as DbHotel[];
  const found = list.find((h) => String(h.id) === String(id));

  if (!found) {
    return NextResponse.json(
      { message: "Not found" },
      { status: 404, headers: { "cache-control": "no-store" } },
    );
  }

  return NextResponse.json(found, { headers: { "cache-control": "no-store" } });
}

