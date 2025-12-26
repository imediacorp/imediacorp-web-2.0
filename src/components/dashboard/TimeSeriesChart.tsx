/**
 * Time Series Chart Component
 * Displays time-series data with support for multiple lines and thresholds
 * Responsive design with mobile optimization
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
  ReferenceLine,
} from 'recharts';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { MobileChartView } from '@/components/mobile/MobileChartView';

export interface TimeSeriesLine {
  key: string;
  name: string;
  color: string;
}

interface TimeSeriesChartProps {
  data: Array<Record<string, unknown>>;
  lines: TimeSeriesLine[];
  title: string;
  yAxisLabel?: string;
  threshold?: number;
  thresholdLabel?: string;
  height?: number;
}

export function TimeSeriesChart({
  data,
  lines,
  title,
  yAxisLabel,
  threshold,
  thresholdLabel,
  height = 300,
}: TimeSeriesChartProps) {
  const { isMobile } = useMobileDetection();
  const chartHeight = isMobile ? Math.max(250, height * 0.8) : height;

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return timestamp;
    }
  };

  // Prepare data for Recharts
  const chartData = data.map((item) => {
    const formatted: Record<string, unknown> = {
      timestamp: formatTimestamp(item.timestamp as string),
      fullTimestamp: item.timestamp,
    };
    lines.forEach((line) => {
      formatted[line.name] = item[line.key];
    });
    return formatted;
  });

  const chartContent = (
    <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="timestamp"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
            }}
            labelFormatter={(value) => {
              const item = chartData.find((d) => d.timestamp === value);
              return item?.fullTimestamp
                ? new Date(item.fullTimestamp as string).toLocaleString()
                : value;
            }}
          />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
          {threshold !== undefined && (
            <ReferenceLine
              y={threshold}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              label={thresholdLabel || `Threshold: ${threshold}`}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
  );

  // Wrap in mobile chart view on mobile devices
  if (isMobile) {
    return (
      <MobileChartView title={title}>
        {chartContent}
      </MobileChartView>
    );
  }

  return (
    <div className="w-full">
      <h4 className="text-md font-semibold text-gray-700 mb-2">{title}</h4>
      {chartContent}
    </div>
  );
}

