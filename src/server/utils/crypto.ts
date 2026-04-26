import crypto from "node:crypto";

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function randomNumericCode(length: number): string {
  if (length <= 0) throw new Error("length must be positive");
  // Generates uniform digits using rejection sampling under the hood (Node).
  const max = 10 ** length;
  const n = crypto.randomInt(0, max);
  return n.toString().padStart(length, "0");
}

export function randomTokenBytes(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

