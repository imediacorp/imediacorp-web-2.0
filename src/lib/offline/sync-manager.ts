/**
 * Sync Manager
 * Coordinates selective sync strategies for dashboards
 */

import { getDashboardOfflineProfile, type DashboardOfflineProfile, type SyncStrategy } from './dashboard-profiles';
import { offlineQueue } from '../storage/offline-queue';
import { backgroundSyncManager } from '../sw/background-sync';

export interface SyncOptions {
  force?: boolean;
  priority?: 'high' | 'normal' | 'low';
}

export class SyncManager {
  private syncInProgress: Set<string> = new Set();
  private lastSyncTime: Map<string, number> = new Map();

  /**
   * Sync data for a specific dashboard domain
   */
  async syncDashboard(domain: string, options: SyncOptions = {}): Promise<void> {
    const profile = getDashboardOfflineProfile(domain);
    
    if (!profile) {
      console.warn(`No offline profile found for domain: ${domain}`);
      return;
    }

    // Check if sync is in progress
    if (this.syncInProgress.has(domain) && !options.force) {
      console.log(`Sync already in progress for domain: ${domain}`);
      return;
    }

    // Check cache duration
    const lastSync = this.lastSyncTime.get(domain) || 0;
    const now = Date.now();
    const timeSinceLastSync = (now - lastSync) / 1000; // seconds

    if (!options.force && timeSinceLastSync < profile.cacheDuration) {
      console.log(`Sync skipped for ${domain}: cache still valid`);
      return;
    }

    this.syncInProgress.add(domain);
    this.lastSyncTime.set(domain, now);

    try {
      switch (profile.syncStrategy) {
        case 'read-only':
          await this.syncReadOnly(domain, profile);
          break;
        case 'selective-sync':
          await this.syncSelective(domain, profile);
          break;
        case 'full-sync':
          await this.syncFull(domain, profile);
          break;
      }
    } catch (error) {
      console.error(`Sync failed for ${domain}:`, error);
      throw error;
    } finally {
      this.syncInProgress.delete(domain);
    }
  }

  /**
   * Read-only sync: Cache data but don't allow edits
   */
  private async syncReadOnly(domain: string, profile: DashboardOfflineProfile): Promise<void> {
    console.log(`Performing read-only sync for ${domain}`);
    
    // Fetch and cache data endpoints
    for (const endpoint of profile.dataToCache) {
      try {
        // Queue GET requests for caching
        await offlineQueue.addRequest({
          method: 'GET',
          url: endpoint,
        });
      } catch (error) {
        console.error(`Failed to queue request for ${endpoint}:`, error);
      }
    }
  }

  /**
   * Selective sync: Cache specific endpoints based on profile
   */
  private async syncSelective(domain: string, profile: DashboardOfflineProfile): Promise<void> {
    console.log(`Performing selective sync for ${domain}`);
    
    // Sync priority endpoints first
    for (const endpoint of profile.dataToCache) {
      try {
        await offlineQueue.addRequest({
          method: 'GET',
          url: endpoint,
        });
      } catch (error) {
        console.error(`Failed to queue request for ${endpoint}:`, error);
      }
    }
  }

  /**
   * Full sync: Cache all data and enable offline editing
   */
  private async syncFull(domain: string, profile: DashboardOfflineProfile): Promise<void> {
    console.log(`Performing full sync for ${domain}`);
    
    // Register background sync if enabled
    if (profile.backgroundSync) {
      await backgroundSyncManager.registerBackgroundSync();
    }

    // Queue all data endpoints
    for (const endpoint of profile.dataToCache) {
      try {
        await offlineQueue.addRequest({
          method: 'GET',
          url: endpoint,
        });
      } catch (error) {
        console.error(`Failed to queue request for ${endpoint}:`, error);
      }
    }
  }

  /**
   * Check if dashboard should sync on mount
   */
  shouldSyncOnMount(domain: string): boolean {
    const profile = getDashboardOfflineProfile(domain);
    return profile?.syncOnMount ?? false;
  }

  /**
   * Get last sync time for a domain
   */
  getLastSyncTime(domain: string): number | null {
    return this.lastSyncTime.get(domain) || null;
  }

  /**
   * Check if sync is in progress for a domain
   */
  isSyncing(domain: string): boolean {
    return this.syncInProgress.has(domain);
  }

  /**
   * Trigger background sync if enabled for domain
   */
  async triggerBackgroundSync(domain: string): Promise<void> {
    const profile = getDashboardOfflineProfile(domain);
    
    if (!profile?.backgroundSync) {
      return;
    }

    await backgroundSyncManager.triggerSync();
  }

  /**
   * Clear sync state for a domain
   */
  clearSyncState(domain: string): void {
    this.syncInProgress.delete(domain);
    this.lastSyncTime.delete(domain);
  }
}

export const syncManager = new SyncManager();

