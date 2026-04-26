import { NextResponse } from "next/server";

import { getHotelByIdFromDb } from "@/features/hotels/hotels-server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const found = await getHotelByIdFromDb(id);
  if (!found) {
    return NextResponse.json(
      { message: "Not found" },
      { status: 404, headers: { "cache-control": "no-store" } },
    );
  }

  return NextResponse.json(found, { headers: { "cache-control": "no-store" } });
}

