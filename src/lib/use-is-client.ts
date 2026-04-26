import * as React from "react";

/**
 * Returns true only on the client after hydration.
 *
 * We intentionally avoid `useEffect(() => setState(true))` to comply with
 * strict hook linting and to prevent hydration mismatches for chart libraries.
 */
export function useIsClient(): boolean {
  return React.useSyncExternalStore(
    // No subscription needed; hydration is the only transition we care about.
    () => () => {},
    () => true,
    () => false,
  );
}

