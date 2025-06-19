interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

const API_BASE_URL = 'http://localhost:8080/api';

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token and user from localStorage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          this.clearStorage();
        }
      }
    }
  }

  private saveToStorage(token: string, user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
    this.token = token;
    this.user = user;
  }

  private clearStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    this.token = null;
    this.user = null;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.token && result.user) {
        this.saveToStorage(result.token, result.user);
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.token && result.user) {
        this.saveToStorage(result.token, result.user);
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearStorage();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.user) {
        this.user = result.user;
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(result.user));
        }
        return result.user;
      } else {
        // Token might be invalid, clear storage
        this.clearStorage();
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearStorage();
      return null;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!(this.token && this.user);
  }
}

export const authService = new AuthService();
export type { User, AuthResponse, LoginRequest, RegisterRequest };