/**
 * Background Sync Implementation
 * Handles syncing queued requests when connection is restored
 */

import { offlineQueue } from '../storage/offline-queue';

class BackgroundSyncManager {
  private syncRegistered: boolean = false;

  async registerBackgroundSync(): Promise<boolean> {
    if (typeof window === 'undefined' || 'serviceWorker' in navigator === false) {
      return false;
    }

    if (this.syncRegistered) {
      return true;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // Register background sync
      if ('sync' in registration) {
        await registration.sync.register('sync-queue');
        this.syncRegistered = true;
        return true;
      } else {
        console.warn('Background Sync API not supported');
        // Fallback to manual sync on online event
        this.setupManualSync();
        return false;
      }
    } catch (error) {
      console.error('Failed to register background sync:', error);
      // Fallback to manual sync
      this.setupManualSync();
      return false;
    }
  }

  private setupManualSync(): void {
    // Manual sync fallback
    window.addEventListener('online', () => {
      offlineQueue.syncQueue();
    });
  }

  async triggerSync(): Promise<void> {
    if (typeof window === 'undefined' || 'serviceWorker' in navigator === false) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await registration.sync.register('sync-queue');
      } else {
        // Fallback: trigger sync manually
        await offlineQueue.syncQueue();
      }
    } catch (error) {
      console.error('Failed to trigger background sync:', error);
      // Fallback: trigger sync manually
      await offlineQueue.syncQueue();
    }
  }
}

export const backgroundSyncManager = new BackgroundSyncManager();

// Service Worker message handler for background sync
if (typeof window !== 'undefined') {
  navigator.serviceWorker?.ready.then((registration) => {
    // Listen for sync events
    if ('sync' in registration) {
      // The service worker will handle the sync event
      // This is just for client-side coordination
    }
  });
}

