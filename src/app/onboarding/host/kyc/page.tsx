import { requireSession } from "@/lib/auth/require-session";

import { HostKycStep } from "./step";

export default async function HostKycPage() {
  await requireSession({ allowRoles: ["HOST"], callbackUrl: "/onboarding/host/kyc" });
  return <HostKycStep />;
}

