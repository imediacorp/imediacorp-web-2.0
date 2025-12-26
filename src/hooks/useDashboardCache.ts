/**
 * useDashboardCache Hook
 * Hook for accessing cached dashboard data with offline support
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardStore } from '@/lib/storage/dashboard-store';
import { syncManager } from '@/lib/offline/sync-manager';
import { getDashboardOfflineProfile } from '@/lib/offline/dashboard-profiles';

export interface UseDashboardCacheOptions {
  domain: string;
  endpoint: string;
  enabled?: boolean;
  refetchInterval?: number;
}

export interface UseDashboardCacheReturn<T> {
  data: T | null;
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;
  lastUpdated: number | null;
  refetch: () => Promise<void>;
}

export function useDashboardCache<T = unknown>(
  options: UseDashboardCacheOptions
): UseDashboardCacheReturn<T> {
  const { domain, endpoint, enabled = true, refetchInterval } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const loadFromCache = useCallback(async () => {
    try {
      const cached = await dashboardStore.get(domain, endpoint);
      if (cached) {
        setData(cached as T);
        
        // Check if stale
        const profile = getDashboardOfflineProfile(domain);
        if (profile) {
          const stale = await dashboardStore.isStale(domain, endpoint, profile.cacheDuration);
          setIsStale(stale);
        }

        const updateTime = await dashboardStore.getLastUpdateTime(domain);
        setLastUpdated(updateTime);
      }
    } catch (err) {
      console.error('Failed to load from cache:', err);
      setError(err instanceof Error ? err : new Error('Failed to load cache'));
    } finally {
      setIsLoading(false);
    }
  }, [domain, endpoint]);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // Trigger sync for this dashboard
      await syncManager.syncDashboard(domain, { force: true });
      
      // Reload from cache after sync
      await loadFromCache();
    } catch (err) {
      console.error('Failed to refetch:', err);
      setError(err instanceof Error ? err : new Error('Failed to refetch'));
      setIsLoading(false);
    }
  }, [domain, enabled, loadFromCache]);

  // Load from cache on mount
  useEffect(() => {
    if (enabled) {
      loadFromCache();
      
      // Sync on mount if profile requires it
      if (syncManager.shouldSyncOnMount(domain)) {
        syncManager.syncDashboard(domain).catch((err) => {
          console.error('Background sync failed:', err);
        });
      }
    }
  }, [domain, endpoint, enabled, loadFromCache]);

  // Set up refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) {
      return;
    }

    const interval = setInterval(() => {
      refetch();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, enabled, refetch]);

  return {
    data,
    isLoading,
    isStale,
    error,
    lastUpdated,
    refetch,
  };
}

/**
 * Hook to get all cached data for a domain
 */
export function useDashboardCacheByDomain(domain: string) {
  const [data, setData] = useState<Array<{ endpoint: string; data: unknown; timestamp: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const domainData = await dashboardStore.getByDomain(domain);
        setData(domainData);
      } catch (error) {
        console.error('Failed to load domain data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [domain]);

  return { data, isLoading };
}

