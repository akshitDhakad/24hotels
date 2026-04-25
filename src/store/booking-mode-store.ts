import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingMode = "rooms" | "hours";

type BookingModeState = {
  mode: BookingMode;
  setMode: (mode: BookingMode) => void;
  toggle: () => void;
};

export const useBookingModeStore = create<BookingModeState>()(
  persist(
    (set, get) => ({
      mode: "rooms",
      setMode: (mode) => set({ mode }),
      toggle: () => {
        const next: BookingMode = get().mode === "hours" ? "rooms" : "hours";
        set({ mode: next });
      },
    }),
    {
      name: "24hotels.bookingMode",
      version: 1,
      partialize: (s) => ({ mode: s.mode }),
    },
  ),
);

