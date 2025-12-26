/**
 * Comparison Chart Component
 * Unified chart for displaying multiple domains side-by-side
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DomainComparisonData } from '@/types/comparison';

interface ComparisonChartProps {
  data: DomainComparisonData[];
  metric: 'S' | 'Q' | 'U' | 'D' | 'health';
  timeRange?: { start: string; end: string };
  showLegend?: boolean;
  height?: number;
}

export function ComparisonChart({
  data,
  metric,
  timeRange,
  showLegend = true,
  height = 400,
}: ComparisonChartProps) {
  // Transform data for Recharts
  const chartData = React.useMemo(() => {
    // Group snapshots by timestamp
    const timeMap = new Map<string, Record<string, number>>();

    data.forEach((domainData) => {
      domainData.snapshots.forEach((snapshot) => {
        const timestamp = new Date(snapshot.timestamp).toISOString();
        if (!timeMap.has(timestamp)) {
          timeMap.set(timestamp, { timestamp });
        }
        const point = timeMap.get(timestamp)!;
        const value = metric === 'health' ? snapshot.health : snapshot.squd[metric];
        point[domainData.domain] = value ?? 0;
      });
    });

    return Array.from(timeMap.values()).sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );
  }, [data, metric]);

  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis
            label={{ value: metric.toUpperCase(), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value: number) => value.toFixed(3)}
          />
          {showLegend && <Legend />}
          {data.map((domainData, index) => (
            <Line
              key={domainData.domain}
              type="monotone"
              dataKey={domainData.domain}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              name={domainData.domain}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

