import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type AdminSimpleTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => React.ReactNode;
};

export function AdminSimpleTable<T>({
  title,
  subtitle,
  columns,
  rows,
  actions,
}: {
  title: string;
  subtitle?: string;
  columns: readonly AdminSimpleTableColumn<T>[];
  rows: readonly T[];
  actions?: React.ReactNode;
}) {
  return (
    <Card className="border-black/5 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-black/45">{subtitle}</div> : null}
        </div>
        {actions}
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[860px]">
          <div
            className={cn(
              "grid gap-3 border-b border-black/5 pb-3 text-[11px] font-semibold tracking-wide text-black/40",
            )}
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            {columns.map((c) => (
              <div key={c.key} className={c.className}>
                {c.header}
              </div>
            ))}
          </div>

          <div className="divide-y divide-black/5">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid items-center gap-3 py-4"
                style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
              >
                {columns.map((c) => (
                  <div key={c.key} className={c.className}>
                    {c.cell(row)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

