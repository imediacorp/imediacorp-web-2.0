/**
 * Seasonal Decomposition Chart Component
 * Visualizes trend, seasonal, and residual components from time series decomposition
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

interface SeasonalDecompositionChartProps {
  decomposition: {
    success: boolean;
    method: string;
    period?: number;
    trend: number[];
    seasonal: number[];
    residual: number[];
    original: number[];
    trend_strength?: number;
    seasonal_strength?: number;
  };
  height?: number;
}

export function SeasonalDecompositionChart({
  decomposition,
  height = 400,
}: SeasonalDecompositionChartProps) {
  if (!decomposition.success) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Seasonal decomposition not available</p>
        {(decomposition as any).error && <p className="text-sm mt-2">{(decomposition as any).error}</p>}
      </div>
    );
  }

  // Prepare chart data
  const chartData = React.useMemo(() => {
    const { original, trend, seasonal, residual } = decomposition;
    const n = Math.min(original.length, trend.length, seasonal.length, residual.length);
    
    return Array.from({ length: n }, (_, i) => ({
      index: i,
      original: original[i],
      trend: trend[i],
      seasonal: seasonal[i],
      residual: residual[i],
    }));
  }, [decomposition]);

  return (
    <div className="space-y-4">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {decomposition.trend_strength !== undefined && (
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">Trend Strength</div>
            <div className="text-2xl font-semibold">
              {(decomposition.trend_strength * 100).toFixed(1)}%
            </div>
          </div>
        )}
        {decomposition.seasonal_strength !== undefined && (
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">Seasonal Strength</div>
            <div className="text-2xl font-semibold">
              {(decomposition.seasonal_strength * 100).toFixed(1)}%
            </div>
          </div>
        )}
        {decomposition.period && (
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">Seasonal Period</div>
            <div className="text-2xl font-semibold">{decomposition.period}</div>
          </div>
        )}
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Method</div>
          <div className="text-2xl font-semibold uppercase">{decomposition.method}</div>
        </div>
      </div>

      {/* Original vs Trend */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Original vs Trend</h3>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="original"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Original"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="#10b981"
              strokeWidth={2}
              name="Trend"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Seasonal Component */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Seasonal Component</h3>
        <ResponsiveContainer width="100%" height={height * 0.6}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="seasonal"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Seasonal"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Residual Component */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Residual Component</h3>
        <ResponsiveContainer width="100%" height={height * 0.6}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="residual"
              stroke="#ef4444"
              strokeWidth={2}
              name="Residual"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

