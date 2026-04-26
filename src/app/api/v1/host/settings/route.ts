import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/server/config/database";
import { success } from "@/server/utils/apiResponse";
import { asyncHandler, type AppRouteHandlerContext } from "@/server/utils/asyncHandler";
import { requireSessionApi } from "@/server/utils/require-session-api";

const patchSchema = z.object({
  businessName: z.string().trim().min(2).max(160).optional(),
  businessEmail: z.string().trim().email().optional(),
  businessPhone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/)
    .optional(),
  businessAddress: z.string().trim().min(3).max(240).optional(),
  taxId: z.string().trim().min(2).max(60).optional(),

  accountHolderName: z.string().trim().min(2).max(160).optional(),
  bankName: z.string().trim().min(2).max(160).optional(),
  accountNumber: z.string().trim().min(6).max(34).optional(),
  ifsc: z.string().trim().min(6).max(20).optional(),
  swift: z.string().trim().min(6).max(20).optional(),
});

export const GET = asyncHandler(async (_req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const row = await prisma.hostSettings.findUnique({
    where: { userId: user.id },
    select: {
      businessName: true,
      businessEmail: true,
      businessPhone: true,
      businessAddress: true,
      taxId: true,
      accountHolderName: true,
      bankName: true,
      accountNumberLast4: true,
      ifsc: true,
      swift: true,
      payoutStatus: true,
      complianceStatus: true,
      complianceNotes: true,
    },
  });
  return success(row ?? null, "OK");
});

export const PUT = asyncHandler(async (req: NextRequest, _ctx: AppRouteHandlerContext) => {
  const user = await requireSessionApi(["HOST"]);
  const json: unknown = await req.json();
  const patch = patchSchema.parse(json);

  const last4 = patch.accountNumber ? patch.accountNumber.replace(/\s+/g, "").slice(-4) : undefined;

  const updated = await prisma.hostSettings.upsert({
    where: { userId: user.id },
    update: {
      businessName: patch.businessName,
      businessEmail: patch.businessEmail?.toLowerCase(),
      businessPhone: patch.businessPhone,
      businessAddress: patch.businessAddress,
      taxId: patch.taxId,

      accountHolderName: patch.accountHolderName,
      bankName: patch.bankName,
      accountNumberLast4: last4 ?? undefined,
      ifsc: patch.ifsc,
      swift: patch.swift,
    },
    create: {
      userId: user.id,
      businessName: patch.businessName,
      businessEmail: patch.businessEmail?.toLowerCase(),
      businessPhone: patch.businessPhone,
      businessAddress: patch.businessAddress,
      taxId: patch.taxId,

      accountHolderName: patch.accountHolderName,
      bankName: patch.bankName,
      accountNumberLast4: last4 ?? null,
      ifsc: patch.ifsc,
      swift: patch.swift,
    },
    select: { id: true },
  });

  return success({ ok: !!updated.id }, "Saved");
});

