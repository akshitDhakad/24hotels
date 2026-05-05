import { z } from "zod";

export const LoginSchema = z
  .object({
    email: z.string().optional(),
    identifier: z.string().optional(),
    password: z.string().min(8).max(200),
  })
  .refine((v) => (v.email ?? v.identifier)?.trim(), {
    message: "Email or phone is required",
    path: ["identifier"],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
