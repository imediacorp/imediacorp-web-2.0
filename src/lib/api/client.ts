/**
 * API Client Base
 * Handles HTTP requests to Python FastAPI backend
 * Enhanced with OAuth token support and offline queue
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { createSupabaseAuthClient } from '../auth/supabase';
import { offlineQueue } from '../storage/offline-queue';
import { setCachedData, getCachedData } from '../storage/indexeddb';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;
  private authClient: ReturnType<typeof createSupabaseAuthClient> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor for auth
    this.client.interceptors.request.use(
      async (config) => {
        // Lazy-load auth client only in browser
        if (typeof window !== 'undefined' && !this.authClient) {
          try {
            this.authClient = createSupabaseAuthClient();
          } catch (error) {
            console.warn('Failed to create auth client:', error);
          }
        }
        
        // Use Supabase auth token
        const authHeader = this.authClient?.getAuthorizationHeader();
        if (authHeader) {
          config.headers.Authorization = authHeader;
        } else {
          // Fallback to API key or other auth methods
          // TODO: Add API key support if needed
          const apiKey = process.env.NEXT_PUBLIC_API_KEY;
          if (apiKey) {
            config.headers['X-API-Key'] = apiKey;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Handle 401 Unauthorized - try token refresh
        if (error.response?.status === 401 && this.authClient) {
          const refreshToken = this.authClient.getRefreshToken();
          if (refreshToken && this.authClient.isTokenExpired()) {
            try {
              await this.authClient.refreshToken(refreshToken);
              // Retry original request with new token
              const authHeader = this.authClient.getAuthorizationHeader();
              if (authHeader && error.config) {
                error.config.headers.Authorization = authHeader;
                return this.client.request(error.config);
              }
            } catch (refreshError) {
              // Refresh failed - redirect to login
              console.error('Token refresh failed:', refreshError);
              await this.authClient.signOut();
              // Redirect to login page
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
              }
            }
          } else {
            // No refresh token or not expired - redirect to login
            if (this.authClient) {
              await this.authClient.signOut();
            }
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
          }
        }

        const apiError: ApiError = {
          detail:
            (error.response?.data as { detail?: string })?.detail ||
            error.message ||
            'Unknown error',
          status_code: error.response?.status || 500,
        };
        return Promise.reject(apiError);
      }
    );
  }

  private isOnline(): boolean {
    return typeof window !== 'undefined' ? navigator.onLine : true;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    // Check cache first
    const cacheKey = `get-${url}-${JSON.stringify(params || {})}`;
    const cached = await getCachedData<T>(cacheKey);
    if (cached) {
      return cached;
    }

    if (!this.isOnline()) {
      // Queue request for when online
      await offlineQueue.addRequest({
        method: 'GET',
        url,
        params,
      });
      // Return cached data if available, or throw error
      throw new Error('Offline: Request queued for sync');
    }

    try {
      const response = await this.client.get<T>(url, { params });
      // Cache successful responses
      await setCachedData(cacheKey, response.data, 300); // 5 minutes
      return response.data;
    } catch (error) {
      // If network error and we have cached data, return it
      if (error instanceof Error && error.message.includes('Network')) {
        const staleCache = await getCachedData<T>(cacheKey);
        if (staleCache) {
          return staleCache;
        }
      }
      throw error;
    }
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    if (!this.isOnline()) {
      // Queue request for when online
      await offlineQueue.addRequest({
        method: 'POST',
        url,
        data,
      });
      throw new Error('Offline: Request queued for sync');
    }

    try {
      const response = await this.client.post<T>(url, data);
      return response.data;
    } catch (error) {
      // If network error, queue the request
      if (error instanceof Error && error.message.includes('Network')) {
        await offlineQueue.addRequest({
          method: 'POST',
          url,
          data,
        });
      }
      throw error;
    }
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    if (!this.isOnline()) {
      // Queue request for when online
      await offlineQueue.addRequest({
        method: 'PUT',
        url,
        data,
      });
      throw new Error('Offline: Request queued for sync');
    }

    try {
      const response = await this.client.put<T>(url, data);
      return response.data;
    } catch (error) {
      // If network error, queue the request
      if (error instanceof Error && error.message.includes('Network')) {
        await offlineQueue.addRequest({
          method: 'PUT',
          url,
          data,
        });
      }
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    if (!this.isOnline()) {
      // Queue request for when online
      await offlineQueue.addRequest({
        method: 'DELETE',
        url,
      });
      throw new Error('Offline: Request queued for sync');
    }

    try {
      const response = await this.client.delete<T>(url);
      return response.data;
    } catch (error) {
      // If network error, queue the request
      if (error instanceof Error && error.message.includes('Network')) {
        await offlineQueue.addRequest({
          method: 'DELETE',
          url,
        });
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
