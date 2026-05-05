import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/legacy-server/config/env";
import { Errors } from "@/lib/legacy-server/errors/errorFactory";
import { sendEmailOtp, sendSmsOtp } from "@/lib/legacy-server/services/otp.service";
import { randomNumericCode, randomTokenBytes, sha256Hex } from "@/lib/legacy-server/utils/crypto";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60_000;
const OTP_MAX_ATTEMPTS = 3;
const OTP_LOCK_MS = 30 * 60_000;
const OTP_RESEND_COOLDOWN_MS = 60_000;

function now() {
  return new Date();
}

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const safeUser = user.length <= 2 ? `${user[0] ?? ""}*` : `${user.slice(0, 2)}***`;
  return `${safeUser}@${domain}`;
}

function maskPhone(phone: string) {
  // Keep last 2-4 digits visible
  const digits = phone.replace(/\D/g, "");
  const last = digits.slice(-4);
  return `+${digits.slice(0, Math.max(0, digits.length - 4)).replace(/./g, "*")}${last}`;
}

function detectContactType(contact: string): { contactType: "EMAIL" | "PHONE"; email?: string; phone?: string } {
  const trimmed = contact.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  if (emailOk) return { contactType: "EMAIL", email: trimmed.toLowerCase() };
  const phoneOk = /^\+[1-9]\d{7,14}$/.test(trimmed);
  if (phoneOk) return { contactType: "PHONE", phone: trimmed };
  throw Errors.Validation({ contact: ["Enter a valid email or phone number"] });
}

export async function startSignupSession(input: {
  role: "customer" | "host" | "admin";
  contact: string;
  legalName: string;
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceFingerprint?: string | null;
}) {
  if (input.role === "admin" && !env.ALLOW_PUBLIC_ADMIN_SIGNUP) {
    throw Errors.Forbidden("Admin signup is disabled.");
  }
  const { contactType, email, phone } = detectContactType(input.contact);

  // Do not allow if user already exists on same identifier.
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw Errors.Conflict("An account with this email already exists.");
  }
  if (phone) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) throw Errors.Conflict("An account with this phone number already exists.");
  }

  const otp = randomNumericCode(OTP_LENGTH);
  const otpHash = sha256Hex(`${env.NEXTAUTH_SECRET}:${otp}`);
  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

  const session = await prisma.signupSession.create({
    data: {
      role: input.role === "customer" ? "USER" : input.role === "host" ? "HOST" : "ADMIN",
      contactType,
      email: email ?? null,
      phone: phone ?? null,
      legalName: input.legalName.trim(),
      passwordHash,
      clientTokenHash: sha256Hex(randomTokenBytes(32)), // placeholder, replaced on verify
      otpHash,
      otpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
      otpLastSentAt: now(),
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      deviceFingerprint: input.deviceFingerprint ?? null,
    },
    select: { id: true, contactType: true, email: true, phone: true, otpExpiresAt: true },
  });

  if (session.contactType === "EMAIL" && session.email) {
    await sendEmailOtp(session.email, otp);
  } else if (session.contactType === "PHONE" && session.phone) {
    await sendSmsOtp(session.phone, otp);
  }

  return {
    sessionId: session.id,
    contactType: session.contactType,
    maskedContact: session.email ? maskEmail(session.email) : session.phone ? maskPhone(session.phone) : "",
    expiresAt: session.otpExpiresAt,
  };
}

export async function resendSignupOtp(sessionId: string) {
  const session = await prisma.signupSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      contactType: true,
      email: true,
      phone: true,
      otpExpiresAt: true,
      otpLockedUntil: true,
      otpLastSentAt: true,
      verifiedAt: true,
      consumedAt: true,
    },
  });
  if (!session || session.consumedAt) throw Errors.NotFound("Signup session");
  if (session.verifiedAt) throw Errors.BadRequest("Already verified.");
  if (session.otpLockedUntil && session.otpLockedUntil > now()) throw Errors.RateLimit();
  if (session.otpLastSentAt && Date.now() - session.otpLastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    throw Errors.RateLimit();
  }

  const otp = randomNumericCode(OTP_LENGTH);
  const otpHash = sha256Hex(`${env.NEXTAUTH_SECRET}:${otp}`);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.signupSession.update({
    where: { id: sessionId },
    data: { otpHash, otpExpiresAt: expiresAt, otpLastSentAt: now() },
  });

  if (session.contactType === "EMAIL" && session.email) {
    await sendEmailOtp(session.email, otp);
  } else if (session.contactType === "PHONE" && session.phone) {
    await sendSmsOtp(session.phone, otp);
  }

  return { expiresAt };
}

export async function verifySignupOtp(sessionId: string, otp: string) {
  const session = await prisma.signupSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      role: true,
      contactType: true,
      email: true,
      phone: true,
      legalName: true,
      passwordHash: true,
      otpHash: true,
      otpExpiresAt: true,
      otpAttempts: true,
      otpLockedUntil: true,
      verifiedAt: true,
      consumedAt: true,
    },
  });
  if (!session || session.consumedAt) throw Errors.NotFound("Signup session");
  if (session.verifiedAt) throw Errors.BadRequest("Already verified.");
  if (session.otpLockedUntil && session.otpLockedUntil > now()) throw Errors.RateLimit();
  if (session.otpExpiresAt < now()) throw Errors.BadRequest("OTP expired. Please resend.");

  const expected = session.otpHash;
  const actual = sha256Hex(`${env.NEXTAUTH_SECRET}:${otp}`);
  if (expected !== actual) {
    const attempts = session.otpAttempts + 1;
    const lockedUntil = attempts >= OTP_MAX_ATTEMPTS ? new Date(Date.now() + OTP_LOCK_MS) : null;
    await prisma.signupSession.update({
      where: { id: sessionId },
      data: { otpAttempts: attempts, otpLockedUntil: lockedUntil },
    });
    throw Errors.Unauthorized("Invalid code.");
  }

  const signupToken = randomTokenBytes(32);
  const clientTokenHash = sha256Hex(`${env.NEXTAUTH_SECRET}:${signupToken}`);
  await prisma.signupSession.update({
    where: { id: sessionId },
    data: { verifiedAt: now(), clientTokenHash },
  });

  return {
    signupToken,
    role: session.role,
    contactType: session.contactType,
    email: session.email,
    phone: session.phone,
    legalName: session.legalName,
  };
}

export async function completeSignup(signupToken: string) {
  const tokenHash = sha256Hex(`${env.NEXTAUTH_SECRET}:${signupToken}`);
  const session = await prisma.signupSession.findFirst({
    where: { clientTokenHash: tokenHash, consumedAt: null },
    select: {
      id: true,
      role: true,
      contactType: true,
      email: true,
      phone: true,
      legalName: true,
      passwordHash: true,
      verifiedAt: true,
      consumedAt: true,
    },
  });
  if (!session) throw Errors.Unauthorized("Invalid or expired signup token.");
  if (!session.verifiedAt) throw Errors.Unauthorized("Contact is not verified.");

  // Re-check uniqueness at final step to prevent race.
  if (session.email) {
    const existing = await prisma.user.findUnique({ where: { email: session.email } });
    if (existing) throw Errors.Conflict("An account with this email already exists.");
  }
  if (session.phone) {
    const existing = await prisma.user.findUnique({ where: { phone: session.phone } });
    if (existing) throw Errors.Conflict("An account with this phone number already exists.");
  }

  const user = await prisma.user.create({
    data: {
      email: session.email ?? `${session.id}@placeholder.local`,
      phone: session.phone ?? null,
      name: session.legalName,
      role: session.role,
      registrationContactType: session.contactType,
      passwordHash: session.passwordHash,
      emailVerified: session.contactType === "EMAIL" ? now() : null,
      phoneVerified: session.contactType === "PHONE" ? now() : null,
      profile: {
        create: {},
      },
      hostKyc:
        session.role === "HOST"
          ? {
              create: {},
            }
          : undefined,
    },
    select: { id: true, email: true, role: true, name: true },
  });

  await prisma.signupSession.update({
    where: { id: session.id },
    data: { consumedAt: now() },
  });

  return user;
}

