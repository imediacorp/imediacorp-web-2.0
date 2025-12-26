/**
 * Portfolio Charts Component
 * Interactive charts for portfolio analysis based on best practices from Portfolio Visualizer, Koyfin, etc.
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Holding, HoldingAnalysis, TopRecommendation } from '@/types/portfolio';

interface PortfolioChartsProps {
  holdings?: Holding[];
  recommendations?: {
    long_term?: TopRecommendation[];
    short_term?: TopRecommendation[];
  };
  selectedHolding?: HoldingAnalysis | null;
}

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  gray: '#6b7280',
};

export function PortfolioCharts({ holdings, recommendations, selectedHolding }: PortfolioChartsProps) {
  return (
    <div className="space-y-6">
      {/* Portfolio Allocation Chart */}
      {holdings && holdings.length > 0 && (
        <AllocationChart holdings={holdings} />
      )}

      {/* Recommendations Comparison */}
      {recommendations && (recommendations.long_term?.length || recommendations.short_term?.length) && (
        <RecommendationsChart recommendations={recommendations} />
      )}

      {/* Holding Time Series */}
      {selectedHolding && selectedHolding.time_series_data && selectedHolding.time_series_data.length > 0 && (
        <HoldingTimeSeriesChart holding={selectedHolding} />
      )}

      {/* Risk Metrics Chart */}
      {selectedHolding && selectedHolding.risk_metrics && (
        <RiskMetricsChart riskMetrics={selectedHolding.risk_metrics} />
      )}
    </div>
  );
}

function AllocationChart({ holdings }: { holdings: Holding[] }) {
  const data = holdings
    .filter((h) => h.weight && h.weight > 0)
    .map((h) => ({
      name: h.ticker,
      value: (h.weight || 0) * 100,
      company: h.company_name,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 holdings

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation (Top Holdings)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorForIndex(index)} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toFixed(2)}%`}
            labelFormatter={(label, payload) => {
              const item = payload?.[0];
              return item ? `${item.payload.company} (${label})` : label;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function RecommendationsChart({
  recommendations,
}: {
  recommendations: {
    long_term?: TopRecommendation[];
    short_term?: TopRecommendation[];
  };
}) {
  const longTermData =
    recommendations.long_term?.slice(0, 5).map((r) => ({
      ticker: r.ticker,
      resilience: (r.resilience_score * 100).toFixed(1),
      value: r.resilience_score * 100,
    })) || [];

  const shortTermData =
    recommendations.short_term?.slice(0, 5).map((r) => ({
      ticker: r.ticker,
      resilience: (r.resilience_score * 100).toFixed(1),
      value: r.resilience_score * 100,
    })) || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Recommendations by Resilience Score</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {longTermData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Long-Term Opportunities</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={longTermData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ticker" />
                <YAxis label={{ value: 'Resilience Score (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Bar dataKey="value" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {shortTermData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Short-Term Opportunities</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={shortTermData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ticker" />
                <YAxis label={{ value: 'Resilience Score (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Bar dataKey="value" fill={COLORS.success} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function HoldingTimeSeriesChart({ holding }: { holding: HoldingAnalysis }) {
  const data = holding.time_series_data.map((d) => ({
    timestamp: new Date(d.timestamp).toLocaleDateString(),
    S: d.S * 100,
    Q: d.Q * 100,
    U: d.U * 100,
    D: d.D * 100,
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">CHADD Metrics Over Time</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          <Legend />
          <Line type="monotone" dataKey="S" stroke={COLORS.primary} name="Stability" strokeWidth={2} />
          <Line type="monotone" dataKey="Q" stroke={COLORS.success} name="Coherence" strokeWidth={2} />
          <Line type="monotone" dataKey="U" stroke={COLORS.warning} name="Susceptibility" strokeWidth={2} />
          <Line type="monotone" dataKey="D" stroke={COLORS.danger} name="Diagnostic" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function RiskMetricsChart({ riskMetrics }: { riskMetrics: any }) {
  const data = [
    {
      name: 'VaR (95%)',
      value: riskMetrics.var_95 ? riskMetrics.var_95 * 100 : 0,
    },
    {
      name: 'CVaR (95%)',
      value: riskMetrics.cvar_95 ? riskMetrics.cvar_95 * 100 : 0,
    },
    {
      name: 'Volatility',
      value: riskMetrics.volatility ? riskMetrics.volatility * 100 : 0,
    },
    {
      name: 'Max Drawdown',
      value: riskMetrics.max_drawdown ? Math.abs(riskMetrics.max_drawdown * 100) : 0,
    },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: 'Risk (%)', position: 'insideBottom', offset: -5 }} />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
          <Bar dataKey="value" fill={COLORS.danger} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function getColorForIndex(index: number): string {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
    '#6366f1', // indigo
  ];
  return colors[index % colors.length];
}

