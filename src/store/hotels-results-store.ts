import { create } from "zustand";
import { persist } from "zustand/middleware";

type HotelsResultsState = {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetPaging: () => void;
};

const defaultState = {
  page: 1,
  pageSize: 6,
} as const;

function clampInt(v: number, min: number, max: number) {
  if (!Number.isFinite(v)) return min;
  const i = Math.trunc(v);
  return Math.min(max, Math.max(min, i));
}

export const useHotelsResultsStore = create<HotelsResultsState>()(
  persist(
    (set) => ({
      ...defaultState,
      setPage: (page) => set({ page: clampInt(page, 1, 10_000) }),
      setPageSize: (pageSize) =>
        set({ pageSize: clampInt(pageSize, 1, 60), page: 1 }),
      resetPaging: () => set({ ...defaultState }),
    }),
    {
      name: "24hotels.hotelsResults",
      version: 1,
      partialize: (s) => ({ page: s.page, pageSize: s.pageSize }),
    },
  ),
);

