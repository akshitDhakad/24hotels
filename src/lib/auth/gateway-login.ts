import { getServerGatewayUrl } from "@/lib/env";

type GatewayLoginResponse = {
  success?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerified?: boolean;
    createdAt?: string;
  };
  accessToken?: string;
  refreshToken?: string;
};

export async function loginWithGateway(email: string, password: string): Promise<GatewayLoginResponse | null> {
  const base = getServerGatewayUrl();
  const res = await fetch(`${base}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
    cache: "no-store",
  });
  if (!res.ok) {
    return null;
  }
  return (await res.json()) as GatewayLoginResponse;
}
