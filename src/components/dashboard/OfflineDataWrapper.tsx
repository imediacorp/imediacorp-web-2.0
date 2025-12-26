/**
 * Offline Data Wrapper Component
 * Wrapper component that provides offline-first data loading with cache fallbacks
 * Shows "last updated" timestamps and handles offline state
 */

'use client';

import React, { ReactNode } from 'react';
import { useDashboardCache } from '@/hooks/useDashboardCache';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { OfflineIndicator } from './OfflineIndicator';

interface OfflineDataWrapperProps<T> {
  domain: string;
  endpoint: string;
  children: (props: {
    data: T | null;
    isLoading: boolean;
    isStale: boolean;
    error: Error | null;
    lastUpdated: number | null;
    refetch: () => Promise<void>;
  }) => ReactNode;
  showOfflineIndicator?: boolean;
  showLastUpdated?: boolean;
  refetchInterval?: number;
}

export function OfflineDataWrapper<T = unknown>({
  domain,
  endpoint,
  children,
  showOfflineIndicator = true,
  showLastUpdated = true,
  refetchInterval,
}: OfflineDataWrapperProps<T>) {
  const { isOffline } = useOfflineStatus();
  const { data, isLoading, isStale, error, lastUpdated, refetch } = useDashboardCache<T>({
    domain,
    endpoint,
    enabled: true,
    refetchInterval,
  });

  const formatLastUpdated = (timestamp: number | null): string => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      {showOfflineIndicator && (isOffline || isStale) && (
        <div className="mb-4">
          <OfflineIndicator variant="badge" />
          {isStale && (
            <button
              onClick={refetch}
              className="ml-2 text-sm text-primary-600 hover:text-primary-700 underline touch-manipulation"
            >
              Refresh
            </button>
          )}
        </div>
      )}

      {showLastUpdated && lastUpdated && (
        <div className="mb-2 text-xs text-gray-500">
          Last updated: {formatLastUpdated(lastUpdated)}
          {isStale && ' (stale)'}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            {error.message}
            {!isOffline && (
              <button
                onClick={refetch}
                className="ml-2 underline touch-manipulation"
              >
                Retry
              </button>
            )}
          </p>
        </div>
      )}

      {children({ data, isLoading, isStale, error, lastUpdated, refetch })}
    </div>
  );
}

