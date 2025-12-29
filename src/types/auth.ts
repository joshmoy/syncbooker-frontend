export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  displayPicture?: string | null;
  banner?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  username?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}