import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/config/database";
import { env } from "@/server/config/env";
import { Errors } from "@/server/errors/errorFactory";
import { sha256Hex } from "@/server/utils/crypto";
import { success, noContent } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSessionApi } from "@/server/utils/require-session-api";
import { getProfileFieldLocks } from "@/server/utils/registration-channel";

const putSchema = z.object({
  profileEditToken: z.string().min(24, "Verify your profile before saving."),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z
    .union([z.string().trim().regex(/^\+[1-9]\d{7,14}$/), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  image: z.union([z.string().trim().max(2048), z.null()]).optional(),
  address1: z.string().trim().min(3).max(200),
  address2: z.string().trim().max(200).nullable().optional().or(z.literal("").transform(() => null)),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80),
});

function now() {
  return new Date();
}

export const GET = asyncHandler(async (_req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const row = await prisma.user.findFirst({
    where: { id: user.id, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      emailVerified: true,
      phoneVerified: true,
      registrationContactType: true,
      profile: {
        select: {
          address1: true,
          address2: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
        },
      },
    },
  });
  if (!row) throw Errors.NotFound("User");
  const locks = getProfileFieldLocks(row);
  return success(
    {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      image: row.image,
      address1: row.profile?.address1 ?? null,
      address2: row.profile?.address2 ?? null,
      city: row.profile?.city ?? null,
      state: row.profile?.state ?? null,
      postalCode: row.profile?.postalCode ?? null,
      country: row.profile?.country ?? null,
      registrationChannel: locks.registrationChannel,
      nameLocked: locks.nameLocked,
      emailLocked: locks.emailLocked,
      phoneLocked: locks.phoneLocked,
      emailSynthetic: locks.emailSynthetic,
      emailVerified: !!row.emailVerified,
      phoneVerified: !!row.phoneVerified,
    },
    "OK",
  );
});

export const PUT = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const json: unknown = await req.json();
  const body = putSchema.parse(json);

  let imageNext: string | null | undefined;
  if (body.image === undefined) imageNext = undefined;
  else if (body.image === null) imageNext = null;
  else {
    const t = body.image.trim();
    imageNext = t === "" ? null : t;
  }
  if (imageNext) {
    const ok = z.string().url().safeParse(imageNext);
    if (!ok.success) throw Errors.Validation({ image: ["Enter a valid image URL"] });
  }

  await prisma.$transaction(async (tx) => {
    const row = await tx.user.findFirst({
      where: { id: user.id, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        phoneVerified: true,
        registrationContactType: true,
        profileEditTokenHash: true,
        profileEditTokenExpiresAt: true,
      },
    });
    if (!row) throw Errors.NotFound("User");
    if (!row.profileEditTokenHash || !row.profileEditTokenExpiresAt) {
      throw Errors.Unauthorized("Profile verification required.");
    }
    if (row.profileEditTokenExpiresAt < now()) {
      throw Errors.Unauthorized("Verification expired. Please verify again.");
    }
    const expectedToken = sha256Hex(`${env.NEXTAUTH_SECRET}:${body.profileEditToken}`);
    if (expectedToken !== row.profileEditTokenHash) {
      throw Errors.Unauthorized("Invalid verification token.");
    }

    const locks = getProfileFieldLocks(row);
    const incomingName = body.name.trim();
    const incomingEmail = body.email.trim().toLowerCase();
    const incomingPhone = body.phone ?? null;

    if (locks.nameLocked && incomingName !== (row.name ?? "").trim()) {
      throw Errors.Validation({ name: ["Name cannot be changed for phone-verified accounts."] });
    }
    if (locks.emailLocked && incomingEmail !== row.email.toLowerCase()) {
      throw Errors.Validation({ email: ["Email cannot be changed for email-verified accounts."] });
    }
    if (locks.phoneLocked && incomingPhone !== (row.phone ?? null)) {
      throw Errors.Validation({ phone: ["Verified phone cannot be changed."] });
    }
    if (locks.emailSynthetic && incomingEmail !== row.email.toLowerCase()) {
      throw Errors.Validation({ email: ["This account email cannot be edited here."] });
    }

    if (incomingEmail !== row.email.toLowerCase()) {
      const exists = await tx.user.findFirst({
        where: { email: incomingEmail, deletedAt: null, NOT: { id: user.id } },
        select: { id: true },
      });
      if (exists) throw Errors.Conflict("Email is already in use.");
    }
    if (incomingPhone && incomingPhone !== row.phone) {
      const exists = await tx.user.findFirst({
        where: { phone: incomingPhone, deletedAt: null, NOT: { id: user.id } },
        select: { id: true },
      });
      if (exists) throw Errors.Conflict("Phone number is already in use.");
    }

    await tx.user.update({
      where: { id: user.id },
      data: {
        name: locks.nameLocked ? row.name : incomingName,
        email: locks.emailLocked || locks.emailSynthetic ? row.email : incomingEmail,
        phone: locks.phoneLocked ? row.phone : incomingPhone,
        ...(imageNext === undefined ? {} : { image: imageNext }),
        profileEditTokenHash: null,
        profileEditTokenExpiresAt: null,
      },
    });

    await tx.userProfile.upsert({
      where: { userId: user.id },
      update: {
        address1: body.address1,
        address2: body.address2 ?? null,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
      },
      create: {
        userId: user.id,
        address1: body.address1,
        address2: body.address2 ?? null,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
      },
      select: { id: true },
    });
  });

  return success({ ok: true }, "Saved");
});

export const DELETE = asyncHandler(async (_req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  await prisma.user.update({
    where: { id: user.id },
    data: { image: null },
  });
  await prisma.userProfile.updateMany({
    where: { userId: user.id },
    data: { address1: null, address2: null, city: null, state: null, postalCode: null, country: null },
  });
  return noContent();
});
