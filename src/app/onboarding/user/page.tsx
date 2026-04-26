import { requireSession } from "@/server/utils/require-session";

import { UserOnboardingForm } from "./user-onboarding-form";

export default async function UserOnboardingPage() {
  await requireSession({ allowRoles: ["USER"], callbackUrl: "/onboarding/user" });
  return <UserOnboardingForm />;
}

