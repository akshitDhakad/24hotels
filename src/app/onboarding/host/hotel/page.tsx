import { requireSession } from "@/lib/auth/require-session";

import { HostHotelForm } from "./step";

export default async function HostHotelPage() {
  await requireSession({ allowRoles: ["HOST"], callbackUrl: "/onboarding/host/hotel" });
  return <HostHotelForm />;
}

