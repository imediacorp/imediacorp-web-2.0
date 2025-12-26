/**
 * Cross-Domain Comparison Types
 * Type definitions for comparing S/Q/U/D metrics across multiple domains
 */

import { SQUDScore } from './api';

/**
 * Domain identifier
 */
export type DomainId =
  | 'gas-vehicle'
  | 'electric-vehicle'
  | 'medical'
  | 'business'
  | 'grid'
  | 'industrial-fault'
  | 'wind'
  | 'solar'
  | 'geophysical'
  | 'cliodynamics'
  | 'aerospace'
  | 'quantum'
  | 'nuclear'
  | 'software'
  | 'network'
  | 'personnel-health';

/**
 * Domain snapshot data
 */
export interface DomainSnapshot {
  id: string;
  domain: DomainId;
  timestamp: string;
  squd: SQUDScore;
  health?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Comparison session configuration
 */
export interface ComparisonSession {
  id: string;
  name: string;
  description?: string;
  domains: DomainId[];
  configuration?: ComparisonConfiguration;
  created_at: string;
  updated_at: string;
}

/**
 * Comparison configuration
 */
export interface ComparisonConfiguration {
  timeRange?: {
    start: string;
    end: string;
  };
  metrics?: ('S' | 'Q' | 'U' | 'D' | 'health')[];
  showCorrelation?: boolean;
  showTrends?: boolean;
  normalization?: 'none' | 'min-max' | 'z-score';
}

/**
 * Comparison data for a single domain
 */
export interface DomainComparisonData {
  domain: DomainId;
  snapshots: DomainSnapshot[];
  summary: {
    avgS: number;
    avgQ: number;
    avgU: number;
    avgD: number;
    avgHealth: number;
    trendS: number;
    trendQ: number;
    trendU: number;
    trendD: number;
  };
}

/**
 * Correlation matrix entry
 */
export interface CorrelationEntry {
  domain1: DomainId;
  domain2: DomainId;
  metric: 'S' | 'Q' | 'U' | 'D';
  correlation: number;
  pValue?: number;
}

/**
 * Comparison result
 */
export interface ComparisonResult {
  sessionId: string;
  domains: DomainComparisonData[];
  correlations: CorrelationEntry[];
  insights?: string[];
}

/**
 * Comparison API request
 */
export interface ComparisonRequest {
  domains: DomainId[];
  timeRange?: {
    start: string;
    end: string;
  };
  configuration?: ComparisonConfiguration;
}

