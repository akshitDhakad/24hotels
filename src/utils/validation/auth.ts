import { z } from "zod";

export const authRoleSchema = z.enum(["user", "vendor"]);

export const signUpSchema = z.object({
  role: authRoleSchema,
  email: z.string().trim().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

