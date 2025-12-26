/**
 * useOfflineStatus Hook
 * Tracks online/offline status and queue size
 */

'use client';

import { useState, useEffect } from 'react';
import { offlineQueue } from '@/lib/storage/offline-queue';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateQueueSize = () => {
      setQueueSize(offlineQueue.getQueueSize());
    };

    const handleQueueSynced = () => {
      updateQueueSize();
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('offline-queue-synced', handleQueueSynced);

    // Initial queue size
    updateQueueSize();

    // Poll queue size periodically
    const interval = setInterval(updateQueueSize, 1000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('offline-queue-synced', handleQueueSynced);
      clearInterval(interval);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    queueSize,
    hasQueuedRequests: queueSize > 0,
  };
}

