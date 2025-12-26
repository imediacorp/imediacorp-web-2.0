/**
 * Dashboard Data Store
 * IndexedDB wrapper for storing dashboard data with versioning and quota management
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface DashboardStoreSchema extends DBSchema {
  dashboards: {
    key: string; // domain + endpoint combination
    value: {
      domain: string;
      endpoint: string;
      data: unknown;
      timestamp: number;
      version: number;
    };
    indexes: { 'by-domain': string; 'by-timestamp': number };
  };
  metadata: {
    key: string;
    value: {
      key: string;
      value: unknown;
      timestamp: number;
    };
  };
}

const DB_NAME = 'hdpd-dashboard-store';
const DB_VERSION = 1;
const MAX_CACHE_SIZE_MB = 100; // Maximum total cache size in MB
const BYTES_PER_MB = 1024 * 1024;

export class DashboardStore {
  private db: IDBPDatabase<DashboardStoreSchema> | null = null;
  private currentVersion = DB_VERSION;

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    if (this.db) {
      return;
    }

    this.db = await openDB<DashboardStoreSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Dashboard data store
        if (!db.objectStoreNames.contains('dashboards')) {
          const store = db.createObjectStore('dashboards', { keyPath: 'key' });
          store.createIndex('by-domain', 'domain');
          store.createIndex('by-timestamp', 'timestamp');
        }

        // Metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      },
    });
  }

  /**
   * Get database instance
   */
  private async getDB(): Promise<IDBPDatabase<DashboardStoreSchema>> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  /**
   * Store dashboard data
   */
  async set(domain: string, endpoint: string, data: unknown, version: number = 1): Promise<void> {
    const db = await this.getDB();
    const key = `${domain}:${endpoint}`;

    // Check quota before storing
    await this.enforceQuota(domain);

    await db.put('dashboards', {
      key,
      domain,
      endpoint,
      data,
      timestamp: Date.now(),
      version,
    });
  }

  /**
   * Get dashboard data
   */
  async get(domain: string, endpoint: string): Promise<unknown | null> {
    const db = await this.getDB();
    const key = `${domain}:${endpoint}`;

    const result = await db.get('dashboards', key);
    return result?.data ?? null;
  }

  /**
   * Get all data for a domain
   */
  async getByDomain(domain: string): Promise<Array<{ endpoint: string; data: unknown; timestamp: number }>> {
    const db = await this.getDB();
    const tx = db.transaction('dashboards', 'readonly');
    const index = tx.store.index('by-domain');
    const results = await index.getAll(domain);

    return results.map((r) => ({
      endpoint: r.endpoint,
      data: r.data,
      timestamp: r.timestamp,
    }));
  }

  /**
   * Remove dashboard data
   */
  async delete(domain: string, endpoint: string): Promise<void> {
    const db = await this.getDB();
    const key = `${domain}:${endpoint}`;
    await db.delete('dashboards', key);
  }

  /**
   * Remove all data for a domain
   */
  async deleteByDomain(domain: string): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('dashboards', 'readwrite');
    const index = tx.store.index('by-domain');
    const results = await index.getAllKeys(domain);

    await Promise.all(results.map((key) => tx.store.delete(key)));
    await tx.done;
  }

  /**
   * Clear all cached data
   */
  async clear(): Promise<void> {
    const db = await this.getDB();
    await db.clear('dashboards');
    await db.clear('metadata');
  }

  /**
   * Get cache size estimate
   */
  async getCacheSize(): Promise<number> {
    const db = await this.getDB();
    const tx = db.transaction('dashboards', 'readonly');
    const store = tx.store;
    const allData = await store.getAll();

    // Estimate size by stringifying data (rough estimate)
    const sizeBytes = allData.reduce((total, item) => {
      try {
        const jsonString = JSON.stringify(item.data);
        return total + new Blob([jsonString]).size;
      } catch {
        return total;
      }
    }, 0);

    return sizeBytes / BYTES_PER_MB; // Return in MB
  }

  /**
   * Enforce quota limits by removing oldest entries
   */
  private async enforceQuota(domain: string): Promise<void> {
    const currentSize = await this.getCacheSize();

    if (currentSize >= MAX_CACHE_SIZE_MB) {
      // Get domain profile to check max cache size
      const { getDashboardOfflineProfile } = await import('../offline/dashboard-profiles');
      const profile = getDashboardOfflineProfile(domain);
      const maxSizeMB = profile?.maxCacheSize ?? 20;

      // Remove oldest entries for this domain if over limit
      const db = await this.getDB();
      const tx = db.transaction('dashboards', 'readwrite');
      const index = tx.store.index('by-domain');
      const domainData = await index.getAll(domain);

      if (domainData.length > 0) {
        // Sort by timestamp and remove oldest
        domainData.sort((a, b) => a.timestamp - b.timestamp);
        const toRemove = domainData.slice(0, Math.floor(domainData.length * 0.2)); // Remove 20% oldest

        await Promise.all(toRemove.map((item) => tx.store.delete(item.key)));
      }

      await tx.done;
    }
  }

  /**
   * Set metadata
   */
  async setMetadata(key: string, value: unknown): Promise<void> {
    const db = await this.getDB();
    await db.put('metadata', {
      key,
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Get metadata
   */
  async getMetadata(key: string): Promise<unknown | null> {
    const db = await this.getDB();
    const result = await db.get('metadata', key);
    return result?.value ?? null;
  }

  /**
   * Get last update time for a domain
   */
  async getLastUpdateTime(domain: string): Promise<number | null> {
    const data = await this.getByDomain(domain);
    if (data.length === 0) {
      return null;
    }

    const timestamps = data.map((d) => d.timestamp);
    return Math.max(...timestamps);
  }

  /**
   * Check if data is stale
   */
  async isStale(domain: string, endpoint: string, maxAgeSeconds: number): Promise<boolean> {
    const db = await this.getDB();
    const key = `${domain}:${endpoint}`;
    const result = await db.get('dashboards', key);

    if (!result) {
      return true;
    }

    const ageSeconds = (Date.now() - result.timestamp) / 1000;
    return ageSeconds > maxAgeSeconds;
  }
}

export const dashboardStore = new DashboardStore();

// Initialize on module load
if (typeof window !== 'undefined') {
  dashboardStore.init().catch((error) => {
    console.error('Failed to initialize dashboard store:', error);
  });
}

