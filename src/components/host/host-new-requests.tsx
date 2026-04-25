import Image from "next/image";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Request = {
  id: string;
  guestName: string;
  propertyName: string;
  dates: string;
  status: "new" | "pending";
  avatarUrl: string;
};

const requests: readonly Request[] = [
  {
    id: "rq_1",
    guestName: "Elena Rodriguez",
    propertyName: "The Glass House",
    dates: "Oct 12 – 15",
    status: "new",
    avatarUrl:
      "https://res.cloudinary.com/demo/image/upload/w_96,h_96,c_fill,g_face,f_auto/q_auto/face_left.jpg",
  },
  {
    id: "rq_2",
    guestName: "Julian Marc",
    propertyName: "Sky Loft Penthouse",
    dates: "Oct 18 – 22",
    status: "pending",
    avatarUrl:
      "https://res.cloudinary.com/demo/image/upload/w_96,h_96,c_fill,g_face,f_auto/q_auto/face_top.jpg",
  },
];

function StatusPill({ status }: { status: Request["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide",
        status === "new" ? "bg-emerald-50 text-emerald-700" : "bg-black/[0.04] text-black/50",
      )}
    >
      {status === "new" ? "NEW" : "PENDING"}
    </span>
  );
}

export function HostNewRequests() {
  return (
    <Card className="border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold">New Requests</div>
        <button type="button" className="text-xs font-semibold text-black/50 hover:text-foreground">
          View all
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        {requests.map((r) => (
          <div key={r.id} className="flex items-start gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-black/[0.04]">
              <Image src={r.avatarUrl} alt={r.guestName} fill className="object-cover" sizes="40px" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="truncate text-sm font-semibold">{r.guestName}</div>
                <StatusPill status={r.status} />
              </div>
              <div className="mt-1 text-xs text-black/45">
                {r.propertyName} • {r.dates}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className="h-8 rounded-xl bg-black px-3 text-xs font-semibold text-white hover:bg-black/90"
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="h-8 rounded-xl border border-black/10 bg-white px-3 text-xs font-semibold text-foreground hover:bg-black/[0.04]"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

