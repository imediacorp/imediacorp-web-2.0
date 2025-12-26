/**
 * Risk Analysis Component
 * Displays market risk and credit risk metrics for portfolio and holdings
 */

'use client';

import React from 'react';
import { DashboardSection, DashboardGrid } from '@/components/dashboard/template/DashboardSection';

interface RiskMetrics {
  VaR?: number;
  CVaR?: number;
  max_drawdown?: number;
  avg_volatility?: number;
  PD?: number;
  EL?: number;
  PD_VaR?: number;
}

interface RiskAnalysisProps {
  holdingRisk?: RiskMetrics;
  portfolioRisk?: RiskMetrics;
  title?: string;
}

export function RiskAnalysis({ holdingRisk, portfolioRisk, title = 'Risk Analysis' }: RiskAnalysisProps) {
  return (
    <div className="space-y-6">
      {portfolioRisk && (
        <DashboardSection title="Portfolio Risk Metrics" icon="📊">
          <DashboardGrid cols={4} gap="md">
            {portfolioRisk.VaR !== undefined && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Value at Risk (95%)</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(portfolioRisk.VaR * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Maximum expected loss at 95% confidence
                </div>
              </div>
            )}
            {portfolioRisk.CVaR !== undefined && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Conditional VaR (95%)</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(portfolioRisk.CVaR * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Expected loss beyond VaR threshold
                </div>
              </div>
            )}
            {portfolioRisk.avg_volatility !== undefined && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Average Volatility</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(portfolioRisk.avg_volatility * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  EWMA volatility estimate
                </div>
              </div>
            )}
            {portfolioRisk.max_drawdown !== undefined && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Maximum Drawdown</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(Math.abs(portfolioRisk.max_drawdown) * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Largest peak-to-trough decline
                </div>
              </div>
            )}
          </DashboardGrid>
        </DashboardSection>
      )}

      {holdingRisk && (
        <DashboardSection title="Holding Risk Metrics" icon="📈">
          <DashboardGrid cols={4} gap="md">
            {holdingRisk.VaR !== undefined && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Value at Risk (95%)</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(holdingRisk.VaR * 100).toFixed(2)}%
                </div>
              </div>
            )}
            {holdingRisk.CVaR !== undefined && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Conditional VaR (95%)</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(holdingRisk.CVaR * 100).toFixed(2)}%
                </div>
              </div>
            )}
            {holdingRisk.avg_volatility !== undefined && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Average Volatility</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(holdingRisk.avg_volatility * 100).toFixed(2)}%
                </div>
              </div>
            )}
            {holdingRisk.max_drawdown !== undefined && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Maximum Drawdown</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(Math.abs(holdingRisk.max_drawdown) * 100).toFixed(2)}%
                </div>
              </div>
            )}
          </DashboardGrid>
        </DashboardSection>
      )}

      {!portfolioRisk && !holdingRisk && (
        <DashboardSection title={title} icon="📊">
          <div className="text-center py-8 text-gray-500">
            <p>Risk metrics will be displayed here after analysis is complete.</p>
          </div>
        </DashboardSection>
      )}
    </div>
  );
}

