/**
 * Trend Chart Component
 * Advanced trend visualization with regression lines
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
import type { TimeSeriesPoint, RegressionLine } from '@/types/trends';

interface TrendChartProps {
  data: TimeSeriesPoint[];
  metric: string;
  regressionLine?: RegressionLine;
  showMovingAverage?: boolean;
  movingAverageData?: number[];
  height?: number;
}

export function TrendChart({
  data,
  metric,
  regressionLine,
  showMovingAverage = false,
  movingAverageData,
  height = 400,
}: TrendChartProps) {
  // Transform data for Recharts
  const chartData = React.useMemo(() => {
    return data.map((point, index) => ({
      timestamp: new Date(point.timestamp).toISOString(),
      value: point[metric] as number,
      movingAverage: movingAverageData?.[index],
      regression: regressionLine
        ? regressionLine.slope * index + regressionLine.intercept
        : undefined,
    }));
  }, [data, metric, regressionLine, movingAverageData]);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis label={{ value: metric, angle: -90, position: 'insideLeft' }} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value: number) => value.toFixed(3)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            name={metric}
          />
          {showMovingAverage && movingAverageData && (
            <Line
              type="monotone"
              dataKey="movingAverage"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Moving Average"
            />
          )}
          {regressionLine && (
            <Line
              type="linear"
              dataKey="regression"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="3 3"
              name="Trend Line"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

