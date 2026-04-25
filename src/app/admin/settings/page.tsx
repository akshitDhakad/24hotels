import { Card } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-4">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Settings</div>
        <div className="mt-1 text-sm text-black/50">Platform-wide configuration and admin preferences.</div>
      </div>

      <Card className="border-black/5 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold">Admin settings</div>
        <div className="mt-2 text-sm text-black/55">
          Wire this page to your real configuration store when ready.
        </div>
      </Card>
    </div>
  );
}

