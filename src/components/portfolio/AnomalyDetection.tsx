/**
 * Anomaly Detection Component
 * Visualizes detected anomalies with scores and severity levels
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
  Scatter,
  ScatterChart,
} from 'recharts';

interface AnomalyDetectionProps {
  anomalies: {
    success: boolean;
    method: string;
    anomaly_flags: number[];
    anomaly_scores: number[];
    anomalies: Array<{
      index: number;
      timestamp: string;
      value: number;
      anomaly_score: number;
      severity: string;
    }>;
    n_anomalies: number;
    n_total: number;
  };
  timeSeriesData?: Array<{ timestamp: string; value: number }>;
  height?: number;
}

export function AnomalyDetection({
  anomalies,
  timeSeriesData = [],
  height = 400,
}: AnomalyDetectionProps) {
  if (!anomalies.success) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Anomaly detection not available</p>
        {(anomalies as any).error && <p className="text-sm mt-2">{(anomalies as any).error}</p>}
      </div>
    );
  }

  // Prepare chart data with anomaly markers
  const chartData = React.useMemo(() => {
    if (timeSeriesData.length === 0) {
      // Use indices if no timestamp data
      return anomalies.anomaly_flags.map((flag, index) => ({
        index,
        value: 0,
        anomaly_flag: flag,
        anomaly_score: anomalies.anomaly_scores[index],
        isAnomaly: flag === 1,
      }));
    }

    return timeSeriesData.map((point, index) => ({
      timestamp: point.timestamp,
      index,
      value: point.value,
      anomaly_flag: anomalies.anomaly_flags[index] || 0,
      anomaly_score: anomalies.anomaly_scores[index] || 0,
      isAnomaly: (anomalies.anomaly_flags[index] || 0) === 1,
    }));
  }, [anomalies, timeSeriesData]);

  // Extract anomaly points for scatter plot
  const anomalyPoints = React.useMemo(() => {
    return anomalies.anomalies.map((anomaly) => ({
      x: anomaly.index,
      y: anomaly.value,
      score: anomaly.anomaly_score,
      severity: anomaly.severity,
    }));
  }, [anomalies.anomalies]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#eab308';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary statistics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Total Anomalies</div>
          <div className="text-2xl font-semibold">{anomalies.n_anomalies}</div>
          <div className="text-xs text-gray-500">
            of {anomalies.n_total} points
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Anomaly Rate</div>
          <div className="text-2xl font-semibold">
            {((anomalies.n_anomalies / anomalies.n_total) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Detection Method</div>
          <div className="text-lg font-semibold capitalize">
            {anomalies.method.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Time series with anomaly markers */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Time Series with Anomalies</h3>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-semibold">Index: {data.index}</p>
                      <p>Value: {data.value?.toFixed(4)}</p>
                      {data.isAnomaly && (
                        <>
                          <p className="text-red-600 font-semibold">Anomaly Detected</p>
                          <p>Score: {(data.anomaly_score * 100).toFixed(2)}%</p>
                        </>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Value"
              dot={false}
            />
            {/* Highlight anomalies */}
            {chartData.map((point, index) =>
              point.isAnomaly ? (
                <Line
                  key={`anomaly-${index}`}
                  type="monotone"
                  dataKey="value"
                  data={[point]}
                  stroke="#ef4444"
                  strokeWidth={4}
                  dot={{ fill: '#ef4444', r: 6 }}
                  name="Anomaly"
                  legendType="none"
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly score distribution */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Anomaly Scores</h3>
        <ResponsiveContainer width="100%" height={height * 0.6}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="anomaly_score"
              stroke="#ef4444"
              strokeWidth={2}
              name="Anomaly Score"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly details table */}
      {anomalies.anomalies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Detected Anomalies</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Index
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Value
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Score
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {anomalies.anomalies.slice(0, 20).map((anomaly, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {anomaly.index}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {new Date(anomaly.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {typeof anomaly.value === 'number'
                        ? anomaly.value.toFixed(4)
                        : String(anomaly.value)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      {(anomaly.anomaly_score * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          anomaly.severity === 'high'
                            ? 'bg-red-100 text-red-800'
                            : anomaly.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {anomaly.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

