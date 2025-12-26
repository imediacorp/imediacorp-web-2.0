/**
 * Trend Analysis Component
 * Calculates and displays trends for S/Q/U/D metrics and other time series data
 */

'use client';

import React, { useMemo } from 'react';

export interface TrendData {
  metric: string;
  slope: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  warning?: boolean;
}

interface TrendAnalysisProps {
  data: Array<{
    timestamp: string | Date;
    [key: string]: string | Date | number | undefined;
  }>;
  metrics: string[];
  windowSize?: number;
  onTrendsCalculated?: (trends: TrendData[]) => void;
}

export function TrendAnalysis({
  data,
  metrics,
  windowSize,
  onTrendsCalculated,
}: TrendAnalysisProps) {
  const trends = useMemo(() => {
    if (data.length < 2) return [];

    const window = windowSize || Math.min(100, Math.floor(data.length / 4));
    const recentData = data.slice(-window);
    const xValues = recentData.map((_, i) => i);

    const calculatedTrends: TrendData[] = metrics.map((metric) => {
      const yValues = recentData
        .map((d) => d[metric])
        .filter((v): v is number => typeof v === 'number');

      if (yValues.length < 2) {
        return {
          metric,
          slope: 0,
          trend: 'stable',
        };
      }

      // Simple linear regression to calculate slope
      const n = yValues.length;
      const sumX = xValues.slice(0, n).reduce((a, b) => a + b, 0);
      const sumY = yValues.reduce((a, b) => a + b, 0);
      const sumXY = xValues.slice(0, n).reduce((sum, x, i) => sum + x * yValues[i], 0);
      const sumX2 = xValues.slice(0, n).reduce((sum, x) => sum + x * x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

      // Determine trend direction
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      let warning = false;

      if (Math.abs(slope) < 0.0001) {
        trend = 'stable';
      } else if (slope > 0) {
        trend = 'increasing';
        // For S, increasing is good; for Q/U/D, increasing is bad
        if (metric === 'Q' || metric === 'U' || metric === 'D') {
          warning = true;
        }
      } else {
        trend = 'decreasing';
        // For S, decreasing is bad; for Q/U/D, decreasing is good
        if (metric === 'S') {
          warning = true;
        }
      }

      return {
        metric,
        slope,
        trend,
        warning: Math.abs(slope) > 0.001 ? warning : false,
      };
    });

    if (onTrendsCalculated) {
      onTrendsCalculated(calculatedTrends);
    }

    return calculatedTrends;
  }, [data, metrics, windowSize, onTrendsCalculated]);

  const warnings = trends.filter((t) => t.warning);

  return (
    <div className="space-y-4">
      {/* Trend Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trends.map((trend) => (
          <div
            key={trend.metric}
            className={`bg-white rounded-lg shadow-sm border p-4 ${
              trend.warning ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}
          >
            <div className="text-sm text-gray-500 mb-1">{trend.metric} Trend</div>
            <div
              className={`text-2xl font-semibold ${
                trend.warning ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              {trend.slope > 0 ? '+' : ''}
              {trend.slope.toFixed(4)}
            </div>
            <div className="text-xs text-gray-500 mt-1 capitalize">{trend.trend}</div>
          </div>
        ))}
      </div>

      {/* Early Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Early Warnings</h4>
          <ul className="space-y-1">
            {warnings.map((warning) => (
              <li key={warning.metric} className="text-sm text-yellow-800">
                {warning.metric === 'S' && warning.trend === 'decreasing' && (
                  <>⚠️ Stability (S) declining: {warning.slope.toFixed(4)} per sample</>
                )}
                {warning.metric === 'Q' && warning.trend === 'increasing' && (
                  <>⚠️ Coherence pressure (Q) increasing: {warning.slope.toFixed(4)} per sample</>
                )}
                {warning.metric === 'U' && warning.trend === 'increasing' && (
                  <>⚠️ Susceptibility (U) increasing: {warning.slope.toFixed(4)} per sample</>
                )}
                {warning.metric === 'D' && warning.trend === 'increasing' && (
                  <>⚠️ Diagnostic (D) increasing: {warning.slope.toFixed(4)} per sample</>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

