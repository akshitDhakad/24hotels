import { requireSession } from "@/lib/auth/require-session";

import { HostPersonalForm } from "./step";

export default async function HostPersonalPage() {
  await requireSession({ allowRoles: ["HOST"], callbackUrl: "/onboarding/host/personal" });
  return <HostPersonalForm />;
}

