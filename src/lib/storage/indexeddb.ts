/**
 * IndexedDB Storage Utilities
 * Provides typed storage for dashboard data, analysis results, and configurations
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface HDPDDB extends DBSchema {
  analysisResults: {
    key: string;
    value: {
      id: string;
      domain: string;
      timestamp: string;
      assessment: unknown;
      timeSeriesData: unknown[];
      performanceMetrics: Record<string, number>;
    };
    indexes: { 'by-domain': string; 'by-timestamp': string };
  };
  dashboardConfigs: {
    key: string;
    value: {
      domain: string;
      config: unknown;
      timestamp: string;
    };
    indexes: { 'by-domain': string };
  };
  cachedData: {
    key: string;
    value: {
      key: string;
      data: unknown;
      timestamp: string;
      expiresAt: number;
    };
    indexes: { 'by-expires': number };
  };
}

let dbInstance: IDBPDatabase<HDPDDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<HDPDDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<HDPDDB>('hdpd-db', 1, {
    upgrade(db) {
      // Analysis results store
      if (!db.objectStoreNames.contains('analysisResults')) {
        const analysisStore = db.createObjectStore('analysisResults', {
          keyPath: 'id',
        });
        analysisStore.createIndex('by-domain', 'domain');
        analysisStore.createIndex('by-timestamp', 'timestamp');
      }

      // Dashboard configs store
      if (!db.objectStoreNames.contains('dashboardConfigs')) {
        const configStore = db.createObjectStore('dashboardConfigs', {
          keyPath: 'domain',
        });
        configStore.createIndex('by-domain', 'domain');
      }

      // Cached data store
      if (!db.objectStoreNames.contains('cachedData')) {
        const cacheStore = db.createObjectStore('cachedData', {
          keyPath: 'key',
        });
        cacheStore.createIndex('by-expires', 'expiresAt');
      }
    },
  });

  return dbInstance;
}

export interface AnalysisResult {
  id: string;
  domain: string;
  timestamp: string;
  assessment: unknown;
  timeSeriesData: unknown[];
  performanceMetrics: Record<string, number>;
}

export async function saveAnalysisResult(result: AnalysisResult): Promise<void> {
  const db = await getDB();
  await db.put('analysisResults', result);
}

export async function getAnalysisResult(id: string): Promise<AnalysisResult | undefined> {
  const db = await getDB();
  return db.get('analysisResults', id);
}

export async function getAnalysisResultsByDomain(
  domain: string
): Promise<AnalysisResult[]> {
  const db = await getDB();
  return db.getAllFromIndex('analysisResults', 'by-domain', domain);
}

export async function getRecentAnalysisResults(limit = 10): Promise<AnalysisResult[]> {
  const db = await getDB();
  const all = await db.getAll('analysisResults');
  return all
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export async function deleteAnalysisResult(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('analysisResults', id);
}

export async function clearExpiredCache(): Promise<void> {
  const db = await getDB();
  const now = Date.now();
  const index = db.transaction('cachedData').store.index('by-expires');
  
  let cursor = await index.openCursor(IDBKeyRange.upperBound(now));
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
}

export async function setCachedData(
  key: string,
  data: unknown,
  ttlSeconds = 3600
): Promise<void> {
  const db = await getDB();
  const expiresAt = Date.now() + ttlSeconds * 1000;
  await db.put('cachedData', {
    key,
    data,
    timestamp: new Date().toISOString(),
    expiresAt,
  });
}

export async function getCachedData<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  const cached = await db.get('cachedData', key);
  
  if (!cached) {
    return undefined;
  }

  if (cached.expiresAt < Date.now()) {
    await db.delete('cachedData', key);
    return undefined;
  }

  return cached.data as T;
}

