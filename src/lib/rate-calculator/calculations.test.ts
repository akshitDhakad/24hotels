import { describe, expect, it } from "vitest";

import { enforceMonotonicPrices } from "./calculations";

describe("enforceMonotonicPrices", () => {
  it("does not adjust an already monotonic series", () => {
    const raw = [100, 120, 140, 160];
    const { prices, adjusted } = enforceMonotonicPrices(raw);
    expect(prices).toEqual(raw);
    expect(adjusted).toEqual([false, false, false, false]);
  });

  it("adjusts downward violations upward", () => {
    const raw = [100, 95, 120, 110, 200];
    const { prices, adjusted } = enforceMonotonicPrices(raw);
    expect(prices).toEqual([100, 100, 120, 120, 200]);
    expect(adjusted).toEqual([false, true, false, true, false]);
  });
});

