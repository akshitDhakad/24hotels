import { z } from "zod";

export const isoDateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format");

export const phoneE164Schema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{6,14}$/, "Invalid phone number");

