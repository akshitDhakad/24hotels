export type Role = "USER" | "HOST" | "ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: Role;
  loyaltyPoints: number;
};

export type JwtPayload = {
  id: string;
  role: Role;
};

