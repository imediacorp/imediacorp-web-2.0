/**
 * Prediction Metrics Component
 * Display model performance metrics
 */

'use client';

import React from 'react';
import type { ModelMetrics } from '@/types/predictive';

interface PredictionMetricsProps {
  metrics: ModelMetrics;
}

export function PredictionMetrics({ metrics }: PredictionMetricsProps) {
  const metricEntries = Object.entries(metrics).filter(
    ([_, value]) => value !== undefined && value !== null
  );

  if (metricEntries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No metrics available yet. Train and evaluate the model to see metrics.</p>
      </div>
    );
  }

  const formatValue = (value: number): string => {
    if (value >= 1) return value.toFixed(2);
    return value.toFixed(4);
  };

  const getMetricLabel = (key: string): string => {
    const labels: Record<string, string> = {
      accuracy: 'Accuracy',
      rmse: 'RMSE',
      mae: 'MAE',
      mape: 'MAPE (%)',
      precision: 'Precision',
      recall: 'Recall',
      f1: 'F1 Score',
      auc: 'AUC',
    };
    return labels[key] || key;
  };

  const getMetricColor = (key: string, value: number): string => {
    // Higher is better for these metrics
    if (['accuracy', 'precision', 'recall', 'f1', 'auc'].includes(key)) {
      if (value >= 0.8) return 'text-green-600';
      if (value >= 0.6) return 'text-yellow-600';
      return 'text-red-600';
    }
    // Lower is better for these metrics
    if (['rmse', 'mae', 'mape'].includes(key)) {
      if (value <= 0.1) return 'text-green-600';
      if (value <= 0.2) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Model Performance Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricEntries.map(([key, value]) => (
          <div
            key={key}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="text-sm text-gray-500 mb-1">{getMetricLabel(key)}</div>
            <div className={`text-2xl font-semibold ${getMetricColor(key, value)}`}>
              {formatValue(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

