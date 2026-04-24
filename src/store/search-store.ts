import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SearchParams } from "@/types/search";

type SearchState = {
  params: SearchParams;
  setParams: (next: Partial<SearchParams>) => void;
  reset: () => void;
};

const defaultSearchParams: SearchParams = {
  destination: "",
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  rooms: 1,
  currency: "USD",
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      params: defaultSearchParams,
      setParams: (next) =>
        set((state) => ({ params: { ...state.params, ...next } })),
      reset: () => set({ params: defaultSearchParams }),
    }),
    {
      name: "24hotels.search",
      version: 1,
      partialize: (state) => ({ params: state.params }),
    },
  ),
);

