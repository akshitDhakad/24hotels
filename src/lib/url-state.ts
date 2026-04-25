export function getStringParam(
  sp: URLSearchParams,
  key: string,
  fallback = "",
): string {
  const v = sp.get(key);
  return v ?? fallback;
}

export function getIntParam(
  sp: URLSearchParams,
  key: string,
  fallback: number,
  opts?: { min?: number; max?: number },
): number {
  const raw = sp.get(key);
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n)) return fallback;
  const i = Math.trunc(n);
  const min = opts?.min ?? Number.NEGATIVE_INFINITY;
  const max = opts?.max ?? Number.POSITIVE_INFINITY;
  return Math.min(max, Math.max(min, i));
}

export function setOrDelete(sp: URLSearchParams, key: string, value?: string) {
  if (!value) sp.delete(key);
  else sp.set(key, value);
}

