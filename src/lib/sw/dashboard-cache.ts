/**
 * Dashboard-Specific Caching Logic
 * Implements caching strategies based on dashboard domain type
 */

export type DashboardType = 'read-heavy' | 'real-time' | 'hybrid';

export interface DashboardCacheConfig {
  domain: string;
  type: DashboardType;
  cacheFirstPatterns?: RegExp[];
  networkFirstPatterns?: RegExp[];
  staleWhileRevalidatePatterns?: RegExp[];
  cacheTTL?: number; // seconds
  maxCacheEntries?: number;
}

/**
 * Dashboard domain to type mapping
 * Read-heavy: Historical data, can be cached aggressively (portfolio-risk, business)
 * Real-time: Live monitoring, minimal caching (vehicle, medical)
 * Hybrid: Mix of both (grid, solar, wind)
 */
const dashboardCacheConfigs: Record<string, DashboardCacheConfig> = {
  'portfolio-risk': {
    domain: 'portfolio-risk',
    type: 'read-heavy',
    cacheFirstPatterns: [
      /\/api\/.*\/portfolio\/.*\/historical/,
      /\/api\/.*\/holdings/,
      /\/api\/.*\/recommendations/,
    ],
    networkFirstPatterns: [
      /\/api\/.*\/portfolio\/.*\/realtime/,
    ],
    cacheTTL: 60 * 60 * 24, // 24 hours for historical data
    maxCacheEntries: 500,
  },
  business: {
    domain: 'business',
    type: 'read-heavy',
    cacheFirstPatterns: [
      /\/api\/.*\/business\/.*\/historical/,
      /\/api\/.*\/kpi/,
    ],
    networkFirstPatterns: [
      /\/api\/.*\/business\/.*\/realtime/,
    ],
    cacheTTL: 60 * 60 * 12, // 12 hours
    maxCacheEntries: 300,
  },
  'gas-vehicle': {
    domain: 'gas-vehicle',
    type: 'real-time',
    networkFirstPatterns: [
      /\/api\/.*\/vehicle\/.*/,
      /\/api\/.*\/assess\/.*\/gas-vehicle/,
    ],
    cacheTTL: 60 * 5, // 5 minutes for fallback
    maxCacheEntries: 50,
  },
  'electric-vehicle': {
    domain: 'electric-vehicle',
    type: 'real-time',
    networkFirstPatterns: [
      /\/api\/.*\/vehicle\/.*/,
      /\/api\/.*\/assess\/.*\/electric-vehicle/,
    ],
    cacheTTL: 60 * 5, // 5 minutes
    maxCacheEntries: 50,
  },
  medical: {
    domain: 'medical',
    type: 'real-time',
    networkFirstPatterns: [
      /\/api\/.*\/medical\/.*/,
      /\/api\/.*\/assess\/.*\/medical/,
    ],
    cacheTTL: 60 * 2, // 2 minutes - critical data
    maxCacheEntries: 100,
  },
  grid: {
    domain: 'grid',
    type: 'hybrid',
    staleWhileRevalidatePatterns: [
      /\/api\/.*\/grid\/.*/,
      /\/api\/.*\/assess\/.*\/grid/,
    ],
    cacheTTL: 60 * 15, // 15 minutes
    maxCacheEntries: 200,
  },
  solar: {
    domain: 'solar',
    type: 'hybrid',
    staleWhileRevalidatePatterns: [
      /\/api\/.*\/solar\/.*/,
      /\/api\/.*\/assess\/.*\/solar/,
    ],
    cacheTTL: 60 * 30, // 30 minutes
    maxCacheEntries: 200,
  },
  wind: {
    domain: 'wind',
    type: 'hybrid',
    staleWhileRevalidatePatterns: [
      /\/api\/.*\/wind\/.*/,
      /\/api\/.*\/assess\/.*\/wind/,
    ],
    cacheTTL: 60 * 30, // 30 minutes
    maxCacheEntries: 200,
  },
};

/**
 * Get cache configuration for a dashboard domain
 */
export function getDashboardCacheConfig(domain: string): DashboardCacheConfig | null {
  // Try exact match
  if (dashboardCacheConfigs[domain]) {
    return dashboardCacheConfigs[domain];
  }

  // Try normalized domain (replace underscores with hyphens)
  const normalized = domain.replace(/_/g, '-');
  if (dashboardCacheConfigs[normalized]) {
    return dashboardCacheConfigs[normalized];
  }

  return null;
}

/**
 * Determine cache strategy for a URL based on dashboard domain
 */
export function getCacheStrategyForDashboard(
  url: string,
  domain: string
): 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'NetworkOnly' | 'CacheOnly' {
  const config = getDashboardCacheConfig(domain);
  
  if (!config) {
    // Default to network first for unknown dashboards
    return 'NetworkFirst';
  }

  // Check cache-first patterns
  if (config.cacheFirstPatterns) {
    for (const pattern of config.cacheFirstPatterns) {
      if (pattern.test(url)) {
        return 'CacheFirst';
      }
    }
  }

  // Check stale-while-revalidate patterns
  if (config.staleWhileRevalidatePatterns) {
    for (const pattern of config.staleWhileRevalidatePatterns) {
      if (pattern.test(url)) {
        return 'StaleWhileRevalidate';
      }
    }
  }

  // Check network-first patterns
  if (config.networkFirstPatterns) {
    for (const pattern of config.networkFirstPatterns) {
      if (pattern.test(url)) {
        return 'NetworkFirst';
      }
    }
  }

  // Default strategy based on dashboard type
  switch (config.type) {
    case 'read-heavy':
      return 'CacheFirst';
    case 'real-time':
      return 'NetworkFirst';
    case 'hybrid':
      return 'StaleWhileRevalidate';
    default:
      return 'NetworkFirst';
  }
}

/**
 * Extract dashboard domain from URL
 */
export function extractDashboardDomain(url: string): string | null {
  // Try to extract from URL path patterns
  const patterns = [
    /\/dashboards\/([^/]+)/,
    /\/api\/.*\/assess\/([^/]+)/,
    /\/api\/.*\/(portfolio|business|vehicle|medical|grid|solar|wind)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
  }

  return null;
}

/**
 * Get cache name for a dashboard domain
 */
export function getDashboardCacheName(domain: string): string {
  const normalized = domain.replace(/_/g, '-').toLowerCase();
  return `dashboard-${normalized}`;
}

