export type Role = "USER" | "HOST" | "ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  phone?: string | null;
  name: string | null;
  image: string | null;
  role: Role;
  loyaltyPoints: number;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  registrationChannel?: "EMAIL" | "PHONE";
};

export type JwtPayload = {
  id: string;
  role: Role;
};

