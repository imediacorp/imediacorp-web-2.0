/**
 * Portfolio Actions Component
 * Displays actionable recommendations based on CHADD analysis and CHADD's advice
 */

'use client';

import React, { useState } from 'react';
import type { HoldingAnalysis, TopRecommendationsResponse } from '@/types/portfolio';
import { BrokerIntegration } from './BrokerIntegration';

interface PortfolioAction {
  type: 'buy' | 'sell' | 'hold' | 'diversify' | 'reduce' | 'increase';
  ticker?: string;
  company_name?: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  confidence: number; // 0-1
  source: 'chadd' | 'combined';
}

interface PortfolioActionsProps {
  selectedHolding?: HoldingAnalysis | null;
  recommendations?: TopRecommendationsResponse | null;
  chaddAdvice?: string; // Latest CHADD advice to parse
}

export function PortfolioActions({
  selectedHolding,
  recommendations,
  chaddAdvice,
}: PortfolioActionsProps) {
  const actions = React.useMemo(() => {
    const actionList: PortfolioAction[] = [];

    // Actions from CHADD analysis
    if (selectedHolding?.investment_signal) {
      const signal = selectedHolding.investment_signal;
      if (signal.signal === 'STRONG_BUY' || signal.signal === 'BUY') {
        actionList.push({
          type: 'buy',
          ticker: selectedHolding.ticker,
          company_name: selectedHolding.company_name,
          priority: signal.signal === 'STRONG_BUY' ? 'high' : 'medium',
          reason: signal.rationale,
          confidence: signal.strength,
          source: 'chadd',
        });
      } else if (signal.signal === 'STRONG_SELL' || signal.signal === 'SELL') {
        actionList.push({
          type: 'sell',
          ticker: selectedHolding.ticker,
          company_name: selectedHolding.company_name,
          priority: signal.signal === 'STRONG_SELL' ? 'high' : 'medium',
          reason: signal.rationale,
          confidence: signal.strength,
          source: 'chadd',
        });
      }
    }

    // Actions from top recommendations
    if (recommendations) {
      recommendations.recommendations?.long_term?.forEach((rec) => {
        actionList.push({
          type: 'buy',
          ticker: rec.ticker,
          company_name: rec.company_name,
          priority: rec.resilience_score > 0.8 ? 'high' : 'medium',
          reason: `Long-term value opportunity with ${(rec.resilience_score * 100).toFixed(0)}% resilience score`,
          confidence: rec.resilience_score,
          source: 'chadd',
        });
      });

      recommendations.recommendations?.short_term?.forEach((rec) => {
        actionList.push({
          type: 'buy',
          ticker: rec.ticker,
          company_name: rec.company_name,
          priority: 'medium',
          reason: `Short-term opportunity with ${(rec.resilience_score * 100).toFixed(0)}% resilience score`,
          confidence: rec.resilience_score * 0.8, // Slightly lower confidence for short-term
          source: 'chadd',
        });
      });
    }

    // Parse CHADD's advice for actionable items (simple keyword matching)
    if (chaddAdvice) {
      const adviceLower = chaddAdvice.toLowerCase();
      
      // Look for buy recommendations
      if (adviceLower.includes('buy') || adviceLower.includes('purchase') || adviceLower.includes('invest')) {
        const tickerMatch = chaddAdvice.match(/\b([A-Z]{1,5})\b/);
        if (tickerMatch && selectedHolding) {
          actionList.push({
            type: 'buy',
            ticker: selectedHolding.ticker,
            company_name: selectedHolding.company_name,
            priority: adviceLower.includes('strong') || adviceLower.includes('highly') ? 'high' : 'medium',
            reason: 'CHADD recommends this investment',
            confidence: 0.75,
            source: 'chadd',
          });
        }
      }

      // Look for sell recommendations
      if (adviceLower.includes('sell') || adviceLower.includes('avoid') || adviceLower.includes('exit')) {
        if (selectedHolding) {
          actionList.push({
            type: 'sell',
            ticker: selectedHolding.ticker,
            company_name: selectedHolding.company_name,
            priority: 'high',
            reason: 'CHADD advises against this holding',
            confidence: 0.8,
            source: 'chadd',
          });
        }
      }

      // Look for diversification advice
      if (adviceLower.includes('diversif') || adviceLower.includes('spread') || adviceLower.includes('balance')) {
        actionList.push({
          type: 'diversify',
          priority: 'medium',
          reason: 'CHADD suggests portfolio diversification',
          confidence: 0.7,
          source: 'chadd',
        });
      }
    }

    // Sort by priority and confidence
    return actionList.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.confidence - a.confidence;
    });
  }, [selectedHolding, recommendations, chaddAdvice]);

  if (actions.length === 0) {
    return null;
  }

  const getActionColor = (type: PortfolioAction['type']) => {
    switch (type) {
      case 'buy':
      case 'increase':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'sell':
      case 'reduce':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'hold':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'diversify':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getActionIcon = (type: PortfolioAction['type']) => {
    switch (type) {
      case 'buy':
      case 'increase':
        return '📈';
      case 'sell':
      case 'reduce':
        return '📉';
      case 'hold':
        return '⏸️';
      case 'diversify':
        return '🔄';
      default:
        return '💡';
    }
  };

  const getSourceBadge = (source: PortfolioAction['source']) => {
    switch (source) {
      case 'chadd':
        return <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">CHADD</span>;
      case 'combined':
        return <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">Combined</span>;
    }
  };

  const [selectedAction, setSelectedAction] = useState<PortfolioAction | null>(null);
  const [showBrokerIntegration, setShowBrokerIntegration] = useState(false);

  return (
    <div className="space-y-3">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
      {actions.map((action, idx) => (
        <div
          key={idx}
          className={`p-3 sm:p-4 rounded-lg border ${getActionColor(action.type)}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{getActionIcon(action.type)}</span>
              <div>
                <div className="font-semibold capitalize">
                  {action.type.toUpperCase()}
                  {action.ticker && ` ${action.ticker}`}
                  {action.company_name && ` - ${action.company_name}`}
                </div>
                <div className="text-sm opacity-90 mt-1">{action.reason}</div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              {getSourceBadge(action.source)}
              <div className="text-xs">
                Confidence: {(action.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${
              action.priority === 'high' ? 'bg-red-100 text-red-700' :
              action.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {action.priority.toUpperCase()} Priority
            </span>
            {(action.type === 'buy' || action.type === 'sell') && action.ticker && (
              <button
                onClick={() => {
                  setSelectedAction(action);
                  setShowBrokerIntegration(true);
                }}
                className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-600 text-white rounded hover:bg-primary-700 active:bg-primary-800 transition-colors touch-manipulation"
              >
                Execute Trade
              </button>
            )}
          </div>
        </div>
      ))}
      
      {/* Broker Integration Modal */}
      {showBrokerIntegration && selectedAction && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900">Execute Trade</h4>
            <button
              onClick={() => {
                setShowBrokerIntegration(false);
                setSelectedAction(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <BrokerIntegration
            action={selectedAction}
            ticker={selectedAction.ticker}
            onTradeExecuted={(result) => {
              if (result.success) {
                alert(`Trade executed successfully! Order ID: ${result.orderId}`);
                setShowBrokerIntegration(false);
                setSelectedAction(null);
              } else {
                alert(`Trade failed: ${result.error}`);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

