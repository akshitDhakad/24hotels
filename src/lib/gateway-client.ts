import { getServerGatewayUrl } from "@/lib/env";

import { ApiError } from "@/lib/api-client";

export type GatewayFetchOptions = Omit<RequestInit, "body" | "method"> & {
  query?: Record<string, string | number | boolean | null | undefined>;
};

/**
 * Base URL for calling the microservices API gateway from the current runtime.
 * Server: `API_GATEWAY_URL` or `NEXT_PUBLIC_API_GATEWAY_URL` (see `getServerGatewayUrl`).
 * Browser: `NEXT_PUBLIC_API_GATEWAY_URL` only (falls back to `http://localhost:3000`).
 */
export function getFetchGatewayBase(): string {
  if (typeof window === "undefined") {
    return getServerGatewayUrl();
  }
  const pub = process.env.NEXT_PUBLIC_API_GATEWAY_URL?.trim();
  return pub && pub.length > 0 ? pub.replace(/\/$/, "") : "http://localhost:3000";
}

function buildGatewayUrl(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
): string {
  const base = getFetchGatewayBase();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`);
  if (query) {
    for (const [k, raw] of Object.entries(query)) {
      if (raw === undefined || raw === null) continue;
      url.searchParams.set(k, String(raw));
    }
  }
  return url.toString();
}

export async function gatewayGetJson<T>(
  path: string,
  options?: GatewayFetchOptions,
): Promise<{ data: T; headers: Headers }> {
  const url = buildGatewayUrl(path, options?.query);
  const res = await fetch(url, {
    ...options,
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const safeText = await res.text().catch(() => "");
    throw new ApiError({
      status: res.status,
      url,
      message: safeText || `Request failed with ${res.status}`,
    });
  }

  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}
