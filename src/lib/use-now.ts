import * as React from "react";

/**
 * Returns a monotonically increasing "now" timestamp that updates on an interval.
 * Implemented via `useSyncExternalStore` to satisfy strict purity linting.
 */
export function useNow(intervalMs = 1000): number {
  const storeRef = React.useRef<{ now: number } | null>(null);
  if (!storeRef.current) storeRef.current = { now: Date.now() };

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const tick = () => {
        // Cache the snapshot value so `getSnapshot()` is stable between ticks.
        storeRef.current!.now = Date.now();
        onStoreChange();
      };
      const id = setInterval(tick, intervalMs);
      return () => clearInterval(id);
    },
    [intervalMs],
  );

  const getSnapshot = React.useCallback(() => storeRef.current!.now, []);
  const getServerSnapshot = React.useCallback(() => 0, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

