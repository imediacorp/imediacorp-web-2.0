/**
 * OAuth Integration
 * 
 * Integration layer for OAuth authentication from Rhapsode_INDE.
 * This module provides hooks and utilities for OAuth flow in the web framework.
 * 
 * OAuth implementation source: ~WebstormProjects/Rhapsode_INDE
 * GitHub: https://github.com/imediacorp/chadd
 */

export interface OAuthConfig {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  clientId: string;
  redirectUri: string;
  scopes?: string[];
  responseType?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface UserInfo {
  user_id: string;
  email: string;
  full_name?: string;
  tenant_id?: string;
  [key: string]: unknown;
}

/**
 * OAuth Client
 * Handles OAuth 2.0 authentication flow
 */
export class OAuthClient {
  private config: OAuthConfig;
  private storage: Storage;

  constructor(config: OAuthConfig, storage: Storage = window.localStorage) {
    this.config = config;
    this.storage = storage;
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: this.config.responseType || 'code',
      scope: this.config.scopes?.join(' ') || 'openid profile email',
      ...(state && { state }),
    });

    return `${this.config.authorizationEndpoint}?${params.toString()}`;
  }

  /**
   * Initiate OAuth login flow
   */
  login(state?: string): void {
    const authUrl = this.getAuthorizationUrl(state);
    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback (exchange authorization code for token)
   */
  async handleCallback(code: string, state?: string): Promise<TokenResponse> {
    try {
      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.config.clientId,
          redirect_uri: this.config.redirectUri,
          ...(state && { state }),
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const tokenData: TokenResponse = await response.json();
      this.storeTokens(tokenData);
      return tokenData;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const tokenData: TokenResponse = await response.json();
      this.storeTokens(tokenData);
      return tokenData;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Store tokens in storage
   */
  private storeTokens(tokenData: TokenResponse): void {
    this.storage.setItem('oauth_access_token', tokenData.access_token);
    this.storage.setItem('oauth_token_type', tokenData.token_type);
    
    if (tokenData.refresh_token) {
      this.storage.setItem('oauth_refresh_token', tokenData.refresh_token);
    }

    if (tokenData.expires_in) {
      const expiresAt = Date.now() + tokenData.expires_in * 1000;
      this.storage.setItem('oauth_token_expires_at', expiresAt.toString());
    }
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return this.storage.getItem('oauth_access_token');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return this.storage.getItem('oauth_refresh_token');
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiresAt = this.storage.getItem('oauth_token_expires_at');
    if (!expiresAt) return true;
    return Date.now() >= parseInt(expiresAt, 10);
  }

  /**
   * Get authorization header value
   */
  getAuthorizationHeader(): string | null {
    const token = this.getAccessToken();
    const tokenType = this.storage.getItem('oauth_token_type') || 'Bearer';
    return token ? `${tokenType} ${token}` : null;
  }

  /**
   * Logout (clear tokens)
   */
  logout(): void {
    this.storage.removeItem('oauth_access_token');
    this.storage.removeItem('oauth_refresh_token');
    this.storage.removeItem('oauth_token_type');
    this.storage.removeItem('oauth_token_expires_at');
    this.storage.removeItem('oauth_user_info');
  }

  /**
   * Store user info
   */
  storeUserInfo(userInfo: UserInfo): void {
    this.storage.setItem('oauth_user_info', JSON.stringify(userInfo));
  }

  /**
   * Get stored user info
   */
  getUserInfo(): UserInfo | null {
    const stored = this.storage.getItem('oauth_user_info');
    return stored ? JSON.parse(stored) : null;
  }
}

/**
 * Create OAuth client instance from environment variables
 */
export function createOAuthClient(): OAuthClient {
  const config: OAuthConfig = {
    authorizationEndpoint:
      process.env.NEXT_PUBLIC_OAUTH_AUTHORIZATION_ENDPOINT ||
      '/api/v1/auth/oauth/authorize',
    tokenEndpoint:
      process.env.NEXT_PUBLIC_OAUTH_TOKEN_ENDPOINT ||
      '/api/v1/auth/oauth/token',
    clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || '',
    redirectUri:
      process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI ||
      `${window.location.origin}/auth/callback`,
    scopes: process.env.NEXT_PUBLIC_OAUTH_SCOPES?.split(' ') || [
      'openid',
      'profile',
      'email',
    ],
    responseType: 'code',
  };

  return new OAuthClient(config);
}

