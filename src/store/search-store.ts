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
  currency: "INR",
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
      version: 3,
      partialize: (state) => ({ params: state.params }),
      migrate: (persisted: unknown) => {
        const obj = persisted as { params?: Partial<SearchParams> } | null;
        const params = obj?.params ?? {};
        return {
          params: {
            ...defaultSearchParams,
            ...params,
            currency: "INR",
          },
        };
      },
    },
  ),
);

