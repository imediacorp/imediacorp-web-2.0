/**
 * Supabase Authentication Hook
 * React hook for Supabase email/password authentication
 */

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseAuthClient, User } from '@/lib/auth/supabase';

export interface SupabaseAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<SupabaseAuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  const authClient = createSupabaseAuthClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = authClient.getUser();
        const token = authClient.getAccessToken();
        const isExpired = authClient.isTokenExpired();

        if (token && !isExpired && user) {
          // Verify session is still valid
          const session = await authClient.getSession();
          setAuthState({
            isAuthenticated: !!session,
            isLoading: false,
            user: session?.user || null,
            error: null,
          });
        } else if (token && isExpired) {
          // Try to refresh token
          const refreshToken = authClient.getRefreshToken();
          if (refreshToken) {
            try {
              const session = await authClient.refreshToken(refreshToken);
              setAuthState({
                isAuthenticated: true,
                isLoading: false,
                user: session.user,
                error: null,
              });
            } catch (error) {
              setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: 'Session expired. Please login again.',
              });
            }
          } else {
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              user: null,
              error: null,
            });
          }
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: error instanceof Error ? error.message : 'Authentication check failed',
        });
      }
    };

    checkAuth();

    // Check auth state periodically (every 5 minutes)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const session = await authClient.signIn(email, password);
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: session.user,
        error: null,
      });
      return session;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [authClient]);

  const signOut = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await authClient.signOut();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
      // Redirect to login page
      window.location.href = '/auth/login';
    } catch (error) {
      // Even if signOut fails, clear local state
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
      window.location.href = '/auth/login';
    }
  }, [authClient]);

  return {
    ...authState,
    signIn,
    signOut,
  };
}

