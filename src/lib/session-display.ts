"use client";

import type { SessionUser } from "@/server/types/auth.types";

function isPlaceholderEmail(email: string | null | undefined): boolean {
  if (!email) return true;
  return email.toLowerCase().endsWith("@placeholder.local");
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return phone;
  const tail = digits.slice(-4);
  return `${phone.slice(0, Math.max(0, phone.length - tail.length))}${"•".repeat(Math.min(6, Math.max(0, digits.length - 4)))}${tail}`;
}

export function getUserPrimaryLabel(user?: Partial<SessionUser> | null): string {
  const name = user?.name?.trim();
  if (name) return name;
  const email = user?.email?.trim();
  if (email && !isPlaceholderEmail(email)) return email;
  const phone = user?.phone?.trim();
  if (phone) return maskPhone(phone);
  return "Host";
}

export function getUserSecondaryLabel(user?: Partial<SessionUser> | null): string | null {
  const email = user?.email?.trim();
  if (email && !isPlaceholderEmail(email)) return email;
  const phone = user?.phone?.trim();
  return phone ? maskPhone(phone) : null;
}

