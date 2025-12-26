/**
 * Sector Portfolio View Component
 * Displays portfolio holdings grouped by sector with current prices,
 * buy/sell/hold signals, and problem flags
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSection, DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { portfolioApi } from '@/lib/api/portfolio';
import type { Holding, HoldingAnalysis, InvestmentSignal, ProblemFlag, OpportunityFlag } from '@/types/portfolio';

interface SectorPortfolioViewProps {
  holdings: Holding[];
  onHoldingClick?: (ticker: string) => void;
  domain?: string;
}

interface SectorGroup {
  sector: string;
  holdings: (Holding & { analysis?: HoldingAnalysis })[];
  totalWeight: number;
  totalValue?: number;
}

export function SectorPortfolioView({ holdings, onHoldingClick, domain = 'portfolio-risk' }: SectorPortfolioViewProps) {
  const [analyses, setAnalyses] = useState<Record<string, HoldingAnalysis>>({});
  const [loadingTickers, setLoadingTickers] = useState<Set<string>>(new Set());

  // Group holdings by sector
  const sectorGroups: SectorGroup[] = React.useMemo(() => {
    const groups: Record<string, SectorGroup> = {};
    
    holdings.forEach((holding) => {
      const sector = holding.sector || 'Unclassified';
      if (!groups[sector]) {
        groups[sector] = {
          sector,
          holdings: [],
          totalWeight: 0,
          totalValue: 0,
        };
      }
      groups[sector].holdings.push({
        ...holding,
        analysis: analyses[holding.ticker],
      });
      groups[sector].totalWeight += holding.weight || 0;
      if (holding.current_price) {
        groups[sector].totalValue = (groups[sector].totalValue || 0) + (holding.current_price * (holding.weight || 0));
      }
    });
    
    return Object.values(groups).sort((a, b) => (b.totalWeight || 0) - (a.totalWeight || 0));
  }, [holdings, analyses]);

  const handleAnalyzeHolding = async (ticker: string) => {
    if (loadingTickers.has(ticker) || analyses[ticker]) return;
    
    setLoadingTickers((prev) => new Set(prev).add(ticker));
    try {
      const analysis = await portfolioApi.analyzeHolding({
        ticker,
        timeframe: '1y',
      });
      setAnalyses((prev) => ({ ...prev, [ticker]: analysis }));
    } catch (error) {
      console.error(`Error analyzing ${ticker}:`, error);
    } finally {
      setLoadingTickers((prev) => {
        const next = new Set(prev);
        next.delete(ticker);
        return next;
      });
    }
  };

  return (
    <div className="space-y-8">
      {sectorGroups.map((group) => (
        <SectorGroup
          key={group.sector}
          group={group}
          onHoldingClick={onHoldingClick}
          onAnalyzeClick={handleAnalyzeHolding}
          loadingTickers={loadingTickers}
          domain={domain}
        />
      ))}
    </div>
  );
}

interface SectorGroupProps {
  group: SectorGroup;
  onHoldingClick?: (ticker: string) => void;
  onAnalyzeClick?: (ticker: string) => void;
  loadingTickers: Set<string>;
  domain: string;
}

function SectorGroup({ group, onHoldingClick, onAnalyzeClick, loadingTickers, domain }: SectorGroupProps) {
  return (
    <DashboardSection
      title={
        <div className="flex items-center justify-between w-full pr-4">
          <span>
            {group.sector} ({(group.totalWeight * 100).toFixed(1)}% of portfolio)
          </span>
          {group.totalValue && group.totalValue > 0 && (
            <span className="text-sm font-normal text-gray-600">
              Est. Value: ${(group.totalValue / 1000).toFixed(0)}K
            </span>
          )}
        </div>
      }
      icon="📊"
    >
      <DashboardGrid cols={1} gap="md">
        {group.holdings.map((holding) => (
          <HoldingCard
            key={holding.ticker}
            holding={holding}
            analysis={holding.analysis}
            onClick={() => onHoldingClick?.(holding.ticker)}
            onAnalyze={() => onAnalyzeClick?.(holding.ticker)}
            isLoading={loadingTickers.has(holding.ticker)}
            domain={domain}
          />
        ))}
      </DashboardGrid>
    </DashboardSection>
  );
}

interface HoldingCardProps {
  holding: Holding;
  analysis?: HoldingAnalysis;
  onClick?: () => void;
  onAnalyze?: () => void;
  isLoading: boolean;
  domain: string;
}

function HoldingCard({ holding, analysis, onClick, onAnalyze, isLoading, domain }: HoldingCardProps) {
  const signal = analysis?.investment_signal;
  const problems = signal?.problems || [];
  const criticalProblems = problems.filter((p) => p.severity === 'critical');
  const warningProblems = problems.filter((p) => p.severity === 'warning');

  const getSignalColor = (signalType?: string) => {
    switch (signalType) {
      case 'STRONG_BUY':
        return 'bg-green-600 text-white';
      case 'BUY':
        return 'bg-green-500 text-white';
      case 'HOLD':
        return 'bg-yellow-500 text-white';
      case 'SELL':
        return 'bg-red-500 text-white';
      case 'STRONG_SELL':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getSignalLabel = (signalType?: string) => {
    switch (signalType) {
      case 'STRONG_BUY':
        return 'Strong Buy';
      case 'BUY':
        return 'Buy';
      case 'HOLD':
        return 'Hold';
      case 'SELL':
        return 'Sell';
      case 'STRONG_SELL':
        return 'Strong Sell';
      default:
        return 'Not Analyzed';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{holding.ticker}</h3>
            {holding.current_price && (
              <span className="text-lg font-medium text-gray-700">
                ${holding.current_price.toFixed(2)}
              </span>
            )}
            {holding.weight && (
              <span className="text-sm text-gray-500">
                ({(holding.weight * 100).toFixed(1)}%)
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{holding.company_name}</p>
          {holding.sector && (
            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {holding.sector}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          {signal && (
            <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${getSignalColor(signal.signal)}`}>
              {getSignalLabel(signal.signal)}
            </div>
          )}
          {!analysis && (
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          )}
          {analysis && (
            <button
              onClick={onClick}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              View Details
            </button>
          )}
        </div>
      </div>

      {/* CHADD Metrics */}
      {analysis && (
        <div className="mt-4">
          <MetricsCard
            squd={analysis.squd}
            health={analysis.resilience_score * 100}
            title="CHADD Resilience Metrics"
            domain={domain}
          />
        </div>
      )}

      {/* Emerging Opportunities */}
      {analysis?.investment_signal?.opportunities && analysis.investment_signal.opportunities.length > 0 && (
        <div className="mt-4 space-y-2">
          {analysis.investment_signal.opportunities
            .filter((o) => o.severity === 'high')
            .length > 0 && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
              <div className="flex items-center mb-2">
                <span className="text-green-700 font-semibold text-sm">
                  🚀 High-Priority Opportunities (
                  {analysis.investment_signal.opportunities.filter((o) => o.severity === 'high').length})
                </span>
              </div>
              {analysis.investment_signal.opportunities
                .filter((o) => o.severity === 'high')
                .map((opportunity, idx) => (
                  <OpportunityFlagCard key={idx} opportunity={opportunity} />
                ))}
            </div>
          )}
          {analysis.investment_signal.opportunities
            .filter((o) => o.severity === 'medium')
            .length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <div className="flex items-center mb-2">
                <span className="text-blue-700 font-semibold text-sm">
                  📈 Emerging Opportunities (
                  {analysis.investment_signal.opportunities.filter((o) => o.severity === 'medium').length})
                </span>
              </div>
              {analysis.investment_signal.opportunities
                .filter((o) => o.severity === 'medium')
                .map((opportunity, idx) => (
                  <OpportunityFlagCard key={idx} opportunity={opportunity} />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Problem Flags */}
      {problems.length > 0 && (
        <div className="mt-4 space-y-2">
          {criticalProblems.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <div className="flex items-center mb-2">
                <span className="text-red-600 font-semibold text-sm">
                  ⚠️ Critical Issues ({criticalProblems.length})
                </span>
              </div>
              {criticalProblems.map((problem, idx) => (
                <ProblemFlagCard key={idx} problem={problem} />
              ))}
            </div>
          )}
          {warningProblems.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
              <div className="flex items-center mb-2">
                <span className="text-yellow-700 font-semibold text-sm">
                  ⚠️ Warnings ({warningProblems.length})
                </span>
              </div>
              {warningProblems.map((problem, idx) => (
                <ProblemFlagCard key={idx} problem={problem} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Signal Rationale */}
      {signal && signal.rationale && (
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-sm font-medium text-gray-900 mb-1">Signal Rationale</div>
          <p className="text-sm text-gray-700">{signal.rationale}</p>
          {signal.strength && (
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Signal Strength: {(signal.strength * 100).toFixed(0)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getSignalColor(signal.signal)}`}
                  style={{ width: `${signal.strength * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Financial Metrics Summary */}
      {analysis && (
        <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Return: </span>
            <span className="font-semibold">
              {(analysis.metrics.avg_return * 100).toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="text-gray-500">Volatility: </span>
            <span className="font-semibold">
              {(analysis.metrics.volatility * 100).toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="text-gray-500">Sharpe: </span>
            <span className="font-semibold">{analysis.metrics.sharpe_ratio.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500">Resilience: </span>
            <span className="font-semibold">
              {(analysis.resilience_score * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProblemFlagCardProps {
  problem: ProblemFlag;
}

function ProblemFlagCard({ problem }: ProblemFlagCardProps) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="text-sm font-medium text-gray-900 mb-1">
        {problem.category.charAt(0).toUpperCase() + problem.category.slice(1)} Issue
      </div>
      <p className="text-sm text-gray-700 mb-1">{problem.message}</p>
      <p className="text-xs text-gray-600 italic">Recommendation: {problem.recommendation}</p>
    </div>
  );
}

interface OpportunityFlagCardProps {
  opportunity: OpportunityFlag;
}

function OpportunityFlagCard({ opportunity }: OpportunityFlagCardProps) {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      stability_momentum: 'Stability Momentum',
      coherence_momentum: 'Coherence Momentum',
      risk_reduction: 'Risk Reduction',
      health_improvement: 'Health Improvement',
      undervalued_quality: 'Undervalued Quality',
      recovery_play: 'Recovery Play',
      multi_metric_momentum: 'Multi-Metric Momentum',
    };
    return labels[category] || category;
  };

  return (
    <div className="mb-2 last:mb-0">
      <div className="text-sm font-medium text-gray-900 mb-1">
        {getCategoryLabel(opportunity.category)}
      </div>
      <p className="text-sm text-gray-700 mb-1">{opportunity.message}</p>
      <p className="text-xs text-gray-600 italic">Action: {opportunity.recommendation}</p>
    </div>
  );
}

