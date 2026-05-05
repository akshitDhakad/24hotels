import bcrypt from "bcrypt";
import type { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/legacy-server/config/env";
import { Errors } from "@/lib/legacy-server/errors/errorFactory";
import type { RegisterBodyInput } from "@/lib/legacy-server/schemas/auth.schema";

/**
 * Registers a new user with password hashing. Maps account type to `Role`.
 *
 * @throws {AppError} When email exists, admin signup is disallowed, or DB errors occur.
 */
export async function registerUser(input: RegisterBodyInput) {
  if (input.accountType === "admin" && !env.ALLOW_PUBLIC_ADMIN_SIGNUP) {
    throw Errors.Forbidden("Administrator accounts cannot be created from sign-up.");
  }

  const role: Role =
    input.accountType === "customer" ? "USER" : input.accountType === "host" ? "HOST" : "ADMIN";

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw Errors.Conflict("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name?.trim() ? input.name.trim() : null,
      role,
      registrationContactType: "EMAIL",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
}
