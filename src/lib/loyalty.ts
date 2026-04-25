/** Tier labels for sidebar “account level” (display-only rules). */
export function membershipLabelFromPoints(loyaltyPoints: number): string {
  if (loyaltyPoints >= 20000) return "Diamond Member";
  if (loyaltyPoints >= 12000) return "Elite Member";
  if (loyaltyPoints >= 5000) return "Gold Member";
  return "Member";
}

export const DIAMOND_POINTS_THRESHOLD = 20000;

export function pointsToDiamond(loyaltyPoints: number): number {
  return Math.max(0, DIAMOND_POINTS_THRESHOLD - loyaltyPoints);
}

export function progressToDiamond(loyaltyPoints: number): number {
  return Math.min(100, Math.round((loyaltyPoints / DIAMOND_POINTS_THRESHOLD) * 100));
}
