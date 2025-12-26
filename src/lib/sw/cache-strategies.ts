/**
 * Service Worker Cache Strategies
 * Defines caching strategies for different resource types
 */

import { extractDashboardDomain, getDashboardCacheName, getCacheStrategyForDashboard } from './dashboard-cache';

export interface CacheStrategy {
  name: string;
  handler: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'NetworkOnly' | 'CacheOnly';
  options?: {
    cacheName?: string;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
    };
    networkTimeoutSeconds?: number;
    cacheableResponse?: {
      statuses?: number[];
    };
  };
}

export const cacheStrategies: Record<string, CacheStrategy> = {
  staticAssets: {
    name: 'Static Assets',
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-assets',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  apiResponses: {
    name: 'API Responses',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hour
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  dashboardData: {
    name: 'Dashboard Data',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'dashboard-data',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 5 * 60, // 5 minutes
      },
    },
  },
  images: {
    name: 'Images',
    handler: 'CacheFirst',
    options: {
      cacheName: 'image-cache',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
};

/**
 * Get cache strategy for a given URL
 * Enhanced with dashboard-specific caching logic
 */
export function getCacheStrategy(url: string): CacheStrategy {
  // Try to detect dashboard domain from URL
  const dashboardDomain = extractDashboardDomain(url);
  
  if (dashboardDomain) {
    const strategy = getCacheStrategyForDashboard(url, dashboardDomain);
    const cacheName = getDashboardCacheName(dashboardDomain);
    
    // Import dashboard config synchronously (this file should be available at build time)
    // For runtime, we'll use a synchronous lookup
    const dashboardConfigs: Record<string, { maxCacheEntries?: number; cacheTTL?: number; type?: string }> = {
      'portfolio-risk': { maxCacheEntries: 500, cacheTTL: 60 * 60 * 24, type: 'read-heavy' },
      'business': { maxCacheEntries: 300, cacheTTL: 60 * 60 * 12, type: 'read-heavy' },
      'gas-vehicle': { maxCacheEntries: 50, cacheTTL: 60 * 5, type: 'real-time' },
      'electric-vehicle': { maxCacheEntries: 50, cacheTTL: 60 * 5, type: 'real-time' },
      'medical': { maxCacheEntries: 100, cacheTTL: 60 * 2, type: 'real-time' },
      'grid': { maxCacheEntries: 200, cacheTTL: 60 * 15, type: 'hybrid' },
      'solar': { maxCacheEntries: 200, cacheTTL: 60 * 30, type: 'hybrid' },
      'wind': { maxCacheEntries: 200, cacheTTL: 60 * 30, type: 'hybrid' },
    };
    
    const normalizedDomain = dashboardDomain.replace(/_/g, '-');
    const dashboardConfig = dashboardConfigs[normalizedDomain] || dashboardConfigs[dashboardDomain];
    
    if (dashboardConfig) {
      return {
        name: `Dashboard: ${dashboardDomain}`,
        handler: strategy,
        options: {
          cacheName,
          expiration: {
            maxEntries: dashboardConfig.maxCacheEntries || 100,
            maxAgeSeconds: dashboardConfig.cacheTTL || 60 * 60,
          },
          networkTimeoutSeconds: dashboardConfig.type === 'real-time' ? 5 : 10,
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      };
    }
  }
  
  // API endpoints
  if (url.includes('/api/')) {
    return cacheStrategies.apiResponses;
  }
  
  // Dashboard data endpoints
  if (url.includes('/dashboards/') || url.includes('/assess')) {
    return cacheStrategies.dashboardData;
  }
  
  // Images
  if (url.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i)) {
    return cacheStrategies.images;
  }
  
  // Static assets (JS, CSS, fonts)
  if (url.match(/\.(js|css|woff|woff2|ttf|eot)$/i)) {
    return cacheStrategies.staticAssets;
  }
  
  // Default to network first
  return cacheStrategies.apiResponses;
}

