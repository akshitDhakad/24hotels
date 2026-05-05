/**
 * Base URL for the microservices API gateway (see `/backend`, Docker port 3000 by default).
 * Use in Server Components / Route Handlers with `API_GATEWAY_URL`, or in the browser with `NEXT_PUBLIC_API_GATEWAY_URL`.
 */
export function getApiGatewayBaseUrl(): string {
  if (typeof window !== "undefined") {
    return (process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "").replace(/\/$/, "");
  }
  return (process.env.API_GATEWAY_URL ?? process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "").replace(
    /\/$/,
    "",
  );
}
