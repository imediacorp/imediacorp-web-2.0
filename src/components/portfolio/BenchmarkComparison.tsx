/**
 * Benchmark Comparison Component
 * Displays portfolio performance comparison against selected benchmark index
 */

'use client';

import React, { useMemo } from 'react';
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
import { DashboardSection, DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import type { BenchmarkComparison } from '@/types/portfolio';

interface BenchmarkComparisonProps {
  comparison: BenchmarkComparison;
  domain?: string;
}

export function BenchmarkComparison({ comparison, domain = 'portfolio-risk' }: BenchmarkComparisonProps) {
  const performanceData = useMemo(() => {
    // Prepare data for performance comparison chart
    const portfolioTS = comparison.portfolio_analysis;
    const indexTS = comparison.index_analysis.time_series_data || [];
    
    if (!indexTS.length) return [];
    
    // Calculate cumulative returns for both portfolio and index
    const data: Array<{
      date: string;
      portfolio: number;
      index: number;
    }> = [];
    
    let portfolioCumulative = 1.0;
    let indexCumulative = 1.0;
    
    // We'll use a simplified approach - map index returns to portfolio timeline
    // In a real implementation, we'd align the time series properly
    for (let i = 0; i < indexTS.length; i++) {
      const point = indexTS[i];
      const date = point.timestamp.split('T')[0]; // Extract date part
      
      // For portfolio, we'd need to calculate cumulative returns from aggregated holdings
      // For now, use a simplified approach with portfolio total return distributed over time
      portfolioCumulative *= (1 + (comparison.portfolio_analysis.total_return / indexTS.length));
      indexCumulative *= (1 + point.returns);
      
      data.push({
        date,
        portfolio: (portfolioCumulative - 1) * 100, // Convert to percentage
        index: (indexCumulative - 1) * 100,
      });
    }
    
    return data;
  }, [comparison]);

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatNumber = (value: number, decimals: number = 2) => value.toFixed(decimals);

  return (
    <div className="space-y-6">
      {/* Index Information */}
      <DashboardSection title={`Benchmark: ${comparison.index_info.name}`} icon="📊">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-900">{comparison.index_info.name}</h4>
              <p className="text-sm text-gray-600">{comparison.index_info.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                ETF Ticker: {comparison.index_info.ticker} • Category: {comparison.index_info.category}
              </p>
            </div>
            <div className="text-xs text-gray-500 bg-white px-3 py-2 rounded border border-blue-200">
              Note: Index represented via ETF proxy. ETF tracking error and expense ratios may affect comparison.
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* Performance Comparison Chart */}
      {performanceData.length > 0 && (
        <DashboardSection title="Performance Comparison" icon="📈">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Cumulative Return (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="portfolio" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Portfolio"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="index" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name={comparison.index_info.name}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardSection>
      )}

      {/* Performance Metrics Comparison */}
      <DashboardSection title="Performance Metrics Comparison" icon="📊">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portfolio
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {comparison.index_info.name}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Return
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatPercent(comparison.portfolio_analysis.total_return)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatPercent(comparison.index_analysis.metrics.avg_return * 252 || 0)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                  comparison.comparison_metrics.excess_return >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercent(comparison.comparison_metrics.excess_return)}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Volatility (Annualized)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatPercent(comparison.portfolio_analysis.volatility)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatPercent(comparison.index_analysis.metrics.volatility || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                  {formatPercent(Math.abs(comparison.portfolio_analysis.volatility - (comparison.index_analysis.metrics.volatility || 0)))}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Sharpe Ratio
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatNumber(comparison.portfolio_analysis.sharpe_ratio)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatNumber(comparison.index_analysis.metrics.sharpe_ratio || 0)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                  comparison.portfolio_analysis.sharpe_ratio >= (comparison.index_analysis.metrics.sharpe_ratio || 0) 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatNumber(comparison.portfolio_analysis.sharpe_ratio - (comparison.index_analysis.metrics.sharpe_ratio || 0))}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Max Drawdown
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatPercent(comparison.portfolio_analysis.max_drawdown)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatPercent(comparison.index_analysis.metrics.max_drawdown || 0)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                  comparison.portfolio_analysis.max_drawdown <= (comparison.index_analysis.metrics.max_drawdown || 0)
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {formatPercent(Math.abs(comparison.portfolio_analysis.max_drawdown - (comparison.index_analysis.metrics.max_drawdown || 0)))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Comparison Metrics (Alpha, Beta, Tracking Error, etc.) */}
      <DashboardSection title="Comparison Metrics" icon="🎯">
        <DashboardGrid cols={2} smCols={2} mdCols={3} gap="md">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Alpha</div>
            <div className={`text-2xl font-bold ${
              comparison.comparison_metrics.alpha >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercent(comparison.comparison_metrics.alpha)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Risk-adjusted excess return
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Beta</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(comparison.comparison_metrics.beta)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Sensitivity to benchmark (1.0 = moves in sync)
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Correlation</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(comparison.comparison_metrics.correlation)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              How closely portfolios move together
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Tracking Error</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPercent(comparison.comparison_metrics.tracking_error)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Volatility of excess returns
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Information Ratio</div>
            <div className={`text-2xl font-bold ${
              comparison.comparison_metrics.information_ratio >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatNumber(comparison.comparison_metrics.information_ratio)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Alpha per unit of tracking error
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Excess Return</div>
            <div className={`text-2xl font-bold ${
              comparison.comparison_metrics.excess_return >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercent(comparison.comparison_metrics.excess_return)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Portfolio return minus benchmark return
            </div>
          </div>
        </DashboardGrid>
      </DashboardSection>

      {/* CHADD Metrics Comparison */}
      <DashboardSection title="CHADD Metrics Comparison" icon="🔬">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Portfolio CHADD Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h4>
            <MetricsCard
              squd={comparison.portfolio_analysis.squd}
              health={comparison.portfolio_analysis.resilience_score * 100}
              title="CHADD Resilience Metrics"
              domain={domain}
            />
          </div>

          {/* Index CHADD Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{comparison.index_info.name}</h4>
            <MetricsCard
              squd={comparison.index_analysis.squd}
              health={comparison.index_analysis.resilience_score * 100}
              title="CHADD Resilience Metrics"
              domain={domain}
            />
          </div>
        </div>
      </DashboardSection>
    </div>
  );
}

