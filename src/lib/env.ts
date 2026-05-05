import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  API_VERSION: z.string().default("v1"),

  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  REDIS_URL: z.string(),

  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),

  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string().email(),

  TWILLIO_ACCOUNT_SID: z.string().optional(),
  TWILLIO_AUTH_TOKEN: z.string().optional(),
  TWILLIO_PHONE_NUMBER: z.string().optional(),

  BCRYPT_ROUNDS: z.coerce.number().default(12),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  UPLOAD_MAX_SIZE_MB: z.coerce.number().default(5),

  ALLOW_PUBLIC_ADMIN_SIGNUP: z
    .string()
    .optional()
    .transform((v) => v === "true"),

  /** Microservices API gateway (see /backend). Optional; defaults in getServerGatewayUrl(). */
  API_GATEWAY_URL: z.string().optional(),
  NEXT_PUBLIC_API_GATEWAY_URL: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables — app cannot start");
}

export const env = parsed.data;

export function getServerGatewayUrl(): string {
  const raw = env.API_GATEWAY_URL || env.NEXT_PUBLIC_API_GATEWAY_URL;
  const u = typeof raw === "string" && raw.trim() ? raw.trim() : "http://localhost:3000";
  return u.replace(/\/$/, "");
}
