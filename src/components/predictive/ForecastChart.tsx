/**
 * Forecast Chart Component
 * Visualization of forecasts with confidence intervals
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
  Area,
  AreaChart,
} from 'recharts';
import type { ForecastPoint } from '@/types/predictive';

interface ForecastChartProps {
  points: ForecastPoint[];
  historicalData?: Array<{ timestamp: string; value: number }>;
  height?: number;
}

export function ForecastChart({
  points,
  historicalData = [],
  height = 400,
}: ForecastChartProps) {
  // Combine historical and forecast data
  const chartData = React.useMemo(() => {
    const historical = historicalData.map((point) => ({
      timestamp: new Date(point.timestamp).toISOString(),
      value: point.value,
      forecast: null,
      lower: null,
      upper: null,
      isHistorical: true,
    }));

    const forecast = points.map((point) => ({
      timestamp: new Date(point.timestamp).toISOString(),
      value: null,
      forecast: point.value,
      lower: point.lower,
      upper: point.upper,
      isHistorical: false,
    }));

    return [...historical, ...forecast].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );
  }, [points, historicalData]);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value: number | null) => (value !== null ? value.toFixed(3) : 'N/A')}
          />
          <Legend />
          
          {/* Historical data */}
          {historicalData.length > 0 && (
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Historical"
            />
          )}

          {/* Forecast with confidence interval */}
          <defs>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="url(#forecastGradient)"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            name="Forecast"
          />
          <Line
            type="monotone"
            dataKey="lower"
            stroke="#10b981"
            strokeWidth={1}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            dot={false}
            name="Lower Bound"
          />
          <Line
            type="monotone"
            dataKey="upper"
            stroke="#10b981"
            strokeWidth={1}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            dot={false}
            name="Upper Bound"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

