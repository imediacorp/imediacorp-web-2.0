/**
 * Market Scanner Component
 * Scans the market for investment opportunities using value investing principles
 */

'use client';

import React, { useState } from 'react';
import { portfolioApi } from '@/lib/api/portfolio';
import { DashboardSection, DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import type { MarketScanRequest, MarketOpportunity, CHADD2OverlayConfig } from '@/types/portfolio';
import type { CHADD2OverlayConfig as CHADD2Config } from '@/types/dashboard';

interface MarketScannerProps {
  chadd2Config?: CHADD2Config;
}

export function MarketScanner({ chadd2Config }: MarketScannerProps) {
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);
  const [maxResults, setMaxResults] = useState(20);

  const handleScan = async () => {
    console.log('[MarketScanner] Starting market scan...', { sectors, maxResults, chadd2Config });
    setLoading(true);
    setError(null);
    setOpportunities([]);

    try {
      const request: MarketScanRequest = {
        sectors: sectors.length > 0 ? sectors : undefined,
        max_results: maxResults,
        timeframe: '1y',
        chadd2_config: chadd2Config?.enabled
          ? {
              enabled: chadd2Config.enabled,
              model_type: chadd2Config.modelType,
              fibonacci_overlay: chadd2Config.fibonacciOverlay,
              lambda_fib: chadd2Config.lambdaFib,
              w_phi: chadd2Config.wPhi,
            }
          : undefined,
      };

      console.log('[MarketScanner] Sending request:', request);
      const response = await portfolioApi.scanMarket(request);
      console.log('[MarketScanner] Received response:', response);
      setOpportunities(response.opportunities);
    } catch (err) {
      console.error('[MarketScanner] Error scanning market:', err);
      setError(err instanceof Error ? err.message : 'Market scan failed');
    } finally {
      setLoading(false);
    }
  };

  const groupedOpportunities = {
    'long-term': opportunities.filter((o) => o.opportunity_type === 'long-term'),
    'medium-term': opportunities.filter((o) => o.opportunity_type === 'medium-term'),
    'short-term': opportunities.filter((o) => o.opportunity_type === 'short-term'),
  };

  return (
    <div className="space-y-6">
      <DashboardSection title="Market Scanner" icon="🔍">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Results
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value) || 20)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={loading}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sectors (optional)
              </label>
              <input
                type="text"
                placeholder="Technology, Healthcare, Financials..."
                value={sectors.join(', ')}
                onChange={(e) =>
                  setSectors(
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={loading}
              />
            </div>
          </div>
          <button
            onClick={handleScan}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Scanning Market...' : 'Scan Market for Opportunities'}
          </button>
        </div>
      </DashboardSection>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {opportunities.length > 0 && (
        <>
          {groupedOpportunities['long-term'].length > 0 && (
            <DashboardSection title="Long-Term Value Opportunities" icon="🏆">
              <div className="space-y-4">
                {groupedOpportunities['long-term'].map((opp) => (
                  <OpportunityCard key={opp.ticker} opportunity={opp} />
                ))}
              </div>
            </DashboardSection>
          )}

          {groupedOpportunities['medium-term'].length > 0 && (
            <DashboardSection title="Medium-Term Value Opportunities" icon="📈">
              <div className="space-y-4">
                {groupedOpportunities['medium-term'].map((opp) => (
                  <OpportunityCard key={opp.ticker} opportunity={opp} />
                ))}
              </div>
            </DashboardSection>
          )}

          {groupedOpportunities['short-term'].length > 0 && (
            <DashboardSection title="Short-Term Opportunities" icon="⚡">
              <div className="space-y-4">
                {groupedOpportunities['short-term'].map((opp) => (
                  <OpportunityCard key={opp.ticker} opportunity={opp} />
                ))}
              </div>
            </DashboardSection>
          )}
        </>
      )}
    </div>
  );
}

interface OpportunityCardProps {
  opportunity: MarketOpportunity;
}

function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {opportunity.company_name} ({opportunity.ticker})
          </h3>
          {opportunity.sector && (
            <p className="text-sm text-gray-500 mt-1">{opportunity.sector}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Resilience Score</div>
          <div className="text-2xl font-bold text-primary-600">
            {(opportunity.resilience_score * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <MetricsCard
        squd={opportunity.squd}
        health={opportunity.resilience_score * 100}
        title="CHADD Metrics"
        domain="portfolio-risk"
      />

      {opportunity.discount_to_value && (
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-900">Discount to Intrinsic Value</div>
              <div className="text-lg font-bold text-blue-700">
                {(opportunity.discount_to_value * 100).toFixed(1)}%
              </div>
            </div>
            {opportunity.current_price && opportunity.intrinsic_value_estimate && (
              <div className="text-right">
                <div className="text-xs text-blue-600">Current: ${opportunity.current_price.toFixed(2)}</div>
                <div className="text-xs text-blue-600">
                  Est. Value: ${opportunity.intrinsic_value_estimate.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {opportunity.buy_recommendation && (
        <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-green-900">Buy Recommendation</h4>
            <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded">
              {opportunity.buy_recommendation.action}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-green-700 font-medium">Position Size: </span>
              <span className="text-green-900">{opportunity.buy_recommendation.position_size}</span>
            </div>
            <div>
              <span className="text-green-700 font-medium">Conviction: </span>
              <span className="text-green-900 capitalize">{opportunity.buy_recommendation.conviction}</span>
            </div>
            <div className="col-span-2">
              <span className="text-green-700 font-medium">Entry Strategy: </span>
              <span className="text-green-900">{opportunity.buy_recommendation.entry_strategy}</span>
            </div>
            <div className="col-span-2">
              <span className="text-green-700 font-medium">Target Price: </span>
              <span className="text-green-900">{opportunity.buy_recommendation.target_price_range}</span>
            </div>
          </div>
          {opportunity.buy_recommendation.rationale && (
            <p className="mt-3 text-sm text-green-800">{opportunity.buy_recommendation.rationale}</p>
          )}
        </div>
      )}

      {opportunity.rationale && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700">{opportunity.rationale}</p>
        </div>
      )}
    </div>
  );
}

