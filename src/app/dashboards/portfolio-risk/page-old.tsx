/**
 * Portfolio Risk Management Dashboard
 * Dashboard for analyzing Berkshire Hathaway portfolio holdings
 * using CHADD framework for resilience and investment value assessment.
 * Uses Web 2.0 Dashboard Template
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection, DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
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
  
  // Debug: Log timeframe changes
  useEffect(() => {
    console.log('Timeframe state updated to:', timeframe);
  }, [timeframe]);
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

  // Debug: Log CHADD2 config changes
  useEffect(() => {
    console.log('[Portfolio] CHADD2 config updated:', chadd2Config);
  }, [chadd2Config]);

  // Load holdings on mount
  useEffect(() => {
    loadHoldings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const [analysisStatus, setAnalysisStatus] = useState<string>('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setRecommendations(null);
    setSelectedHolding(null);
    setAIInterpretations({});
    setAnalysisStatus('Initializing analysis...');

    console.log('[Portfolio] Starting analysis with config:', {
      timeframe,
      chadd2Config: chadd2Config,
    });

    try {
      setAnalysisStatus(chadd2Config.enabled 
        ? `Running CHADD2 analysis (${chadd2Config.modelType} model)...` 
        : 'Running standard CHADD analysis...');
      
      const result = await portfolioApi.getTopRecommendations({
        timeframe,
        analysis_type: 'both',
        chadd2_config: chadd2Config.enabled ? {
          enabled: chadd2Config.enabled,
          model_type: chadd2Config.modelType,
          fibonacci_overlay: chadd2Config.fibonacciOverlay,
          lambda_fib: chadd2Config.lambdaFib,
          w_phi: chadd2Config.wPhi,
        } : undefined,
      });

      console.log('[Portfolio] Analysis result received:', result);
      console.log('[Portfolio] Recommendations structure:', {
        hasRecommendations: !!result.recommendations,
        longTerm: result.recommendations?.long_term?.length || 0,
        shortTerm: result.recommendations?.short_term?.length || 0,
        totalAnalyzed: result.total_holdings_analyzed,
        fullStructure: result,
      });
      
      // Check if we got results
      if (result.total_holdings_analyzed === 0) {
        console.warn('[Portfolio] WARNING: No holdings were analyzed. This may indicate:');
        console.warn('  1. Backend service errors');
        console.warn('  2. Data source unavailable');
        console.warn('  3. Analysis failures');
        setError('Analysis completed but no holdings were successfully analyzed. Check backend logs for details.');
      } else if (
        (!result.recommendations?.long_term || result.recommendations.long_term.length === 0) &&
        (!result.recommendations?.short_term || result.recommendations.short_term.length === 0)
      ) {
        console.warn('[Portfolio] WARNING: Holdings were analyzed but no recommendations generated.');
        setError(`Analysis completed for ${result.total_holdings_analyzed} holdings, but no recommendations were generated.`);
      }
      
      setRecommendations(result);
      setAnalysisStatus('Analysis complete! Generating AI interpretations...');

      // Get AI interpretations for top recommendations
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
      // Clear status after a delay
      setTimeout(() => setAnalysisStatus(''), 3000);
    }
  };

  const handleAnalyzeHolding = async (ticker: string) => {
    setLoading(true);
    setError(null);
    setSelectedHolding(null);

    console.log('[Portfolio] Analyzing holding:', ticker, 'with CHADD2 config:', chadd2Config);

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
      
      console.log('[Portfolio] Sending analyze holding request:', request);
      
      const analysis = await portfolioApi.analyzeHolding(request);
      
      console.log('[Portfolio] Analysis received:', analysis);
      
      if (!analysis) {
        throw new Error('No analysis data received');
      }
      
      setSelectedHolding(analysis);
    } catch (err) {
      console.error('[Portfolio] Error analyzing holding:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'object' && err !== null && 'message' in err
        ? String(err.message)
        : 'Holding analysis failed';
      setError(errorMessage);
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
    metrics: true,
    telemetry: false,
    charts: true,
    aiInterpretation: true,
    maintenance: false,
    export: false,
  };

  return (
    <DashboardTemplate
      config={config}
      sections={sections}
      actions={actions}
      chadd2Overlay={chadd2Config}
      onCHADD2ConfigChange={setChadd2Config}
      requireAuth={false}
    >
      {/* Timeframe Selector */}
      <DashboardSection title="Analysis Configuration" icon="⚙️">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="timeframe-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Timeframe:
            </label>
            <select
              id="timeframe-select"
              value={timeframe}
              onChange={(e) => {
                const selectedValue = e.target.value as Timeframe;
                console.log('[Portfolio] Timeframe select onChange - selected:', selectedValue, 'current state:', timeframe);
                if (selectedValue !== timeframe) {
                  setTimeframe(selectedValue);
                  console.log('[Portfolio] Timeframe state set to:', selectedValue);
                }
              }}
              onMouseDown={(e) => {
                console.log('[Portfolio] Timeframe select onMouseDown');
                e.stopPropagation();
              }}
              onClick={(e) => {
                console.log('[Portfolio] Timeframe select onClick');
                e.stopPropagation();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 cursor-pointer min-w-[140px]"
              disabled={loading}
              aria-label="Select analysis timeframe"
            >
              <option value="1y">1 Year</option>
              <option value="3y">3 Years</option>
              <option value="5y">5 Years</option>
              <option value="10y">10 Years</option>
            </select>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Current selection: </span>
            <span className="font-semibold text-primary-600">{timeframe}</span>
          </div>
        </div>
      </DashboardSection>

      {/* Analysis Status */}
      {loading && analysisStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-800 font-medium">{analysisStatus}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {!loading && analysisStatus && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">{analysisStatus}</p>
        </div>
      )}

      {/* Holdings List */}
      {holdings.length > 0 && (
        <DashboardSection title="Berkshire Hathaway Holdings" icon="📈">
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

      {/* Selected Holding Analysis */}
      {selectedHolding && (
        <>
          <DashboardSection
            title={`${selectedHolding.company_name} (${selectedHolding.ticker})`}
            icon="📊"
          >
            <MetricsCard
              squd={selectedHolding.squd}
              health={selectedHolding.resilience_score * 100}
              title="CHADD Metrics"
              domain={domain}
            />
          </DashboardSection>

          {selectedHolding.time_series_data.length > 0 && (
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
          )}

          {/* Additional Metrics */}
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
        </>
      )}

      {/* Analysis Summary */}
      {recommendations && (
        <>
          <DashboardSection title="Analysis Summary" icon="📊">
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
                <div className="text-sm text-gray-500 mb-1">Long-Term Recommendations</div>
                <div className="text-lg font-semibold text-gray-900">
                  {recommendations.recommendations?.long_term?.length || 0}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Short-Term Recommendations</div>
                <div className="text-lg font-semibold text-gray-900">
                  {recommendations.recommendations?.short_term?.length || 0}
                </div>
              </div>
            </DashboardGrid>
          </DashboardSection>

          {/* Recommendations Comparison - SQUD Metrics Chart */}
          {((recommendations.recommendations?.long_term?.length ?? 0) > 0 || 
            (recommendations.recommendations?.short_term?.length ?? 0) > 0) && (
            <DashboardSection title="Top Recommendations - SQUD Metrics Comparison" icon="📈">
              <TimeSeriesChart
                data={[
                  ...(recommendations.recommendations?.long_term || []).flatMap((rec, idx) => [
                    { timestamp: `${rec.ticker}-LT-S`, S: rec.squd.S, Q: 0, U: 0, D: 0 },
                    { timestamp: `${rec.ticker}-LT-Q`, S: 0, Q: rec.squd.Q, U: 0, D: 0 },
                    { timestamp: `${rec.ticker}-LT-U`, S: 0, Q: 0, U: rec.squd.U, D: 0 },
                    { timestamp: `${rec.ticker}-LT-D`, S: 0, Q: 0, U: 0, D: rec.squd.D },
                  ]),
                  ...(recommendations.recommendations?.short_term || []).flatMap((rec, idx) => [
                    { timestamp: `${rec.ticker}-ST-S`, S: rec.squd.S, Q: 0, U: 0, D: 0 },
                    { timestamp: `${rec.ticker}-ST-Q`, S: 0, Q: rec.squd.Q, U: 0, D: 0 },
                    { timestamp: `${rec.ticker}-ST-U`, S: 0, Q: 0, U: rec.squd.U, D: 0 },
                    { timestamp: `${rec.ticker}-ST-D`, S: 0, Q: 0, U: 0, D: rec.squd.D },
                  ]),
                ]}
                lines={[
                  { key: 'S', name: 'Stability', color: '#3b82f6' },
                  { key: 'Q', name: 'Coherence', color: '#10b981' },
                  { key: 'U', name: 'Susceptibility', color: '#f59e0b' },
                  { key: 'D', name: 'Diagnostic', color: '#ef4444' },
                ]}
                title="SQUD Metrics Across Top Recommendations"
              />
            </DashboardSection>
          )}
        </>
      )}

      {/* Top Recommendations */}
      {recommendations && (
        <>
          {/* Long-Term Value */}
          {recommendations.recommendations?.long_term && recommendations.recommendations.long_term.length > 0 && (
            <DashboardSection title="Top 3 Long-Term Value Holdings" icon="🏆">
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

          {/* Short-Term Opportunities */}
          {recommendations.recommendations?.short_term && recommendations.recommendations.short_term.length > 0 && (
            <DashboardSection title="Top 3 Short-Term Opportunities" icon="⚡">
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

          {/* Debug: Show raw data if no recommendations */}
          {(!recommendations.recommendations?.long_term || recommendations.recommendations.long_term.length === 0) &&
           (!recommendations.recommendations?.short_term || recommendations.recommendations.short_term.length === 0) && (
            <DashboardSection title="Debug: Analysis Results" icon="🔍">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 mb-2">
                  Analysis completed but no recommendations found. Raw data:
                </p>
                <pre className="text-xs overflow-auto bg-white p-3 rounded border">
                  {JSON.stringify(recommendations, null, 2)}
                </pre>
              </div>
            </DashboardSection>
          )}
        </>
      )}

      {/* Empty State */}
      {!recommendations && !selectedHolding && !loading && (
        <DashboardSection title="Get Started" icon="🚀">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Select a timeframe and click "Analyze Portfolio" to begin analysis
            </p>
            <p className="text-gray-400 text-sm">
              Or click on any holding above to analyze it individually
            </p>
          </div>
        </DashboardSection>
      )}
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
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-primary-600">#{recommendation.rank}</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {recommendation.company_name} ({recommendation.ticker})
              </h3>
              <p className="text-sm text-gray-500 capitalize">{type} Investment</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Resilience Score</div>
          <div className="text-2xl font-bold text-primary-600">
            {(recommendation.resilience_score * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <DashboardGrid cols={4} gap="sm" className="mb-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-xs text-gray-500 mb-1">Stability (S)</div>
          <div className="text-lg font-semibold">{recommendation.squd.S.toFixed(3)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-xs text-gray-500 mb-1">Coherence (Q)</div>
          <div className="text-lg font-semibold">{recommendation.squd.Q.toFixed(3)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-xs text-gray-500 mb-1">Susceptibility (U)</div>
          <div className="text-lg font-semibold">{recommendation.squd.U.toFixed(3)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-xs text-gray-500 mb-1">Diagnostic (D)</div>
          <div className="text-lg font-semibold">{recommendation.squd.D.toFixed(3)}</div>
        </div>
      </DashboardGrid>

      <DashboardGrid cols={4} gap="sm" className="mb-4 text-sm">
        <div>
          <span className="text-gray-500">Avg Return: </span>
          <span className="font-semibold">
            {(recommendation.metrics.avg_return * 100).toFixed(2)}%
          </span>
        </div>
        <div>
          <span className="text-gray-500">Volatility: </span>
          <span className="font-semibold">
            {(recommendation.metrics.volatility * 100).toFixed(2)}%
          </span>
        </div>
        <div>
          <span className="text-gray-500">Sharpe Ratio: </span>
          <span className="font-semibold">{recommendation.metrics.sharpe_ratio.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-gray-500">Max Drawdown: </span>
          <span className="font-semibold">
            {(recommendation.metrics.max_drawdown * 100).toFixed(1)}%
          </span>
        </div>
      </DashboardGrid>

      {aiInterpretation && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="mb-2 text-sm font-semibold text-gray-900">AI Expert Analysis</div>
          <AIInterpretationCard interpretation={aiInterpretation} />
        </div>
      )}

      {recommendation.rationale && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-700">{recommendation.rationale}</div>
        </div>
      )}
    </div>
  );
}

