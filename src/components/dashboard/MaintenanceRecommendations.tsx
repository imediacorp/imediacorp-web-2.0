/**
 * Maintenance Recommendations Component
 * Displays predictive maintenance insights and recommendations
 */

'use client';

import React from 'react';
import { TrendAnalysis, TrendData } from './TrendAnalysis';

export interface MaintenanceRecommendation {
  component: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  action?: string;
}

interface MaintenanceRecommendationsProps {
  recommendations: MaintenanceRecommendation[];
  componentHealth?: Record<string, number>; // Component name -> health score (0-100)
  trendData?: Array<{
    timestamp: string | Date;
    [key: string]: string | Date | number | undefined;
  }>;
  trendMetrics?: string[];
}

export function MaintenanceRecommendations({
  recommendations,
  componentHealth,
  trendData,
  trendMetrics = ['S', 'Q', 'U', 'D'],
}: MaintenanceRecommendationsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 60) return 'text-yellow-600';
    if (health >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Maintenance Recommendations</h3>

      {/* Trend Analysis */}
      {trendData && trendData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Trend Analysis</h4>
          <TrendAnalysis data={trendData} metrics={trendMetrics} />
        </div>
      )}

      {/* Component Health Scores */}
      {componentHealth && Object.keys(componentHealth).length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Component Health Scores</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(componentHealth).map(([component, health]) => (
              <div key={component} className="text-center">
                <div className={`text-2xl font-bold ${getHealthColor(health)}`}>
                  {health.toFixed(0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{component}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800 text-sm">
            ✅ All systems operating within normal parameters. Continue regular maintenance schedule.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`border rounded-md p-4 ${getSeverityColor(rec.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold mb-1">{rec.component}</div>
                  <p className="text-sm mb-2">{rec.message}</p>
                  {rec.action && (
                    <p className="text-xs font-medium mt-2">
                      💡 Recommended Action: {rec.action}
                    </p>
                  )}
                </div>
                <span className="ml-4 text-xs font-semibold uppercase">
                  {rec.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

