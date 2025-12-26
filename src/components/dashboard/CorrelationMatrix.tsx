/**
 * Correlation Matrix Component
 * Visualization of correlations between domains
 */

'use client';

import React from 'react';
import type { CorrelationEntry } from '@/types/comparison';

interface CorrelationMatrixProps {
  correlations: CorrelationEntry[];
  domains: string[];
  metric: 'S' | 'Q' | 'U' | 'D';
}

export function CorrelationMatrix({
  correlations,
  domains,
  metric,
}: CorrelationMatrixProps) {
  // Filter correlations for the selected metric
  const metricCorrelations = correlations.filter((c) => c.metric === metric);

  // Build matrix
  const matrix = React.useMemo(() => {
    const matrixMap = new Map<string, Map<string, number>>();

    domains.forEach((domain1) => {
      const row = new Map<string, number>();
      domains.forEach((domain2) => {
        if (domain1 === domain2) {
          row.set(domain2, 1.0);
        } else {
          const correlation = metricCorrelations.find(
            (c) =>
              (c.domain1 === domain1 && c.domain2 === domain2) ||
              (c.domain1 === domain2 && c.domain2 === domain1)
          );
          row.set(domain2, correlation?.correlation ?? 0);
        }
      });
      matrixMap.set(domain1, row);
    });

    return matrixMap;
  }, [domains, metricCorrelations]);

  const getColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-500';
    if (value >= 0.4) return 'bg-yellow-500';
    if (value >= -0.4) return 'bg-gray-300';
    if (value >= -0.7) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {metric} Correlation
              </th>
              {domains.map((domain) => (
                <th
                  key={domain}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {domain}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {domains.map((domain1) => (
              <tr key={domain1}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {domain1}
                </td>
                {domains.map((domain2) => {
                  const value = matrix.get(domain1)?.get(domain2) ?? 0;
                  return (
                    <td key={domain2} className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-16 h-8 rounded ${getColor(value)} flex items-center justify-center text-white text-xs font-medium`}
                          title={`Correlation: ${value.toFixed(3)}`}
                        >
                          {value.toFixed(2)}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <p>Color scale: Green (strong positive) → Yellow (moderate) → Gray (weak) → Orange (moderate negative) → Red (strong negative)</p>
      </div>
    </div>
  );
}

