import { notFound } from "next/navigation";

import { UserDashboardShell } from "@/components/user/user-dashboard-shell";
import { Card } from "@/components/ui/card";
import { getUserNavAccount } from "@/server/services/user-dashboard.service";
import { requireCustomerSession } from "@/server/utils/require-customer";

export default async function UserSettingsPage() {
  const { user } = await requireCustomerSession();
  const account = await getUserNavAccount(user.id);
  if (!account) notFound();

  return (
    <UserDashboardShell account={account}>
      <div className="grid max-w-xl gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile Settings</h1>
          <p className="mt-1 text-sm text-black/50">Manage how your account appears across LuxeStay.</p>
        </div>

        <Card className="border-black/5 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">Account</div>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-black/45">Name</dt>
              <dd className="font-medium">{account.displayName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-black/45">Email</dt>
              <dd className="max-w-[60%] truncate font-medium">{account.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-black/45">Tier</dt>
              <dd className="font-medium">{account.membershipLabel}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-black/45">
            Password and security preferences will live here as those flows are wired up. For Google sign-in, manage
            your profile photo and email in your Google account.
          </p>
        </Card>
      </div>
    </UserDashboardShell>
  );
}
