export type ApiErrorDetails = {
  message: string;
  status: number;
  url: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = "ApiError";
    this.status = details.status;
    this.url = details.url;
  }
}

function getApiBaseUrl(): string {
  const v = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  // Prefer an explicit base if configured (e.g. staging/prod backend).
  if (v && v.length > 0) return v.replace(/\/+$/, "");

  // Default to same-origin (Next.js Route Handlers under `/api/*`).
  return "";
}

function buildUrl(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
) {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Relative (same-origin)
  if (!base) {
    const sp = new URLSearchParams();
    if (query) {
      for (const [k, raw] of Object.entries(query)) {
        if (raw === undefined || raw === null) continue;
        sp.set(k, String(raw));
      }
    }
    const qs = sp.toString();
    return qs ? `${normalizedPath}?${qs}` : normalizedPath;
  }

  // Absolute
  const url = new URL(`${base}${normalizedPath}`);
  if (query) {
    for (const [k, raw] of Object.entries(query)) {
      if (raw === undefined || raw === null) continue;
      url.searchParams.set(k, String(raw));
    }
  }
  return url.toString();
}

export type ApiFetchOptions = Omit<RequestInit, "body" | "method"> & {
  query?: Record<string, string | number | boolean | null | undefined>;
};

export async function apiGetJson<T>(
  path: string,
  options?: ApiFetchOptions,
): Promise<{ data: T; headers: Headers }> {
  const url = buildUrl(path, options?.query);
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

