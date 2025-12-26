/**
 * Portfolio Risk Management Dashboard - Comprehensive Version
 * Complete analysis suite with tabs for portfolio overview, holdings analysis,
 * risk analysis, recommendations, market scanning, and Ask CHADD
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection, DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { PortfolioTabs } from '@/components/portfolio/PortfolioTabs';
import { RiskAnalysis } from '@/components/portfolio/RiskAnalysis';
import { MarketScanner } from '@/components/portfolio/MarketScanner';
import { AskCHADD } from '@/components/portfolio/AskCHADD';
import { SectorPortfolioView } from '@/components/portfolio/SectorPortfolioView';
import { PortfolioCharts } from '@/components/portfolio/PortfolioCharts';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { portfolioApi } from '@/lib/api/portfolio';
import { aiApi } from '@/lib/api/ai';
import type {
  Holding,
  TopRecommendationsResponse,
  TopRecommendation,
  HoldingAnalysis,
} from '@/types/portfolio';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

type Timeframe = '1y' | '3y' | '5y' | '10y';

export default function PortfolioRiskDashboard() {
  return <PortfolioRiskDashboardContent />;
}

function PortfolioRiskDashboardContent() {
  const domain = 'portfolio-risk';
  const config = getConfigForDomain(domain);
  
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>('1y');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<TopRecommendationsResponse | null>(null);
  const [selectedHolding, setSelectedHolding] = useState<HoldingAnalysis | null>(null);
  const [aiInterpretations, setAIInterpretations] = useState<Record<string, string>>({});
  const [chadd2Config, setChadd2Config] = useState<CHADD2OverlayConfig>({
    enabled: false,
    modelType: 'auto',
    fibonacciOverlay: false,
    lambdaFib: 0.0,
    wPhi: 0.0,
  });
  const [analysisStatus, setAnalysisStatus] = useState<string>('');

  // Load holdings on mount
  useEffect(() => {
    console.log('[PortfolioRisk] Component mounted, loading holdings...');
    loadHoldings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check API connectivity on mount
  useEffect(() => {
    const checkApi = async () => {
      try {
        const testUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        console.log('[PortfolioRisk] Checking API connectivity:', testUrl);
        const response = await fetch(`${testUrl}/api/v1/portfolio/health`);
        if (response.ok) {
          console.log('[PortfolioRisk] API is accessible');
        } else {
          console.warn('[PortfolioRisk] API health check returned:', response.status);
        }
      } catch (err) {
        console.error('[PortfolioRisk] API connectivity check failed:', err);
        setError('Unable to connect to analysis service. Please ensure the backend is running.');
      }
    };
    checkApi();
  }, []);

  const loadHoldings = async () => {
    try {
      const data = await portfolioApi.getBerkshireHoldings();
      setHoldings(data);
    } catch (err) {
      console.error('Error loading holdings:', err);
      setError('Failed to load holdings');
    }
  };

  const handleAnalyze = async () => {
    console.log('[PortfolioRisk] Starting analysis...', { timeframe, chadd2Config });
    setLoading(true);
    setError(null);
    setRecommendations(null);
    setSelectedHolding(null);
    setAIInterpretations({});
    setAnalysisStatus('Initializing comprehensive portfolio analysis...');

    try {
      setAnalysisStatus('Running CHADD resilience analysis with risk engine integration...');
      
      const request = {
        timeframe,
        analysis_type: 'both',
        chadd2_config: chadd2Config.enabled ? {
          enabled: chadd2Config.enabled,
          model_type: chadd2Config.modelType,
          fibonacci_overlay: chadd2Config.fibonacciOverlay,
          lambda_fib: chadd2Config.lambdaFib,
          w_phi: chadd2Config.wPhi,
        } : undefined,
      };
      
      console.log('[PortfolioRisk] Sending request:', request);
      const result = await portfolioApi.getTopRecommendations(request);
      console.log('[PortfolioRisk] Received result:', result);

      setRecommendations(result);
      setAnalysisStatus('Analysis complete! Generating AI interpretations...');

      // Get AI interpretations
      if (result.recommendations.long_term) {
        for (const rec of result.recommendations.long_term) {
          try {
            const aiResult = await aiApi.interpretPortfolioHolding({
              ticker: rec.ticker,
              company_name: rec.company_name,
              squd: rec.squd as unknown as Record<string, number>,
              resilience_score: rec.resilience_score,
              metrics: rec.metrics as unknown as Record<string, number>,
              timeframe,
              analysis_type: 'long-term',
            });
            setAIInterpretations((prev) => ({
              ...prev,
              [`long-${rec.ticker}`]: aiResult.text,
            }));
          } catch (err) {
            console.error(`Error getting AI interpretation for ${rec.ticker}:`, err);
          }
        }
      }

      if (result.recommendations.short_term) {
        for (const rec of result.recommendations.short_term) {
          try {
            const aiResult = await aiApi.interpretPortfolioHolding({
              ticker: rec.ticker,
              company_name: rec.company_name,
              squd: rec.squd as unknown as Record<string, number>,
              resilience_score: rec.resilience_score,
              metrics: rec.metrics as unknown as Record<string, number>,
              timeframe,
              analysis_type: 'short-term',
            });
            setAIInterpretations((prev) => ({
              ...prev,
              [`short-${rec.ticker}`]: aiResult.text,
            }));
          } catch (err) {
            console.error(`Error getting AI interpretation for ${rec.ticker}:`, err);
          }
        }
      }
      setAnalysisStatus('Analysis complete!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setAnalysisStatus('Analysis failed');
    } finally {
      setLoading(false);
      setTimeout(() => setAnalysisStatus(''), 3000);
    }
  };

  const handleAnalyzeHolding = async (ticker: string) => {
    console.log('[PortfolioRisk] Analyzing holding:', ticker);
    setLoading(true);
    setError(null);
    setSelectedHolding(null);

    try {
      const request = {
        ticker,
        timeframe,
        chadd2_config: chadd2Config.enabled ? {
          enabled: chadd2Config.enabled,
          model_type: chadd2Config.modelType,
          fibonacci_overlay: chadd2Config.fibonacciOverlay,
          lambda_fib: chadd2Config.lambdaFib,
          w_phi: chadd2Config.wPhi,
        } : undefined,
      };
      
      console.log('[PortfolioRisk] Sending analyze holding request:', request);
      const analysis = await portfolioApi.analyzeHolding(request);
      console.log('[PortfolioRisk] Received analysis:', analysis);
      
      setSelectedHolding(analysis);
    } catch (err) {
      console.error('[PortfolioRisk] Error analyzing holding:', err);
      setError(err instanceof Error ? err.message : 'Holding analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      id: 'analyze',
      label: loading ? 'Analyzing...' : 'Analyze Portfolio',
      icon: '📊',
      onClick: handleAnalyze,
      variant: 'primary' as const,
      disabled: loading,
    },
  ];

  const sections = {
    header: true,
    metrics: false,
    telemetry: false,
    charts: false,
    aiInterpretation: false,
    maintenance: false,
    export: false,
  };

  // Helper function to create tab content - avoids SWC parser issues
  const createOverviewContent = () => (
    <div className="space-y-6">
      <DashboardSection title="Portfolio Configuration" icon="⚙️">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="timeframe-select" className="text-sm font-medium text-gray-700">
              Analysis Timeframe:
            </label>
            <select
              id="timeframe-select"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            >
              <option value="1y">1 Year</option>
              <option value="3y">3 Years</option>
              <option value="5y">5 Years</option>
              <option value="10y">10 Years</option>
            </select>
          </div>
        </div>
      </DashboardSection>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading && analysisStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-800 font-medium">{analysisStatus}</p>
          </div>
        </div>
      )}

      {recommendations && (
        <>
          <DashboardSection title="Portfolio Analysis Summary" icon="📈">
            <DashboardGrid cols={4} gap="md">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Timeframe</div>
                <div className="text-lg font-semibold text-gray-900">{recommendations.timeframe}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Holdings Analyzed</div>
                <div className="text-lg font-semibold text-gray-900">
                  {recommendations.total_holdings_analyzed}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Long-Term Opportunities</div>
                <div className="text-lg font-semibold text-gray-900">
                  {recommendations.recommendations?.long_term?.length || 0}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Short-Term Opportunities</div>
                <div className="text-lg font-semibold text-gray-900">
                  {recommendations.recommendations?.short_term?.length || 0}
                </div>
              </div>
            </DashboardGrid>
          </DashboardSection>

          {/* Interactive Charts */}
          <PortfolioCharts
            holdings={holdings}
            recommendations={recommendations.recommendations}
            selectedHolding={selectedHolding}
          />
        </>
      )}

      {holdings.length > 0 && (
        <DashboardSection title="Current Holdings" icon="💼">
          <DashboardGrid cols={4} gap="md">
            {holdings.map((holding) => (
              <button
                key={holding.ticker}
                onClick={() => handleAnalyzeHolding(holding.ticker)}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
                disabled={loading}
              >
                <div className="font-semibold text-gray-900">{holding.ticker}</div>
                <div className="text-sm text-gray-600 truncate">{holding.company_name}</div>
                {holding.weight && (
                  <div className="text-xs text-gray-500 mt-1">
                    {(holding.weight * 100).toFixed(1)}%
                  </div>
                )}
              </button>
            ))}
          </DashboardGrid>
        </DashboardSection>
      )}
    </div>
  );

  // Prepare tab content using useMemo to avoid SWC parser issues
  const tabs = useMemo(() => [
    {
      id: 'sectors',
      label: 'Sector Holdings',
      icon: '📈',
      content: (
        <div className="space-y-6">
          <DashboardSection title="Portfolio by Sector" icon="📊">
            <p className="text-sm text-gray-600 mb-4">
              Holdings organized by sector with current prices, investment signals, and CHADD problem flags.
              Click "Analyze" on any holding to generate buy/sell/hold signals based on CHADD resilience analysis.
            </p>
          </DashboardSection>
          <SectorPortfolioView
            holdings={holdings}
            onHoldingClick={handleAnalyzeHolding}
            domain={domain}
          />
        </div>
      ),
    },
    {
      id: 'overview',
      label: 'Portfolio Overview',
      icon: '📊',
      content: createOverviewContent(),
    },
    {
      id: 'holdings',
      label: 'Holdings Analysis',
      icon: '🔍',
      content: selectedHolding ? (
        <div className="space-y-6">
          {/* Investment Signal */}
          {selectedHolding.investment_signal && (
            <DashboardSection title="Investment Signal" icon="🎯">
              <div className={`p-4 rounded-lg ${getSignalColorClass(selectedHolding.investment_signal.signal)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {getSignalLabel(selectedHolding.investment_signal.signal)}
                  </h3>
                  <div className="text-white text-sm">
                    Strength: {(selectedHolding.investment_signal.strength * 100).toFixed(0)}%
                  </div>
                </div>
                <p className="text-white text-sm mb-2">{selectedHolding.investment_signal.rationale}</p>
              </div>
            </DashboardSection>
          )}

          <DashboardSection
            title={`${selectedHolding.company_name} (${selectedHolding.ticker})`}
            icon="📊"
          >
            <MetricsCard
              squd={selectedHolding.squd}
              health={selectedHolding.resilience_score * 100}
              title="CHADD Resilience Metrics"
              domain={domain}
            />
          </DashboardSection>

          {selectedHolding.time_series_data && selectedHolding.time_series_data.length > 0 ? (
            <DashboardSection title="CHADD Metrics Over Time" icon="📈">
              <TimeSeriesChart
                data={selectedHolding.time_series_data.map((d) => ({
                  timestamp: d.timestamp,
                  S: d.S,
                  Q: d.Q,
                  U: d.U,
                  D: d.D,
                }))}
                lines={[
                  { key: 'S', name: 'Stability', color: '#3b82f6' },
                  { key: 'Q', name: 'Coherence', color: '#10b981' },
                  { key: 'U', name: 'Susceptibility', color: '#f59e0b' },
                  { key: 'D', name: 'Diagnostic', color: '#ef4444' },
                ]}
                title="CHADD Metrics Over Time"
              />
            </DashboardSection>
          ) : (
            <DashboardSection title="CHADD Metrics Over Time" icon="📈">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">No time series data available for this holding.</p>
                <p className="text-sm text-gray-400 mt-2">Time series data will appear after analysis completes.</p>
              </div>
            </DashboardSection>
          )}

          <DashboardSection title="Financial Metrics" icon="💰">
            <DashboardGrid cols={4} gap="md">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">Avg Return</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(selectedHolding.metrics.avg_return * 100).toFixed(2)}%
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">Volatility</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(selectedHolding.metrics.volatility * 100).toFixed(2)}%
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">Sharpe Ratio</div>
                <div className="text-2xl font-bold text-gray-900">
                  {selectedHolding.metrics.sharpe_ratio.toFixed(2)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">Max Drawdown</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(selectedHolding.metrics.max_drawdown * 100).toFixed(1)}%
                </div>
              </div>
            </DashboardGrid>
          </DashboardSection>
        </div>
      ) : (
        <DashboardSection title="Holdings Analysis" icon="🔍">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Select a holding from the Portfolio Overview tab to analyze
            </p>
          </div>
        </DashboardSection>
      ),
    },
    {
      id: 'risk',
      label: 'Risk Analysis',
      icon: '⚠️',
      content: (
        <RiskAnalysis
          portfolioRisk={recommendations?.portfolio_risk as any}
          holdingRisk={selectedHolding?.risk_metrics as any}
        />
      ),
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: '🎯',
      content: recommendations ? (
        <div className="space-y-6">
          {recommendations.recommendations?.long_term && recommendations.recommendations.long_term.length > 0 && (
            <DashboardSection title="Long-Term Value Opportunities" icon="🏆">
              <div className="space-y-6">
                {recommendations.recommendations.long_term.map((rec) => (
                  <RecommendationCard
                    key={`long-${rec.ticker}`}
                    recommendation={rec}
                    aiInterpretation={aiInterpretations[`long-${rec.ticker}`]}
                    type="long-term"
                  />
                ))}
              </div>
            </DashboardSection>
          )}

          {recommendations.recommendations?.short_term && recommendations.recommendations.short_term.length > 0 && (
            <DashboardSection title="Short-Term Opportunities" icon="⚡">
              <div className="space-y-6">
                {recommendations.recommendations.short_term.map((rec) => (
                  <RecommendationCard
                    key={`short-${rec.ticker}`}
                    recommendation={rec}
                    aiInterpretation={aiInterpretations[`short-${rec.ticker}`]}
                    type="short-term"
                  />
                ))}
              </div>
            </DashboardSection>
          )}
        </div>
      ) : (
        <DashboardSection title="Recommendations" icon="🎯">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Run portfolio analysis to see recommendations
            </p>
          </div>
        </DashboardSection>
      ),
    },
    {
      id: 'market',
      label: 'Market Scanner',
      icon: '🔍',
      content: <MarketScanner chadd2Config={chadd2Config} />,
    },
    {
      id: 'chadd',
      label: 'Ask CHADD',
      icon: '💬',
      content: <AskCHADD />,
    },
  ], [holdings, timeframe, loading, error, recommendations, selectedHolding, aiInterpretations, chadd2Config, analysisStatus, domain, handleAnalyzeHolding]);

  return (
    <DashboardTemplate
      config={config}
      sections={sections}
      actions={actions}
      chadd2Overlay={chadd2Config}
      onCHADD2ConfigChange={setChadd2Config}
      requireAuth={false}
    >
      <PortfolioTabs tabs={tabs} defaultTab="sectors" />
    </DashboardTemplate>
  );
}

interface RecommendationCardProps {
  recommendation: TopRecommendation;
  aiInterpretation?: string;
  type: 'long-term' | 'short-term';
}

function RecommendationCard({ recommendation, aiInterpretation, type }: RecommendationCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {recommendation.company_name} ({recommendation.ticker})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {type === 'long-term' ? 'Long-Term Value Opportunity' : 'Short-Term Opportunity'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Resilience Score</div>
          <div className="text-2xl font-bold text-primary-600">
            {(recommendation.resilience_score * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <MetricsCard
        squd={recommendation.squd}
        health={recommendation.resilience_score * 100}
        title="CHADD Metrics"
        domain="portfolio-risk"
      />

      {aiInterpretation && (
        <div className="mt-4">
          <AIInterpretationCard text={aiInterpretation} />
        </div>
      )}
    </div>
  );
}

function getSignalLabel(signal: string): string {
  const labels: Record<string, string> = {
    buy: 'BUY',
    sell: 'SELL',
    hold: 'HOLD',
    strong_buy: 'STRONG BUY',
    strong_sell: 'STRONG SELL',
  };
  return labels[signal] || signal.toUpperCase();
}

function getSignalColorClass(signal: string): string {
  const colors: Record<string, string> = {
    buy: 'bg-green-600',
    sell: 'bg-red-600',
    hold: 'bg-yellow-600',
    strong_buy: 'bg-green-700',
    strong_sell: 'bg-red-700',
  };
  return colors[signal] || 'bg-gray-600';
}

