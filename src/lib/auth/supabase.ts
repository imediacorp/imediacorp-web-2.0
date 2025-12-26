/**
 * Supabase Authentication
 * 
 * Simple email/password authentication using Supabase Auth.
 * Falls back from OAuth to direct Supabase authentication.
 */

export interface SupabaseAuthConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: User;
}

/**
 * Supabase Auth Client
 * Handles email/password authentication via Supabase
 */
export class SupabaseAuthClient {
  private config: SupabaseAuthConfig;
  private storage: Storage | null;

  constructor(config: SupabaseAuthConfig, storage?: Storage) {
    this.config = config;
    // Only use localStorage if we're in the browser
    this.storage = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthSession> {
    try {
      const response = await fetch(`${this.config.supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.supabaseKey,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || error.message || 'Authentication failed');
      }

      const data = await response.json();
      
      const session: AuthSession = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
        },
      };

      this.storeSession(session);
      return session;
    } catch (error) {
      console.error('Supabase sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    const accessToken = this.getAccessToken();
    
    if (accessToken) {
      try {
        await fetch(`${this.config.supabaseUrl}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': this.config.supabaseKey,
          },
        });
      } catch (error) {
        console.error('Supabase sign out error:', error);
      }
    }

    this.clearSession();
  }

  /**
   * Get current session
   */
  async getSession(): Promise<AuthSession | null> {
    const accessToken = this.getAccessToken();
    if (!accessToken) return null;

    try {
      const response = await fetch(`${this.config.supabaseUrl}/auth/v1/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': this.config.supabaseKey,
        },
      });

      if (!response.ok) {
        this.clearSession();
        return null;
      }

      const user = await response.json();
      return {
        access_token: accessToken,
        refresh_token: this.getRefreshToken() || '',
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        },
      };
    } catch (error) {
      console.error('Get session error:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthSession> {
    try {
      const response = await fetch(`${this.config.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.supabaseKey,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const session: AuthSession = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
        },
      };

      this.storeSession(session);
      return session;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearSession();
      throw error;
    }
  }

  /**
   * Store session in localStorage
   */
  private storeSession(session: AuthSession): void {
    if (!this.storage) return;
    this.storage.setItem('supabase_access_token', session.access_token);
    this.storage.setItem('supabase_refresh_token', session.refresh_token);
    if (session.expires_at) {
      this.storage.setItem('supabase_expires_at', session.expires_at.toString());
    }
    this.storage.setItem('supabase_user', JSON.stringify(session.user));
  }

  /**
   * Clear session from localStorage
   */
  private clearSession(): void {
    if (!this.storage) return;
    this.storage.removeItem('supabase_access_token');
    this.storage.removeItem('supabase_refresh_token');
    this.storage.removeItem('supabase_expires_at');
    this.storage.removeItem('supabase_user');
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    if (!this.storage) return null;
    return this.storage.getItem('supabase_access_token');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    if (!this.storage) return null;
    return this.storage.getItem('supabase_refresh_token');
  }

  /**
   * Get stored user
   */
  getUser(): User | null {
    if (!this.storage) return null;
    const stored = this.storage.getItem('supabase_user');
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    if (!this.storage) return true;
    const expiresAt = this.storage.getItem('supabase_expires_at');
    if (!expiresAt) return true;
    return Date.now() / 1000 >= parseInt(expiresAt, 10);
  }

  /**
   * Get authorization header value
   */
  getAuthorizationHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }
}

/**
 * Create Supabase auth client instance from environment variables
 */
export function createSupabaseAuthClient(): SupabaseAuthClient {
  const config: SupabaseAuthConfig = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iayzzndyaqcqpmksaweg.supabase.co',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY || '',
  };

  if (!config.supabaseKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_KEY is required');
  }

  return new SupabaseAuthClient(config);
}

