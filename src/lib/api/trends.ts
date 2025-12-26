/**
 * Trends API Client
 * API client for trend analysis functionality
 */

import { apiClient } from './client';
import type {
  TrendAnalysisRequest,
  TrendAnalysisResult,
  TrendMetrics,
  TimeSeriesPoint,
} from '@/types/trends';

export const trendsApi = {
  /**
   * Analyze trends for time series data
   */
  async analyzeTrends(request: TrendAnalysisRequest): Promise<TrendAnalysisResult> {
    return apiClient.post<TrendAnalysisResult>('/api/v1/trends/analyze', request);
  },

  /**
   * Get trend metrics for a specific domain and metric
   */
  async getTrendMetrics(
    domain: string,
    metric: string,
    timeRange?: { start: string; end: string }
  ): Promise<TrendMetrics> {
    const params: Record<string, string> = { domain, metric };
    if (timeRange) {
      params.start = timeRange.start;
      params.end = timeRange.end;
    }
    return apiClient.get<TrendMetrics>('/api/v1/trends/metrics', params);
  },

  /**
   * Get historical trend data
   */
  async getHistoricalTrends(
    domain: string,
    metrics: string[],
    timeRange?: { start: string; end: string }
  ): Promise<TimeSeriesPoint[]> {
    const params: Record<string, string> = {
      domain,
      metrics: metrics.join(','),
    };
    if (timeRange) {
      params.start = timeRange.start;
      params.end = timeRange.end;
    }
    return apiClient.get<TimeSeriesPoint[]>('/api/v1/trends/historical', params);
  },

  /**
   * Calculate moving averages
   */
  async calculateMovingAverage(
    data: TimeSeriesPoint[],
    metric: string,
    window: number,
    type: 'SMA' | 'EMA' = 'SMA'
  ): Promise<number[]> {
    return apiClient.post<number[]>('/api/v1/trends/moving-average', {
      data,
      metric,
      window,
      type,
    });
  },
};

