import { NextResponse } from "next/server";

import type { ApiMeta } from "@/server/types/api.types";

export function success<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    { success: true, message, data },
    { status, headers: { "cache-control": "no-store" } },
  );
}

export function created<T>(data: T, message?: string) {
  return success(data, message, 201);
}

export function paginated<T>(data: T[], meta: ApiMeta, message = "OK") {
  return NextResponse.json(
    { success: true, message, data, meta },
    { status: 200, headers: { "cache-control": "no-store" } },
  );
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

