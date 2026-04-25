import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const registerBodySchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  name: z.string().trim().max(120).optional(),
  accountType: z.enum(["customer", "host", "admin"]),
});

export type RegisterBodyInput = z.infer<typeof registerBodySchema>;

