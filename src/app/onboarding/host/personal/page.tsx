import { requireSession } from "@/server/utils/require-session";

import { HostPersonalForm } from "./step";

export default async function HostPersonalPage() {
  await requireSession({ allowRoles: ["HOST"], callbackUrl: "/onboarding/host/personal" });
  return <HostPersonalForm />;
}

