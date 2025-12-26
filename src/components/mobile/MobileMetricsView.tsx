/**
 * Mobile Metrics View Component
 * Simplified metrics display optimized for mobile screens
 */

'use client';

import React from 'react';
import { SQUDScore } from '@/types/api';
import { getSQUDLabel, getDomainTerminology } from '@/lib/dashboard/skills';

interface MobileMetricsViewProps {
  squd: SQUDScore;
  health?: number;
  domain?: string;
  className?: string;
}

export function MobileMetricsView({
  squd,
  health,
  domain,
  className = '',
}: MobileMetricsViewProps) {
  const terminology = domain ? getDomainTerminology(domain) : null;

  const getSQUDLabelForDomain = (key: 'S' | 'Q' | 'U' | 'D'): string => {
    if (domain && terminology) {
      return getSQUDLabel(domain, key);
    }
    switch (key) {
      case 'S': return 'Stability';
      case 'Q': return 'Coherence';
      case 'U': return 'Susceptibility';
      case 'D': return 'Diagnostic';
    }
  };

  const getColorClass = (value: number, key: string, isD: boolean = false) => {
    if (isD) {
      if (value >= 0.7) return 'bg-red-50 text-red-700 border-red-200';
      if (value >= 0.5) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      return 'bg-green-50 text-green-700 border-green-200';
    } else {
      const effectiveValue = key === 'S' ? value : 1 - value;
      if (effectiveValue >= 0.7) return 'bg-green-50 text-green-700 border-green-200';
      if (effectiveValue >= 0.5) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      {/* Health Score */}
      {health !== undefined && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Overall Health</span>
            <span className={`text-2xl font-bold ${
              health >= 70 ? 'text-green-600' : health >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {health.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                health >= 70 ? 'bg-green-500' : health >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${health}%` }}
            />
          </div>
        </div>
      )}

      {/* S/Q/U/D Metrics - Stacked for mobile */}
      <div className="space-y-2">
        {Object.entries(squd).map(([key, value]) => {
          const isD = key === 'D';
          return (
            <div
              key={key}
              className={`p-3 rounded-lg border ${getColorClass(value, key, isD)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium opacity-75 mb-0.5">
                    {getSQUDLabelForDomain(key as 'S' | 'Q' | 'U' | 'D')}
                  </div>
                  <div className="text-lg font-bold">{key}</div>
                </div>
                <div className="text-xl font-bold">{value.toFixed(3)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

