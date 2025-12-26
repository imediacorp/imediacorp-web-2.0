/**
 * Portfolio Risk Management Dashboard - SaaS Version
 * Complete analysis suite with tabs for portfolio overview, holdings analysis,
 * risk analysis, recommendations, market scanning, and Ask CHADD
 * Aligned with other SaaS dashboards in the platform
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection, DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { PortfolioTabs } from '@/components/portfolio/PortfolioTabs';
import { RiskAnalysis } from '@/components/portfolio/RiskAnalysis';
import { MarketScanner } from '@/components/portfolio/MarketScanner';
import { AskCHADD } from '@/components/portfolio/AskCHADD';
import { AskCHADDFloating } from '@/components/portfolio/AskCHADDFloating';
import { PortfolioActions } from '@/components/portfolio/PortfolioActions';
import { InvestmentPhilosophySelector } from '@/components/portfolio/InvestmentPhilosophySelector';
import { InvestmentPhilosophyForm } from '@/components/portfolio/InvestmentPhilosophyForm';
import { investmentPhilosophyApi } from '@/lib/api/investment-philosophy';
import type { InvestmentPhilosophy, InvestmentPhilosophyFormData } from '@/types/investment-philosophy';
import { BrokerIntegration } from '@/components/portfolio/BrokerIntegration';
import { SectorPortfolioView } from '@/components/portfolio/SectorPortfolioView';
import { PortfolioCharts } from '@/components/portfolio/PortfolioCharts';
import { PortfolioBuilder } from '@/components/portfolio/PortfolioBuilder';
import { BenchmarkComparison as BenchmarkComparisonComponent } from '@/components/portfolio/BenchmarkComparison';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { portfolioApi } from '@/lib/api/portfolio';
import { aiApi } from '@/lib/api/ai';
import type {
  Holding,
  TopRecommendationsResponse,
  TopRecommendation,
  HoldingAnalysis,
  IndexInfo,
  BenchmarkComparison,
} from '@/types/portfolio';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

type Timeframe = '1y' | '3y' | '5y' | '10y';

/**
 * Check if an error is a network connection error (backend unavailable)
 */
function isConnectionError(error: any): boolean {
  if (!error) return false;
  
  // Check for common connection error patterns
  const message = error?.message || error?.detail || String(error);
  const errorString = message.toLowerCase();
  
  return (
    errorString.includes('connection refused') ||
    errorString.includes('network error') ||
    errorString.includes('failed to fetch') ||
    errorString.includes('err_connection_refused') ||
    errorString.includes('err_network') ||
    (error?.code === 'ECONNREFUSED') ||
    (error?.code === 'ENOTFOUND')
  );
}

/**
 * Log error with appropriate level based on error type
 * Connection errors are logged at debug level since backend may not be running
 */
function logError(context: string, error: any, userMessage?: string) {
  if (isConnectionError(error)) {
    // Backend unavailable - log at debug level to reduce console noise
    console.debug(`[${context}] Backend unavailable (expected if backend is not running):`, error);
  } else {
    // Actual error - log at error level
    console.error(`[${context}] Error:`, error);
    if (userMessage) {
      console.error(`[${context}] User message:`, userMessage);
    }
  }
}

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
  const [chaddAdvice, setChaddAdvice] = useState<string>(''); // Latest CHADD advice for action recommendations
  const [chadd2Config, setChadd2Config] = useState<CHADD2OverlayConfig>({
    enabled: false,
    modelType: 'auto',
    fibonacciOverlay: false,
    lambdaFib: 0.0,
    wPhi: 0.0,
  });
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [showPortfolioBuilder, setShowPortfolioBuilder] = useState(false);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [currentPortfolio, setCurrentPortfolio] = useState<any | null>(null);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<InvestmentPhilosophy | null>(null);
  const [availableIndices, setAvailableIndices] = useState<IndexInfo[]>([]);
  const [selectedBenchmarkIndex, setSelectedBenchmarkIndex] = useState<string | null>(null);
  const [benchmarkComparison, setBenchmarkComparison] = useState<BenchmarkComparison | null>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(false);

  // Load available indices
  const loadAvailableIndices = useCallback(async () => {
    try {
      const indices = await portfolioApi.listIndices();
      setAvailableIndices(indices);
    } catch (err) {
      logError('PortfolioRisk', err);
      // Don't set error - indices are optional
    }
  }, []);

  const loadHoldings = useCallback(async () => {
    try {
      const data = await portfolioApi.getBerkshireHoldings();
      setHoldings(data);
      setCurrentPortfolio(null); // Clear current portfolio when using Berkshire
    } catch (err) {
      logError('PortfolioRisk', err);
      // Only set user-facing error if it's not a connection error
      if (!isConnectionError(err)) {
        setError('Failed to load holdings');
      }
    }
  }, []);

  const loadPortfolio = useCallback(async (portfolioId: string) => {
    try {
      const portfolio = await portfolioApi.getPortfolio(portfolioId);
      setCurrentPortfolio(portfolio);
      if (portfolio.holdings && Array.isArray(portfolio.holdings)) {
        setHoldings(portfolio.holdings);
      } else {
        // Fallback to Berkshire if no holdings
        await loadHoldings();
      }
    } catch (err) {
      logError('PortfolioRisk', err);
      // Only set user-facing error if it's not a connection error
      if (!isConnectionError(err)) {
        setError('Failed to load portfolio');
      }
      // Fallback to Berkshire holdings
      await loadHoldings();
    }
  }, [loadHoldings]);
  
  const loadPortfolios = useCallback(async () => {
    setLoadingPortfolios(true);
    try {
      const portfolioList = await portfolioApi.listPortfolios();
      setPortfolios(portfolioList);
      
      // Auto-select first portfolio if available and none selected, otherwise use Berkshire as default
      if (portfolioList.length > 0 && !selectedPortfolioId) {
        const firstPortfolioId = portfolioList[0].id || portfolioList[0].portfolio_id;
        setSelectedPortfolioId(firstPortfolioId);
      } else if (portfolioList.length === 0 && !selectedPortfolioId) {
        // No portfolios, load Berkshire holdings as default
        await loadHoldings();
      }
    } catch (err) {
      logError('PortfolioRisk', err);
      // Fallback to Berkshire holdings
      await loadHoldings();
    } finally {
      setLoadingPortfolios(false);
    }
  }, [selectedPortfolioId, loadHoldings]);

  // Load portfolios and holdings on mount
  useEffect(() => {
    console.debug('[PortfolioRisk] Component mounted, loading portfolios and holdings...');
    loadPortfolios();
    loadAvailableIndices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPortfolios]);

  // Load selected portfolio when selection changes
  useEffect(() => {
    if (selectedPortfolioId) {
      loadPortfolio(selectedPortfolioId);
    } else {
      // Fallback to Berkshire holdings if no portfolio selected
      loadHoldings();
    }
  }, [selectedPortfolioId, loadPortfolio, loadHoldings]);

  // Refetch benchmark comparison when timeframe or holdings change
  useEffect(() => {
    if (selectedBenchmarkIndex && holdings.length > 0 && !loadingBenchmark) {
      const fetchComparison = async () => {
        setLoadingBenchmark(true);
        try {
          const comparison = await portfolioApi.compareToBenchmark({
            index_id: selectedBenchmarkIndex,
            timeframe,
            holdings,
            chadd2_config: chadd2Config.enabled ? {
              enabled: chadd2Config.enabled,
              model_type: chadd2Config.modelType,
              fibonacci_overlay: chadd2Config.fibonacciOverlay,
              lambda_fib: chadd2Config.lambdaFib,
              w_phi: chadd2Config.wPhi,
            } : undefined,
          });
          setBenchmarkComparison(comparison);
        } catch (err) {
          logError('PortfolioRisk', err);
          // Don't set error - just log it
        } finally {
          setLoadingBenchmark(false);
        }
      };
      fetchComparison();
    }
  }, [timeframe, holdings, selectedBenchmarkIndex, chadd2Config]);

  // Check API connectivity on mount (non-blocking)
  useEffect(() => {
    const checkApi = async () => {
      try {
        const testUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${testUrl}/api/v1/portfolio/berkshire-holdings`, {
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        if (response.ok) {
          console.debug('[PortfolioRisk] API is accessible');
        } else {
          console.debug('[PortfolioRisk] API check returned:', response.status, '- Backend may not be running');
        }
      } catch (err) {
        // Silently handle - backend may not be running, which is expected
        console.debug('[PortfolioRisk] API connectivity check: backend unavailable (expected if backend is not running)');
      }
    };
    checkApi();
  }, []);

  const handlePortfolioCreated = useCallback(async (portfolioData: { holdings: Holding[]; portfolioId?: string }) => {
    setHoldings(portfolioData.holdings);
    setShowPortfolioBuilder(false);
    setError(null);
    // Reload portfolios to include the new one
    await loadPortfolios();
    // Auto-select the newly created portfolio if we have its ID
    if (portfolioData.portfolioId) {
      setSelectedPortfolioId(portfolioData.portfolioId);
    }
  }, [loadPortfolios]);

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
      
      const request: any = {
        timeframe,
        analysis_type: 'both',
      };
      
      // Include chadd2_config only if enabled
      if (chadd2Config.enabled) {
        request.chadd2_config = {
          enabled: chadd2Config.enabled,
          model_type: chadd2Config.modelType,
          fibonacci_overlay: chadd2Config.fibonacciOverlay,
          lambda_fib: chadd2Config.lambdaFib,
          w_phi: chadd2Config.wPhi,
        };
      }
      
      console.log('[PortfolioRisk] Sending request:', request);
      const result = await portfolioApi.getTopRecommendations(request);
      console.log('[PortfolioRisk] Received result:', result);
      console.log('[PortfolioRisk] Holdings analyzed:', result.total_holdings_analyzed);
      console.log('[PortfolioRisk] Long-term recommendations:', result.recommendations?.long_term?.length || 0);
      console.log('[PortfolioRisk] Short-term recommendations:', result.recommendations?.short_term?.length || 0);

      if (result.total_holdings_analyzed === 0) {
        console.warn('[PortfolioRisk] WARNING: No holdings were analyzed. Check backend logs for details.');
        setError('Analysis completed but no holdings were successfully analyzed. This may indicate data fetching issues or missing dependencies. Check backend logs.');
      }

      setRecommendations(result);
      setAnalysisStatus('Analysis complete! Generating AI interpretations...');

      // Get AI interpretations (with error handling)
      try {
        if (result.recommendations?.long_term) {
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
              console.warn(`Error getting AI interpretation for ${rec.ticker}:`, err);
              // Continue with other recommendations
            }
          }
        }

        if (result.recommendations?.short_term) {
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
              console.warn(`Error getting AI interpretation for ${rec.ticker}:`, err);
              // Continue with other recommendations
            }
          }
        }
      } catch (err) {
        console.warn('Error in AI interpretation batch:', err);
        // Continue - AI interpretations are optional
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

  const handleAnalyzeHolding = useCallback(async (ticker: string) => {
    console.log('[PortfolioRisk] Analyzing holding:', ticker);
    setLoading(true);
    setError(null);
    setSelectedHolding(null);
    setAnalysisStatus(`Analyzing ${ticker}...`);

    try {
      const request: any = {
        ticker,
        timeframe,
      };
      
      if (chadd2Config.enabled) {
        request.chadd2_config = {
          enabled: chadd2Config.enabled,
          model_type: chadd2Config.modelType,
          fibonacci_overlay: chadd2Config.fibonacciOverlay,
          lambda_fib: chadd2Config.lambdaFib,
          w_phi: chadd2Config.wPhi,
        };
      }
      
      console.log('[PortfolioRisk] Sending analyze holding request:', request);
      const analysis = await portfolioApi.analyzeHolding(request);
      console.log('[PortfolioRisk] Received analysis:', analysis);
      
      setSelectedHolding(analysis);
      setAnalysisStatus('Analysis complete!');
      
      // Get AI interpretation for this holding
      try {
        if (analysis.squd && analysis.resilience_score !== undefined) {
          const aiResult = await aiApi.interpretPortfolioHolding({
            ticker: analysis.ticker,
            company_name: analysis.company_name || ticker,
            squd: analysis.squd as unknown as Record<string, number>,
            resilience_score: analysis.resilience_score,
            metrics: analysis.metrics as unknown as Record<string, number>,
            timeframe,
            analysis_type: 'long-term', // Use long-term as default for individual holdings
          });
          setAIInterpretations((prev) => ({
            ...prev,
            [`holding-${ticker}`]: aiResult.text,
          }));
        }
      } catch (aiErr) {
        console.warn(`Error getting AI interpretation for ${ticker}:`, aiErr);
        // Continue - AI interpretation is optional
      }
    } catch (err) {
      logError('PortfolioRisk', err, 'Holding analysis failed');
      setError(err instanceof Error ? err.message : 'Holding analysis failed');
      setAnalysisStatus('Analysis failed');
    } finally {
      setLoading(false);
      setTimeout(() => setAnalysisStatus(''), 3000);
    }
  }, [timeframe, chadd2Config]);

  const handleDeletePortfolio = useCallback(async (portfolioId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) {
      return;
    }
    try {
      await portfolioApi.deletePortfolio(portfolioId);
      await loadPortfolios();
      if (selectedPortfolioId === portfolioId) {
        setSelectedPortfolioId(null);
        await loadHoldings();
      }
    } catch (err) {
      logError('PortfolioRisk', err);
      // Only set user-facing error if it's not a connection error
      if (!isConnectionError(err)) {
        setError('Failed to delete portfolio. The endpoint may not be implemented yet.');
      }
    }
  }, [selectedPortfolioId, loadPortfolios, loadHoldings]);

  const actions = [
    {
      id: 'create-portfolio',
      label: 'Create Portfolio',
      icon: '➕',
      onClick: () => setShowPortfolioBuilder(true),
      variant: 'secondary' as const,
      disabled: loading || loadingPortfolios,
    },
    {
      id: 'analyze',
      label: loading ? 'Analyzing...' : 'Analyze Portfolio',
      icon: '📊',
      onClick: handleAnalyze,
      variant: 'primary' as const,
      disabled: loading || holdings.length === 0,
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

  // Helper functions for signal display (defined before useMemo)
  const getSignalLabel = (signal: string): string => {
    const labels: Record<string, string> = {
      buy: 'BUY',
      sell: 'SELL',
      hold: 'HOLD',
      strong_buy: 'STRONG BUY',
      strong_sell: 'STRONG SELL',
    };
    return labels[signal] || signal.toUpperCase();
  };

  const getSignalColorClass = (signal: string): string => {
    const colors: Record<string, string> = {
      buy: 'bg-green-600',
      sell: 'bg-red-600',
      hold: 'bg-yellow-600',
      strong_buy: 'bg-green-700',
      strong_sell: 'bg-red-700',
    };
    return colors[signal] || 'bg-gray-600';
  };

  // Helper function to create tab content - avoids SWC parser issues
  const createOverviewContent = React.useCallback(() => (
    <div className="space-y-6">
      {/* Portfolio Selection Section */}
      <DashboardSection title="Portfolio Management" icon="💼">
        <div className="space-y-4">
          {/* Demo Portfolio Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-lg">ℹ️</span>
              <div className="flex-1">
                <p className="text-sm text-blue-900 font-medium mb-1">Demo Portfolio Available</p>
                <p className="text-xs text-blue-700">
                  The <strong>Berkshire Hathaway</strong> portfolio is provided as a demonstration dataset. 
                  You can create your own portfolios or connect your brokerage accounts to analyze your actual holdings.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <label htmlFor="portfolio-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Active Portfolio:
            </label>
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <select
                id="portfolio-select"
                value={selectedPortfolioId || 'berkshire'}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'berkshire') {
                    setSelectedPortfolioId(null);
                  } else {
                    setSelectedPortfolioId(value);
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white text-sm sm:text-base"
                disabled={loading || loadingPortfolios}
              >
                <option value="berkshire">Berkshire Hathaway (Default)</option>
                {portfolios.map((portfolio) => (
                  <option key={portfolio.id || portfolio.portfolio_id} value={portfolio.id || portfolio.portfolio_id}>
                    {portfolio.name || portfolio.portfolio_name || `Portfolio ${portfolio.id || portfolio.portfolio_id}`}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowPortfolioBuilder(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 text-sm"
                disabled={loading || loadingPortfolios}
              >
                New Portfolio
              </button>
              <button
                onClick={loadPortfolios}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
                disabled={loading || loadingPortfolios}
              >
                {loadingPortfolios ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
          {currentPortfolio && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{currentPortfolio.name || 'Unnamed Portfolio'}</div>
                {currentPortfolio.description && (
                  <div className="text-gray-600 mt-1">{currentPortfolio.description}</div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Created: {currentPortfolio.created_at ? new Date(currentPortfolio.created_at).toLocaleDateString() : 'Unknown'} • 
                  Holdings: {holdings.length}
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardSection>

      <DashboardSection title="Analysis Configuration" icon="⚙️">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label htmlFor="timeframe-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Analysis Timeframe:
            </label>
            <select
              id="timeframe-select"
              value={timeframe}
              onChange={(e) => {
                const newTimeframe = e.target.value as Timeframe;
                console.log('[PortfolioRisk] Timeframe changed:', newTimeframe);
                setTimeframe(newTimeframe);
              }}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white text-sm sm:text-base"
              disabled={loading}
            >
              <option value="1y">1 Year</option>
              <option value="3y">3 Years</option>
              <option value="5y">5 Years</option>
              <option value="10y">10 Years</option>
            </select>
            <span className="text-xs sm:text-sm text-gray-500">
              Selected: {timeframe === '1y' ? '1 Year' : timeframe === '3y' ? '3 Years' : timeframe === '5y' ? '5 Years' : '10 Years'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label htmlFor="benchmark-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Benchmark Index:
            </label>
            <select
              id="benchmark-select"
              value={selectedBenchmarkIndex || ''}
              onChange={async (e) => {
                const indexId = e.target.value || null;
                setSelectedBenchmarkIndex(indexId);
                setBenchmarkComparison(null);
                
                if (indexId && holdings.length > 0) {
                  // Fetch benchmark comparison
                  setLoadingBenchmark(true);
                  try {
                    const comparison = await portfolioApi.compareToBenchmark({
                      index_id: indexId,
                      timeframe,
                      holdings,
                      chadd2_config: chadd2Config.enabled ? {
                        enabled: chadd2Config.enabled,
                        model_type: chadd2Config.modelType,
                        fibonacci_overlay: chadd2Config.fibonacciOverlay,
                        lambda_fib: chadd2Config.lambdaFib,
                        w_phi: chadd2Config.wPhi,
                      } : undefined,
                    });
                    setBenchmarkComparison(comparison);
                  } catch (err) {
                    logError('PortfolioRisk', err);
                    // Only set user-facing error if it's not a connection error
                    if (!isConnectionError(err)) {
                      setError('Failed to load benchmark comparison');
                    }
                  } finally {
                    setLoadingBenchmark(false);
                  }
                }
              }}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white text-sm sm:text-base"
              disabled={loading || loadingBenchmark || holdings.length === 0}
            >
              <option value="">No Benchmark</option>
              {availableIndices.map((index) => (
                <option key={index.id} value={index.id}>
                  {index.name} ({index.ticker})
                </option>
              ))}
            </select>
            {selectedBenchmarkIndex && (
              <button
                onClick={() => {
                  setSelectedBenchmarkIndex(null);
                  setBenchmarkComparison(null);
                }}
                className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                disabled={loading || loadingBenchmark}
              >
                Clear
              </button>
            )}
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
            <DashboardGrid cols={2} smCols={2} mdCols={4} gap="md">
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

      {/* Benchmark Comparison */}
      {loadingBenchmark && (
        <DashboardSection title="Benchmark Comparison" icon="📊">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 font-medium">Loading benchmark comparison...</p>
            </div>
          </div>
        </DashboardSection>
      )}

      {benchmarkComparison && !loadingBenchmark && (
        <BenchmarkComparisonComponent comparison={benchmarkComparison} domain={domain} />
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
  ), [
    timeframe,
    loading,
    error,
    analysisStatus,
    recommendations,
    holdings,
    selectedHolding,
    handleAnalyzeHolding,
    benchmarkComparison,
    loadingBenchmark,
    domain,
    selectedPortfolioId,
    portfolios,
    loadingPortfolios,
    currentPortfolio,
    availableIndices,
    selectedBenchmarkIndex,
    chadd2Config,
    loadPortfolios,
  ]);

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
      id: 'portfolios',
      label: 'Portfolio Manager',
      icon: '💼',
      content: (
        <div className="space-y-6">
          <DashboardSection title="My Portfolios" icon="💼">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Manage your portfolios. Create new ones, switch between them, or delete unused portfolios.
              </p>
              <button
                onClick={() => setShowPortfolioBuilder(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
              >
                Create New Portfolio
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Berkshire Default Option */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  !selectedPortfolioId
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPortfolioId(null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Berkshire Hathaway</h3>
                  {!selectedPortfolioId && (
                    <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">Active</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">Default portfolio with Berkshire holdings</p>
                <div className="text-xs text-gray-500">
                  Holdings: {holdings.length} (when active)
                </div>
              </div>

              {/* User Portfolios */}
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id || portfolio.portfolio_id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedPortfolioId === (portfolio.id || portfolio.portfolio_id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPortfolioId(portfolio.id || portfolio.portfolio_id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {portfolio.name || portfolio.portfolio_name || 'Unnamed Portfolio'}
                    </h3>
                    {selectedPortfolioId === (portfolio.id || portfolio.portfolio_id) && (
                      <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">Active</span>
                    )}
                  </div>
                  {portfolio.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{portfolio.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-gray-500">
                      Holdings: {portfolio.holdings?.length || 0}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePortfolio(portfolio.id || portfolio.portfolio_id);
                      }}
                      className="text-xs text-red-600 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {portfolios.length === 0 && (
              <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-500 mb-4">No custom portfolios yet</p>
                <button
                  onClick={() => setShowPortfolioBuilder(true)}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Create Your First Portfolio
                </button>
              </div>
            )}
          </DashboardSection>
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

          {/* AI Interpretation */}
          {aiInterpretations[`holding-${selectedHolding.ticker}`] && (
            <DashboardSection title="AI Investment Analysis" icon="🤖">
              <AIInterpretationCard
                interpretation={aiInterpretations[`holding-${selectedHolding.ticker}`]}
              />
            </DashboardSection>
          )}

          {/* Quick Ask CHADD Integration - Mobile responsive */}
          <DashboardSection title="Get Expert Advice" icon="💬">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-700 mb-3">
                Have questions about {selectedHolding.ticker}? Ask CHADD for diagnostic insights.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                <button
                  onClick={() => {
                    // Note: In a real implementation, this would switch tabs or open a modal
                    // For now, we'll show a helpful message
                    const message = `Switch to the "Ask CHADD" tab to ask: "What does CHADD analysis reveal about ${selectedHolding.ticker}?"`;
                    alert(message);
                  }}
                  className="px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-xs sm:text-sm touch-manipulation"
                >
                  Ask: What does CHADD reveal about {selectedHolding.ticker}?
                </button>
                <button
                  onClick={() => {
                    alert(`Switch to "Ask CHADD" tab to ask: "How is ${selectedHolding.company_name}'s resilience score calculated?"`);
                  }}
                  className="px-3 sm:px-4 py-2 bg-white border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 active:bg-primary-100 transition-colors text-xs sm:text-sm touch-manipulation"
                >
                  Ask: How is the resilience score calculated?
                </button>
                <button
                  onClick={() => {
                    alert(`Switch to "Ask CHADD" tab to ask: "What do the S/Q/U/D metrics indicate for ${selectedHolding.ticker}?"`);
                  }}
                  className="px-3 sm:px-4 py-2 bg-white border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 active:bg-primary-100 transition-colors text-xs sm:text-sm touch-manipulation"
                >
                  Ask: What do S/Q/U/D metrics indicate?
                </button>
              </div>
            </div>
          </DashboardSection>

          {/* Problems and Opportunities */}
          {selectedHolding.problems && selectedHolding.problems.length > 0 && (
            <DashboardSection title="Risk Flags" icon="⚠️">
              <div className="space-y-3">
                {selectedHolding.problems.map((problem: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      problem.severity === 'critical'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      {problem.severity === 'critical' ? '🔴 Critical' : '⚠️ Warning'}: {problem.category}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{problem.message}</p>
                    <p className="text-sm font-medium text-gray-900">{problem.recommendation}</p>
                  </div>
                ))}
              </div>
            </DashboardSection>
          )}

          {selectedHolding.opportunities && selectedHolding.opportunities.length > 0 && (
            <DashboardSection title="Emerging Opportunities" icon="🚀">
              <div className="space-y-3">
                {selectedHolding.opportunities.map((opp: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      opp.severity === 'high'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      {opp.severity === 'high' ? '⭐ High' : '📈 Medium'}: {opp.category}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{opp.message}</p>
                    <p className="text-sm font-medium text-gray-900">{opp.recommendation}</p>
                  </div>
                ))}
              </div>
            </DashboardSection>
          )}
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
          {/* Portfolio-level Ask CHADD Integration */}
          <DashboardSection title="Portfolio Strategy Advice" icon="💬">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                Get CHADD's diagnostic perspective on your portfolio strategy and recommendations.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    alert('Switch to "Ask CHADD" tab to get portfolio strategy advice');
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  Ask: How should I diversify my portfolio?
                </button>
                <button
                  onClick={() => {
                    alert('Switch to "Ask CHADD" tab to get portfolio health assessment');
                  }}
                  className="px-4 py-2 bg-white border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors text-sm"
                >
                  Ask: What's the overall diagnostic health of my portfolio?
                </button>
              </div>
            </div>
          </DashboardSection>

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
      content: (
        <div className="space-y-6">
          <AskCHADD
            selectedHolding={selectedHolding}
            recommendations={recommendations}
            holdings={holdings}
            timeframe={timeframe}
            showSuggestions={true}
            onAdviceUpdate={setChaddAdvice}
          />
          
          {/* Show actions based on CHADD's latest advice */}
          {chaddAdvice && (
            <DashboardSection title="Actions from CHADD's Advice" icon="💡">
              <PortfolioActions
                selectedHolding={selectedHolding}
                recommendations={recommendations}
                chaddAdvice={chaddAdvice}
              />
            </DashboardSection>
          )}
        </div>
      ),
    },
    {
      id: 'broker',
      label: 'Broker Integration',
      icon: '🔗',
      content: (
        <DashboardSection title="Broker & Platform Integrations" icon="🔗">
          <p className="text-sm text-gray-600 mb-4">
            Connect your brokerage accounts to execute trades directly from CHADD recommendations.
            Supports Alpaca, TD Ameritrade, Interactive Brokers, Robinhood, E*TRADE, and more.
          </p>
          <BrokerIntegration />
        </DashboardSection>
      ),
    },
  ], [holdings, timeframe, loading, error, recommendations, selectedHolding, aiInterpretations, chadd2Config, analysisStatus, domain, handleAnalyzeHolding, createOverviewContent, chaddAdvice, portfolios, selectedPortfolioId, currentPortfolio, loadingPortfolios, handleDeletePortfolio]);

  const handleProfileFormSubmit = async (formData: InvestmentPhilosophyFormData) => {
    try {
      if (editingProfile?.id) {
        await investmentPhilosophyApi.updateProfile(editingProfile.id, formData);
      } else {
        await investmentPhilosophyApi.createProfile(formData);
      }
      setShowProfileForm(false);
      setEditingProfile(null);
    } catch (error) {
      logError('PortfolioRisk', error);
      throw error;
    }
  };

  return (
    <>
      <DashboardTemplate
        config={config}
        sections={sections}
        actions={actions}
        chadd2Overlay={chadd2Config}
        onCHADD2ConfigChange={setChadd2Config}
        requireAuth={false}
      >
        {/* Investment Philosophy Profile Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <InvestmentPhilosophySelector
                compact={true}
                showCreateButton={true}
                onCreateClick={() => {
                  setEditingProfile(null);
                  setShowProfileForm(true);
                }}
              />
            </div>
            <a
              href="/settings/investment-philosophy"
              className="ml-4 text-sm text-primary-600 hover:text-primary-700"
            >
              Manage Profiles →
            </a>
          </div>
        </div>

        {/* Profile Form Modal */}
        {showProfileForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProfile ? 'Edit Investment Philosophy Profile' : 'Create Investment Philosophy Profile'}
                </h2>
                <button
                  onClick={() => {
                    setShowProfileForm(false);
                    setEditingProfile(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <InvestmentPhilosophyForm
                existingProfile={editingProfile}
                onSubmit={handleProfileFormSubmit}
                onCancel={() => {
                  setShowProfileForm(false);
                  setEditingProfile(null);
                }}
              />
            </div>
          </div>
        )}

        {showPortfolioBuilder ? (
          <div className="max-w-4xl mx-auto p-6">
            <PortfolioBuilder
              onPortfolioCreated={handlePortfolioCreated}
              onCancel={() => {
                setShowPortfolioBuilder(false);
                // Reload portfolios after creation
                loadPortfolios();
              }}
            />
          </div>
        ) : (
          <PortfolioTabs tabs={tabs} defaultTab="overview" />
        )}
      </DashboardTemplate>
      
      {/* Floating Ask CHADD Widget - Always accessible */}
      <AskCHADDFloating
        selectedHolding={selectedHolding}
        recommendations={recommendations}
        holdings={holdings}
        timeframe={timeframe}
      />
    </>
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
          <AIInterpretationCard interpretation={aiInterpretation} />
        </div>
      )}
    </div>
  );
}
