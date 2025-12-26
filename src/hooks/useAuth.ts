/**
 * Authentication Hook
 * React hook for OAuth authentication state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { createOAuthClient, UserInfo } from '@/lib/auth/oauth';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  token: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
  });

  const oauthClient = createOAuthClient();

  useEffect(() => {
    const checkAuth = () => {
      const token = oauthClient.getAccessToken();
      const user = oauthClient.getUserInfo();
      const isExpired = oauthClient.isTokenExpired();

      setAuthState({
        isAuthenticated: !!token && !isExpired,
        isLoading: false,
        user,
        token,
      });
    };

    checkAuth();

    // Check auth state periodically (every 5 minutes)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback(() => {
    oauthClient.login();
  }, [oauthClient]);

  const logout = useCallback(() => {
    oauthClient.logout();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
    });
    // Redirect to login page
    window.location.href = '/auth/login';
  }, [oauthClient]);

  return {
    ...authState,
    login,
    logout,
  };
}

