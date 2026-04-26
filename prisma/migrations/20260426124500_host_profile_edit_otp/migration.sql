-- AlterTable: profile edit OTP + registration channel
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "registrationContactType" "SignupContactType";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileEditOtpHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileEditOtpExpiresAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileEditOtpLockedUntil" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileEditOtpAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileEditOtpLastSentAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileEditOtpChannel" "SignupContactType";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileEditTokenHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "profileEditTokenExpiresAt" TIMESTAMP(3);

-- Backfill registration channel for existing rows
UPDATE "User"
SET "registrationContactType" = 'PHONE'::"SignupContactType"
WHERE "registrationContactType" IS NULL
  AND "email" LIKE '%@placeholder.local'
  AND "phone" IS NOT NULL;

UPDATE "User"
SET "registrationContactType" = 'EMAIL'::"SignupContactType"
WHERE "registrationContactType" IS NULL;
