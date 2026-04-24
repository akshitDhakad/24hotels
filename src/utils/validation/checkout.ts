import { z } from "zod";

import { phoneE164Schema } from "@/utils/validation/common";

export const checkoutGuestSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phoneCountryCode: z.string().trim().min(1).max(4),
  phoneNumber: phoneE164Schema,
  specialRequests: z.string().trim().max(500).optional().or(z.literal("")),
  paymentMethod: z.enum(["card", "paypal", "apple_pay"]),
});

export type CheckoutGuestValues = z.infer<typeof checkoutGuestSchema>;

