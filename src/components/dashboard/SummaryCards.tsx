/**
 * Summary Cards Component
 * Displays key metrics in card format (S/Q/U/D, health, performance metrics)
 */

'use client';

import React from 'react';
import { MetricsCard } from './MetricsCard';
import type { SQUDScore } from '@/types/api';

interface SummaryCardsProps {
  squd: SQUDScore;
  health: number;
  domain: string;
  performanceMetrics?: Record<string, number | string>;
  vehicleType?: 'gas' | 'electric';
}

// Helper function to format metric values based on their type
function formatMetricValue(key: string, value: number | string): string {
  if (typeof value !== 'number') return value;
  
  // Temperature values - 1 decimal place
  if (key.includes('temp') || key.includes('Temp')) {
    return value.toFixed(1);
  }
  
  // Percentage values (SOC) - whole number
  if (key.includes('soc') || key.includes('SOC') || key.includes('percent') || key.includes('%')) {
    return Math.round(value).toString();
  }
  
  // Power values - 1 decimal place
  if (key.includes('power') || key.includes('Power')) {
    return value.toFixed(1);
  }
  
  // RPM values - whole number
  if (key.includes('rpm') || key.includes('RPM')) {
    return Math.round(value).toString();
  }
  
  // Speed values - 1 decimal place
  if (key.includes('speed') || key.includes('Speed')) {
    return value.toFixed(1);
  }
  
  // Default: 1 decimal place for other numeric values
  return value.toFixed(1);
}

export function SummaryCards({
  squd,
  health,
  domain,
  performanceMetrics,
  vehicleType,
}: SummaryCardsProps) {
  return (
    <div className="space-y-4">
      {/* S/Q/U/D Metrics Card */}
      <MetricsCard squd={squd} health={health} domain={domain} />

      {/* Performance Metrics Cards */}
      {performanceMetrics && Object.keys(performanceMetrics).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(performanceMetrics).map(([key, value]) => (
            <div
              key={key}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="text-sm text-gray-500 mb-1">
                {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {typeof value === 'number' ? formatMetricValue(key, value) : value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vehicle-Specific Metrics */}
      {vehicleType === 'gas' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Max Coolant Temp</div>
            <div className="text-2xl font-semibold text-gray-900">
              {typeof performanceMetrics?.coolant_temp_max === 'number' 
                ? `${performanceMetrics.coolant_temp_max.toFixed(1)}°C`
                : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Mean Coolant Temp</div>
            <div className="text-2xl font-semibold text-gray-900">
              {typeof performanceMetrics?.coolant_temp_mean === 'number'
                ? `${performanceMetrics.coolant_temp_mean.toFixed(1)}°C`
                : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Mean RPM</div>
            <div className="text-2xl font-semibold text-gray-900">
              {typeof performanceMetrics?.rpm_mean === 'number'
                ? Math.round(performanceMetrics.rpm_mean).toString()
                : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Max RPM</div>
            <div className="text-2xl font-semibold text-gray-900">
              {typeof performanceMetrics?.rpm_max === 'number'
                ? Math.round(performanceMetrics.rpm_max).toString()
                : 'N/A'}
            </div>
          </div>
        </div>
      )}

      {vehicleType === 'electric' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Battery Temp Max</div>
            <div className="text-2xl font-semibold text-gray-900">
              {typeof performanceMetrics?.battery_temp_max === 'number'
                ? `${performanceMetrics.battery_temp_max.toFixed(1)}°C`
                : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Motor Temp Max</div>
            <div className="text-2xl font-semibold text-gray-900">
              {typeof performanceMetrics?.motor_temp_max === 'number'
                ? `${performanceMetrics.motor_temp_max.toFixed(1)}°C`
                : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">SOC Min</div>
            <div className="text-2xl font-semibold text-gray-900">
              {typeof performanceMetrics?.soc_min === 'number'
                ? `${Math.round(performanceMetrics.soc_min)}%`
                : 'N/A'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">Power Max</div>
            <div className="text-2xl font-semibold text-gray-900">
              {typeof performanceMetrics?.power_max === 'number'
                ? `${performanceMetrics.power_max.toFixed(1)} kW`
                : 'N/A'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

