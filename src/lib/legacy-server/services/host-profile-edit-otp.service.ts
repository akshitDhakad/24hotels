import type { SignupContactType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/legacy-server/config/env";
import { logger } from "@/lib/legacy-server/config/logger";
import { Errors } from "@/lib/legacy-server/errors/errorFactory";
import { sendEmailOtp, sendSmsOtp } from "@/lib/legacy-server/services/otp.service";
import { randomNumericCode, randomTokenBytes, sha256Hex } from "@/lib/legacy-server/utils/crypto";
import { inferRegistrationChannel, isPlaceholderEmail } from "@/lib/legacy-server/utils/registration-channel";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60_000;
const OTP_MAX_ATTEMPTS = 3;
const OTP_LOCK_MS = 30 * 60_000;
const OTP_RESEND_MS = 60_000;
const EDIT_TOKEN_TTL_MS = 15 * 60_000;

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
  const digits = phone.replace(/\D/g, "");
  const last = digits.slice(-4);
  return `+${digits.slice(0, Math.max(0, digits.length - 4)).replace(/./g, "*")}${last}`;
}

async function loadUserForOtp(userId: string) {
  const row = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      email: true,
      phone: true,
      emailVerified: true,
      phoneVerified: true,
      registrationContactType: true,
      profileEditOtpHash: true,
      profileEditOtpExpiresAt: true,
      profileEditOtpLockedUntil: true,
      profileEditOtpLastSentAt: true,
    },
  });
  if (!row) throw Errors.NotFound("User");
  return row;
}

function otpChannelForUser(row: Awaited<ReturnType<typeof loadUserForOtp>>): SignupContactType {
  const channel = inferRegistrationChannel(row);
  if (channel === "EMAIL") {
    if (isPlaceholderEmail(row.email)) {
      throw Errors.BadRequest("This account has no deliverable email. Contact support.");
    }
    return "EMAIL";
  }
  if (!row.phoneVerified || !row.phone) {
    throw Errors.BadRequest("Verify your phone before updating your profile.");
  }
  return "PHONE";
}

export async function startHostProfileEditOtp(userId: string) {
  const row = await loadUserForOtp(userId);
  if (row.profileEditOtpLockedUntil && row.profileEditOtpLockedUntil > now()) {
    throw Errors.RateLimit("Too many failed attempts. Try again in 30 minutes.");
  }
  if (row.profileEditOtpLastSentAt && Date.now() - row.profileEditOtpLastSentAt.getTime() < OTP_RESEND_MS) {
    throw Errors.RateLimit("Please wait about a minute before requesting another code.");
  }

  const sendChannel = otpChannelForUser(row);
  const otp = randomNumericCode(OTP_LENGTH);
  const otpHash = sha256Hex(`${env.NEXTAUTH_SECRET}:${otp}`);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  try {
    if (sendChannel === "EMAIL") {
      await sendEmailOtp(row.email, otp);
    } else {
      await sendSmsOtp(row.phone!, otp);
    }
  } catch (e) {
    logger.error({ err: e, userId, sendChannel }, "profile_edit_otp_send_failed");
    const detail = env.NODE_ENV !== "production" && e instanceof Error ? ` (${e.message})` : "";
    if (sendChannel === "EMAIL") {
      throw Errors.BadRequest(
        `Could not send verification email. Confirm SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM in your environment.${detail}`,
      );
    }
    throw Errors.BadRequest(
      `Could not send verification SMS. Configure TWILLIO_ACCOUNT_SID, TWILLIO_AUTH_TOKEN, and TWILLIO_PHONE_NUMBER.${detail}`,
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      profileEditOtpHash: otpHash,
      profileEditOtpExpiresAt: expiresAt,
      profileEditOtpAttempts: 0,
      profileEditOtpLastSentAt: now(),
      profileEditOtpLockedUntil: null,
      profileEditOtpChannel: sendChannel,
      profileEditTokenHash: null,
      profileEditTokenExpiresAt: null,
    },
  });

  if (sendChannel === "EMAIL") {
    return { maskedContact: maskEmail(row.email), expiresAt, channel: sendChannel };
  }
  return { maskedContact: maskPhone(row.phone!), expiresAt, channel: sendChannel };
}

export async function resendHostProfileEditOtp(userId: string) {
  const row = await loadUserForOtp(userId);
  if (row.profileEditOtpLockedUntil && row.profileEditOtpLockedUntil > now()) {
    throw Errors.RateLimit("Too many failed attempts. Try again in 30 minutes.");
  }
  if (!row.profileEditOtpHash || !row.profileEditOtpExpiresAt) {
    throw Errors.BadRequest("Start verification first.");
  }
  if (row.profileEditOtpLastSentAt && Date.now() - row.profileEditOtpLastSentAt.getTime() < OTP_RESEND_MS) {
    throw Errors.RateLimit("Please wait about a minute before requesting another code.");
  }

  const sendChannel = otpChannelForUser(row);
  const otp = randomNumericCode(OTP_LENGTH);
  const otpHash = sha256Hex(`${env.NEXTAUTH_SECRET}:${otp}`);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  try {
    if (sendChannel === "EMAIL") {
      await sendEmailOtp(row.email, otp);
    } else {
      await sendSmsOtp(row.phone!, otp);
    }
  } catch (e) {
    logger.error({ err: e, userId, sendChannel }, "profile_edit_otp_resend_failed");
    const detail = env.NODE_ENV !== "production" && e instanceof Error ? ` (${e.message})` : "";
    if (sendChannel === "EMAIL") {
      throw Errors.BadRequest(
        `Could not send verification email. Confirm SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM in your environment.${detail}`,
      );
    }
    throw Errors.BadRequest(
      `Could not send verification SMS. Configure TWILLIO_ACCOUNT_SID, TWILLIO_AUTH_TOKEN, and TWILLIO_PHONE_NUMBER.${detail}`,
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      profileEditOtpHash: otpHash,
      profileEditOtpExpiresAt: expiresAt,
      profileEditOtpLastSentAt: now(),
    },
  });

  if (sendChannel === "EMAIL") {
    return { maskedContact: maskEmail(row.email), expiresAt, channel: sendChannel };
  }
  return { maskedContact: maskPhone(row.phone!), expiresAt, channel: sendChannel };
}

export async function verifyHostProfileEditOtp(userId: string, otp: string) {
  const row = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      profileEditOtpHash: true,
      profileEditOtpExpiresAt: true,
      profileEditOtpLockedUntil: true,
      profileEditOtpAttempts: true,
    },
  });
  if (!row?.profileEditOtpHash || !row.profileEditOtpExpiresAt) throw Errors.BadRequest("Start verification first.");
  if (row.profileEditOtpLockedUntil && row.profileEditOtpLockedUntil > now()) throw Errors.RateLimit();
  if (row.profileEditOtpExpiresAt < now()) throw Errors.BadRequest("OTP expired. Please resend.");

  const expected = row.profileEditOtpHash;
  const actual = sha256Hex(`${env.NEXTAUTH_SECRET}:${otp}`);
  if (expected !== actual) {
    const attempts = row.profileEditOtpAttempts + 1;
    const lockedUntil = attempts >= OTP_MAX_ATTEMPTS ? new Date(Date.now() + OTP_LOCK_MS) : null;
    await prisma.user.update({
      where: { id: userId },
      data: { profileEditOtpAttempts: attempts, profileEditOtpLockedUntil: lockedUntil },
    });
    throw Errors.Unauthorized("Invalid code.");
  }

  const profileEditToken = randomTokenBytes(32);
  const profileEditTokenHash = sha256Hex(`${env.NEXTAUTH_SECRET}:${profileEditToken}`);
  const tokenExpiresAt = new Date(Date.now() + EDIT_TOKEN_TTL_MS);

  await prisma.user.update({
    where: { id: userId },
    data: {
      profileEditOtpHash: null,
      profileEditOtpExpiresAt: null,
      profileEditOtpAttempts: 0,
      profileEditOtpLockedUntil: null,
      profileEditOtpLastSentAt: null,
      profileEditOtpChannel: null,
      profileEditTokenHash: profileEditTokenHash,
      profileEditTokenExpiresAt: tokenExpiresAt,
    },
  });

  return { profileEditToken, expiresAt: tokenExpiresAt };
}
