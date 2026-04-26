import { z } from "zod";

const e164Phone = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Enter phone in international format (e.g., +919876543210)");

export const startSignupSchema = z
  .object({
    role: z.enum(["customer", "host"]),
    contact: z.string().trim().min(3),
    legalName: z.string().trim().min(2).max(120),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    confirmPassword: z.string(),
    deviceFingerprint: z.string().trim().max(200).optional(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine((v, ctx) => {
    const isEmail = z.string().email().safeParse(v.contact).success;
    const isPhone = e164Phone.safeParse(v.contact).success;
    if (!isEmail && !isPhone) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid email or phone number",
        path: ["contact"],
      });
    }
  });

export type StartSignupInput = z.infer<typeof startSignupSchema>;

export const verifySignupOtpSchema = z.object({
  sessionId: z.string().min(10),
  otp: z.string().trim().regex(/^\d{6}$/, "Enter 6-digit code"),
});

export type VerifySignupOtpInput = z.infer<typeof verifySignupOtpSchema>;

export const resendSignupOtpSchema = z.object({
  sessionId: z.string().min(10),
});

export type ResendSignupOtpInput = z.infer<typeof resendSignupOtpSchema>;

export const completeSignupSchema = z.object({
  signupToken: z.string().min(20),
});

export type CompleteSignupInput = z.infer<typeof completeSignupSchema>;

