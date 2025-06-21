import { supabase } from './supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  success: boolean;
  user?: UserProfile;
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

class AuthService {
  private currentUser: UserProfile | null = null;
  private session: Session | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    this.session = session;
    
    if (session?.user) {
      await this.loadUserProfile(session.user.id);
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      this.session = session;
      
      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      } else {
        this.currentUser = null;
      }
    });
  }

  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      this.currentUser = profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      });

      if (authError) {
        return {
          success: false,
          message: authError.message
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Registration failed - no user returned'
        };
      }

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load the user profile
      await this.loadUserProfile(authData.user.id);

      return {
        success: true,
        user: this.currentUser || undefined,
        message: 'Account created successfully! Please check your email to verify your account.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        return {
          success: false,
          message: authError.message
        };
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Login failed - no user returned'
        };
      }

      // Load the user profile
      await this.loadUserProfile(authData.user.id);

      return {
        success: true,
        user: this.currentUser || undefined,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      this.currentUser = null;
      this.session = null;
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    if (!this.session?.user) {
      return null;
    }

    if (!this.currentUser) {
      await this.loadUserProfile(this.session.user.id);
    }

    return this.currentUser;
  }

  async updateProfile(updates: Partial<Pick<UserProfile, 'name'>>): Promise<AuthResponse> {
    if (!this.currentUser) {
      return {
        success: false,
        message: 'No user logged in'
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.currentUser.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      this.currentUser = data;
      return {
        success: true,
        user: this.currentUser,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }

  getToken(): string | null {
    return this.session?.access_token || null;
  }

  getUser(): UserProfile | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!(this.session?.user && this.currentUser);
  }

  // Get the Supabase session for direct access if needed
  getSession(): Session | null {
    return this.session;
  }
}

export const authService = new AuthService();
export type { UserProfile, AuthResponse, LoginRequest, RegisterRequest };