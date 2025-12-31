export interface User {
  id: string;
  email: string | null;
  fullName: string | null;
  role: "user" | "admin" | "owner";
  image?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface LoginUserData {
  id?: string;
  email: string;
  password: string;
  role?: string;
  fullName?: string;
  [key: string]: unknown;
}

export interface SessionUser {
  fullName?: string;
  email?: string;
  [key: string]: unknown;
}

export interface ExtendedSessionUser {
  fullName?: string | null;
  role?: string | null;
  email?: string | null;
  name?: string | null;
}

export interface ExtendedToken {
  email?: string | null;
  fullName?: string;
  role?: string;
}

export interface ExtendedSession {
  user: {
    email?: string | null;
    fullName?: string;
    role?: string;
    name?: string | null;
    image?: string | null;
  };
}

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  role?: string;
  [key: string]: unknown;
}

export interface ProfileData {
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  instagram?: string;
  fullName?: string;
  email?: string;
}
