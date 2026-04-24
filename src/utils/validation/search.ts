import { z } from "zod";

import { isoDateStringSchema } from "@/utils/validation/common";

export const searchFormSchema = z
  .object({
    destination: z.string().trim().min(2, "Enter a destination"),
    checkIn: isoDateStringSchema.nullable(),
    checkOut: isoDateStringSchema.nullable(),
    adults: z.number().int().min(1).max(10),
    children: z.number().int().min(0).max(10),
    rooms: z.number().int().min(1).max(10),
    currency: z.enum(["USD", "EUR", "GBP", "INR"]),
  })
  .refine(
    (v) => {
      if (!v.checkIn || !v.checkOut) return true;
      return v.checkOut > v.checkIn;
    },
    { message: "Check-out must be after check-in", path: ["checkOut"] },
  );

export type SearchFormValues = z.infer<typeof searchFormSchema>;

