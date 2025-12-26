/**
 * Metrics Card Component
 * Displays S/Q/U/D metrics in a card format with domain-specific terminology
 * Responsive design with mobile optimization
 */

'use client';

import React from 'react';
import { SQUDScore } from '@/types/api';
import { getSQUDLabel, getDomainTerminology } from '@/lib/dashboard/skills';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { MobileMetricsView } from '@/components/mobile/MobileMetricsView';

interface MetricsCardProps {
  squd: SQUDScore;
  health?: number;
  title?: string;
  domain?: string; // Domain name for terminology
  className?: string;
}

export function MetricsCard({ squd, health, title = 'Health Metrics', domain, className = '' }: MetricsCardProps) {
  const { isMobile } = useMobileDetection();
  
  // Use mobile component on mobile devices
  if (isMobile) {
    return (
      <MobileMetricsView
        squd={squd}
        health={health}
        domain={domain}
        className={className}
      />
    );
  }

  // Get domain-specific terminology
  const terminology = domain ? getDomainTerminology(domain) : null;
  
  const getSQUDLabelForDomain = (key: 'S' | 'Q' | 'U' | 'D'): string => {
    if (domain && terminology) {
      return getSQUDLabel(domain, key);
    }
    // Fallback to generic labels
    switch (key) {
      case 'S': return 'Stability';
      case 'Q': return 'Coherence';
      case 'U': return 'Susceptibility';
      case 'D': return 'Diagnostic';
    }
  };
  const getColorClass = (value: number, isD: boolean = false) => {
    if (isD) {
      // D: lower is better (red for high, green for low)
      if (value >= 0.7) return 'text-danger-600 bg-danger-50';
      if (value >= 0.5) return 'text-warning-600 bg-warning-50';
      return 'text-success-600 bg-success-50';
    } else {
      // S: higher is better, Q/U: lower is better
      const effectiveValue = title.includes('S') ? value : 1 - value;
      if (effectiveValue >= 0.7) return 'text-success-600 bg-success-50';
      if (effectiveValue >= 0.5) return 'text-warning-600 bg-warning-50';
      return 'text-danger-600 bg-danger-50';
    }
  };

  const getHealthColorClass = (h: number) => {
    if (h >= 70) return 'text-success-600';
    if (h >= 50) return 'text-warning-600';
    return 'text-danger-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {/* Health Score (if provided) */}
      {health !== undefined && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Overall Health</span>
            <span className={`text-3xl font-bold ${getHealthColorClass(health)}`}>
              {health.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                health >= 70 ? 'bg-success-500' : health >= 50 ? 'bg-warning-500' : 'bg-danger-500'
              }`}
              style={{ width: `${health}%` }}
            />
          </div>
        </div>
      )}

      {/* S/Q/U/D Metrics Grid - Stack on mobile, grid on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {Object.entries(squd).map(([key, value]) => (
          <div
            key={key}
            className={`p-4 rounded-lg ${getColorClass(value, key === 'D')}`}
          >
            <div className="text-sm font-medium mb-1">{key}</div>
            <div className="text-2xl font-bold">{value.toFixed(3)}</div>
            <div className="text-xs mt-1 opacity-75">
              {getSQUDLabelForDomain(key as 'S' | 'Q' | 'U' | 'D')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

