/**
 * Offline Indicator Component
 * Visual indicator for offline status and sync queue
 */

'use client';

import React from 'react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

interface OfflineIndicatorProps {
  className?: string;
  showQueueSize?: boolean;
  variant?: 'banner' | 'badge' | 'inline';
}

export function OfflineIndicator({
  className = '',
  showQueueSize = true,
  variant = 'badge',
}: OfflineIndicatorProps) {
  const { isOnline, isOffline, queueSize, hasQueuedRequests } = useOfflineStatus();

  if (isOnline && !hasQueuedRequests) {
    return null;
  }

  if (variant === 'banner') {
    return (
      <div
        className={`bg-yellow-50 border-b border-yellow-200 px-4 py-2 ${
          isOffline ? 'bg-yellow-50' : 'bg-blue-50 border-blue-200'
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isOffline ? (
              <>
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                  />
                </svg>
                <span className="text-sm font-medium text-yellow-800">
                  You're offline. Changes will sync when connection is restored.
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 text-blue-600 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-sm font-medium text-blue-800">
                  Syncing changes...
                </span>
              </>
            )}
          </div>
          {showQueueSize && hasQueuedRequests && (
            <span className="text-sm text-gray-600">
              {queueSize} {queueSize === 1 ? 'item' : 'items'} pending
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
          isOffline
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-blue-100 text-blue-800'
        } ${className}`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isOffline
              ? 'bg-yellow-600'
              : 'bg-blue-600 animate-pulse'
          }`}
        />
        <span>
          {isOffline ? 'Offline' : 'Syncing'}
          {showQueueSize && queueSize > 0 && ` (${queueSize})`}
        </span>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isOffline ? (
        <span className="text-sm text-yellow-600">Offline</span>
      ) : (
        <span className="text-sm text-blue-600">
          Syncing{showQueueSize && queueSize > 0 && ` (${queueSize})`}
        </span>
      )}
    </div>
  );
}

