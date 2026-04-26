import { z } from "zod";

/** Sign-up account type: maps to DB roles USER | HOST | ADMIN */
export const signUpAccountTypeSchema = z.enum(["customer", "host", "admin"]);

export const signUpSchema = z.object({
  role: signUpAccountTypeSchema,
  legalName: z.string().trim().min(2, "Enter your full legal name").max(120, "Name is too long"),
  contact: z
    .string()
    .trim()
    .min(3, "Enter email or phone number")
    .refine(
      (v) => z.string().email().safeParse(v).success || /^\+[1-9]\d{7,14}$/.test(v),
      "Enter a valid email or phone number (e.g., hello@company.com or +919876543210)",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
  confirmPassword: z.string(),
}).refine((v) => v.password === v.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export type SignInValues = z.infer<typeof signInSchema>;

