import type { SignupContactType } from "@prisma/client";

export type RegistrationRow = {
  email: string;
  phone: string | null;
  registrationContactType: SignupContactType | null;
  phoneVerified?: Date | null;
};

export function inferRegistrationChannel(row: RegistrationRow): SignupContactType {
  if (row.registrationContactType) return row.registrationContactType;
  if (row.email.toLowerCase().endsWith("@placeholder.local") && row.phone) return "PHONE";
  return "EMAIL";
}

export function isPlaceholderEmail(email: string): boolean {
  return email.toLowerCase().endsWith("@placeholder.local");
}

export function getProfileFieldLocks(row: RegistrationRow) {
  const registrationChannel = inferRegistrationChannel(row);
  const syntheticEmail = isPlaceholderEmail(row.email);
  return {
    registrationChannel,
    /** Phone signup: legal name + phone are verification-bound. */
    nameLocked: registrationChannel === "PHONE",
    /** Any verified phone number cannot be edited from this screen. */
    phoneLocked: registrationChannel === "PHONE" || !!row.phoneVerified,
    /** Email signup: login email is verification-bound. */
    emailLocked: registrationChannel === "EMAIL",
    /** Placeholder inbox is not a real editable email. */
    emailSynthetic: syntheticEmail,
  };
}
