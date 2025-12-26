/**
 * Multi-Panel Chart Component
 * Matches Streamlit's subplot layout with multiple panels stacked vertically
 */

'use client';

import React, { useState, useEffect } from 'react';
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
import { TimeSeriesLine } from './TimeSeriesChart';

export interface PanelConfig {
  title: string;
  lines: TimeSeriesLine[];
  yAxisLabel?: string;
  threshold?: number;
  thresholdLabel?: string;
  faultMarkers?: Array<{
    timestamp: string;
    value: number;
    label?: string;
  }>;
  height?: number;
  showLegend?: boolean;
}

interface MultiPanelChartProps {
  data: Array<Record<string, unknown>>;
  panels: PanelConfig[];
  sharedXAxis?: boolean;
  overallTitle?: string;
}

export function MultiPanelChart({
  data,
  panels,
  sharedXAxis = true,
  overallTitle,
}: MultiPanelChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    panels.forEach((panel, panelIdx) => {
      panel.lines.forEach((line) => {
        formatted[line.name] = item[line.key];
      });
      // Add fault markers as separate data points
      if (panel.faultMarkers && panel.faultMarkers.length > 0) {
        const faultMarker = panel.faultMarkers.find(
          (m) => m.timestamp === item.timestamp
        );
        formatted[`fault_${panelIdx}`] = faultMarker ? faultMarker.value : null;
      }
    });
    return formatted;
  });

  return (
    <div className="w-full space-y-4">
      {overallTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{overallTitle}</h3>
      )}
      {panels.map((panel, panelIndex) => (
        <div key={panelIndex} className="w-full">
          <h4 className="text-sm md:text-md font-semibold text-gray-700 mb-2">{panel.title}</h4>
          <ResponsiveContainer width="100%" height={isMobile ? (panel.height || 200) : (panel.height || 250)}>
            <LineChart
              data={chartData}
              margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              {panelIndex === panels.length - 1 && sharedXAxis ? (
                <XAxis
                  dataKey="timestamp"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
                />
              ) : (
                <XAxis
                  dataKey="timestamp"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tick={false}
                />
              )}
              <YAxis
                stroke="#6b7280"
                label={
                  panel.yAxisLabel
                    ? { value: panel.yAxisLabel, angle: -90, position: 'insideLeft' }
                    : undefined
                }
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
              {panel.showLegend !== false && !isMobile && <Legend />}
              {panel.lines.map((line) => (
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
              {panel.threshold !== undefined && (
                <ReferenceLine
                  y={panel.threshold}
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  label={panel.thresholdLabel || `Threshold: ${panel.threshold}`}
                />
              )}
              {panel.faultMarkers && panel.faultMarkers.length > 0 && (
                <Line
                  type="monotone"
                  dataKey={`fault_${panelIndex}`}
                  stroke="none"
                  dot={{ fill: '#ef4444', r: 6 }}
                  activeDot={false}
                  legendType="none"
                  connectNulls={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

