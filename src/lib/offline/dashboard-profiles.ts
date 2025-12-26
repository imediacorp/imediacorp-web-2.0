/**
 * Dashboard Offline Profile System
 * Defines offline capabilities and sync strategies per dashboard type
 */

export type SyncStrategy = 'read-only' | 'selective-sync' | 'full-sync';

export interface DashboardOfflineProfile {
  domain: string;
  syncStrategy: SyncStrategy;
  cacheDuration: number; // seconds
  syncOnMount: boolean;
  backgroundSync: boolean;
  dataToCache: string[]; // API endpoints to cache
  maxCacheSize?: number; // MB
  allowOfflineView: boolean;
  allowOfflineEdit: boolean;
}

/**
 * Offline profiles for each dashboard domain
 */
const dashboardProfiles: Record<string, DashboardOfflineProfile> = {
  'portfolio-risk': {
    domain: 'portfolio-risk',
    syncStrategy: 'read-only',
    cacheDuration: 60 * 60 * 24, // 24 hours
    syncOnMount: true,
    backgroundSync: false,
    dataToCache: [
      '/api/portfolio/holdings',
      '/api/portfolio/recommendations',
      '/api/portfolio/historical',
      '/api/portfolio/analyze',
    ],
    maxCacheSize: 50, // 50 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
  business: {
    domain: 'business',
    syncStrategy: 'full-sync',
    cacheDuration: 60 * 60 * 12, // 12 hours
    syncOnMount: true,
    backgroundSync: true,
    dataToCache: [
      '/api/business/kpi',
      '/api/business/metrics',
      '/api/business/historical',
      '/api/assess/business',
    ],
    maxCacheSize: 100, // 100 MB
    allowOfflineView: true,
    allowOfflineEdit: true,
  },
  'gas-vehicle': {
    domain: 'gas-vehicle',
    syncStrategy: 'selective-sync',
    cacheDuration: 60 * 5, // 5 minutes
    syncOnMount: true,
    backgroundSync: false,
    dataToCache: [
      '/api/assess/gas-vehicle',
      '/api/vehicle/latest',
    ],
    maxCacheSize: 20, // 20 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
  'electric-vehicle': {
    domain: 'electric-vehicle',
    syncStrategy: 'selective-sync',
    cacheDuration: 60 * 5, // 5 minutes
    syncOnMount: true,
    backgroundSync: false,
    dataToCache: [
      '/api/assess/electric-vehicle',
      '/api/vehicle/latest',
    ],
    maxCacheSize: 20, // 20 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
  medical: {
    domain: 'medical',
    syncStrategy: 'selective-sync',
    cacheDuration: 60 * 2, // 2 minutes - critical data
    syncOnMount: true,
    backgroundSync: false,
    dataToCache: [
      '/api/assess/medical',
      '/api/medical/vitals',
      '/api/medical/latest',
    ],
    maxCacheSize: 30, // 30 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
  grid: {
    domain: 'grid',
    syncStrategy: 'selective-sync',
    cacheDuration: 60 * 15, // 15 minutes
    syncOnMount: true,
    backgroundSync: true,
    dataToCache: [
      '/api/assess/grid',
      '/api/grid/metrics',
      '/api/grid/status',
    ],
    maxCacheSize: 50, // 50 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
  solar: {
    domain: 'solar',
    syncStrategy: 'selective-sync',
    cacheDuration: 60 * 30, // 30 minutes
    syncOnMount: true,
    backgroundSync: true,
    dataToCache: [
      '/api/assess/solar',
      '/api/solar/metrics',
      '/api/solar/status',
    ],
    maxCacheSize: 50, // 50 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
  wind: {
    domain: 'wind',
    syncStrategy: 'selective-sync',
    cacheDuration: 60 * 30, // 30 minutes
    syncOnMount: true,
    backgroundSync: true,
    dataToCache: [
      '/api/assess/wind',
      '/api/wind/metrics',
      '/api/wind/status',
    ],
    maxCacheSize: 50, // 50 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
  industrial: {
    domain: 'industrial',
    syncStrategy: 'selective-sync',
    cacheDuration: 60 * 10, // 10 minutes
    syncOnMount: true,
    backgroundSync: false,
    dataToCache: [
      '/api/assess/industrial',
      '/api/industrial/metrics',
    ],
    maxCacheSize: 40, // 40 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
  software: {
    domain: 'software',
    syncStrategy: 'selective-sync',
    cacheDuration: 60 * 10, // 10 minutes
    syncOnMount: true,
    backgroundSync: true,
    dataToCache: [
      '/api/assess/software',
      '/api/software/metrics',
    ],
    maxCacheSize: 40, // 40 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
  cloud: {
    domain: 'cloud',
    syncStrategy: 'selective-sync',
    cacheDuration: 60 * 15, // 15 minutes
    syncOnMount: true,
    backgroundSync: true,
    dataToCache: [
      '/api/assess/cloud',
      '/api/cloud/metrics',
    ],
    maxCacheSize: 50, // 50 MB
    allowOfflineView: true,
    allowOfflineEdit: false,
  },
};

/**
 * Get offline profile for a dashboard domain
 */
export function getDashboardOfflineProfile(domain: string): DashboardOfflineProfile | null {
  // Try exact match
  if (dashboardProfiles[domain]) {
    return dashboardProfiles[domain];
  }

  // Try normalized domain (replace underscores with hyphens)
  const normalized = domain.replace(/_/g, '-');
  if (dashboardProfiles[normalized]) {
    return dashboardProfiles[normalized];
  }

  // Default profile for unknown dashboards
  return {
    domain,
    syncStrategy: 'read-only',
    cacheDuration: 60 * 60, // 1 hour default
    syncOnMount: false,
    backgroundSync: false,
    dataToCache: [],
    maxCacheSize: 20,
    allowOfflineView: true,
    allowOfflineEdit: false,
  };
}

/**
 * Check if a domain supports offline viewing
 */
export function supportsOfflineView(domain: string): boolean {
  const profile = getDashboardOfflineProfile(domain);
  return profile?.allowOfflineView ?? false;
}

/**
 * Check if a domain supports offline editing
 */
export function supportsOfflineEdit(domain: string): boolean {
  const profile = getDashboardOfflineProfile(domain);
  return profile?.allowOfflineEdit ?? false;
}

/**
 * Get all dashboard profiles
 */
export function getAllDashboardProfiles(): DashboardOfflineProfile[] {
  return Object.values(dashboardProfiles);
}

