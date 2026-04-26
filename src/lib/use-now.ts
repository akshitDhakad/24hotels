import * as React from "react";

/**
 * Returns a monotonically increasing "now" timestamp that updates on an interval.
 * Implemented via `useSyncExternalStore` to satisfy strict purity linting.
 */
export function useNow(intervalMs = 1000): number {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      const id = setInterval(onStoreChange, intervalMs);
      return () => clearInterval(id);
    },
    () => Date.now(),
    () => 0,
  );
}

