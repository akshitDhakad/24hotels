import { z } from "zod";

/** Sign-up account type: maps to DB roles USER | HOST | ADMIN */
export const signUpAccountTypeSchema = z.enum(["customer", "host", "admin"]);

export const signUpSchema = z.object({
  role: signUpAccountTypeSchema,
  name: z.string().trim().max(120, "Name is too long").optional(),
  email: z.string().trim().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

