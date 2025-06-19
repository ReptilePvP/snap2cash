export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Optional for responses (never send password back)
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  message?: string;
}