/**
 * Cross-Domain Comparison Component
 * Main component for comparing S/Q/U/D metrics across multiple domains
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DomainSelector } from './DomainSelector';
import { ComparisonChart } from './ComparisonChart';
import { CorrelationMatrix } from './CorrelationMatrix';
import { DashboardSection } from './template/DashboardSection';
import { comparisonApi } from '@/lib/api/comparison';
import { useWebSocket, WebSocketMessage } from '@/hooks/useWebSocket';
import type { DomainId, ComparisonResult, ComparisonConfiguration } from '@/types/comparison';

interface CrossDomainComparisonProps {
  initialDomains?: DomainId[];
  onComparisonComplete?: (result: ComparisonResult) => void;
}

export function CrossDomainComparison({
  initialDomains = [],
  onComparisonComplete,
}: CrossDomainComparisonProps) {
  const [selectedDomains, setSelectedDomains] = useState<DomainId[]>(initialDomains);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'S' | 'Q' | 'U' | 'D' | 'health'>('D');
  const [showCorrelation, setShowCorrelation] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  // WebSocket connection for live updates
  const { isConnected, sendMessage } = useWebSocket({
    domain: 'comparison',
    enabled: isLive && selectedDomains.length >= 2,
    onMessage: (message: WebSocketMessage) => {
      if (message.type === 'data' && message.domain === 'comparison') {
        const payload = message.payload as {
          domains?: Record<string, { S?: number; Q?: number; U?: number; D?: number; health?: number }>;
          correlation?: Record<string, number>;
          updated_domains?: string[];
        };

        if (payload.domains) {
          // Update comparison result with live data
          const updatedDomains = Object.entries(payload.domains).map(([domain, values]) => ({
            domain,
            S: values.S ?? 0,
            Q: values.Q ?? 0,
            U: values.U ?? 0,
            D: values.D ?? 0,
            health: values.health ?? 0,
          }));

          const updatedCorrelations = payload.correlation
            ? Object.entries(payload.correlation).map(([metric, value]) => ({
                domain1: selectedDomains[0] || '',
                domain2: selectedDomains[1] || '',
                metric,
                correlation: value,
              }))
            : [];

          setComparisonResult({
            sessionId: sessionIdRef.current || undefined,
            domains: updatedDomains,
            correlations: updatedCorrelations,
            insights: [],
          });
        }
      }
    },
  });

  const handleRunComparison = async () => {
    if (selectedDomains.length < 2) {
      setError('Please select at least 2 domains to compare');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const configuration: ComparisonConfiguration = {
        metrics: ['S', 'Q', 'U', 'D', 'health'],
        showCorrelation,
      };

      const result = await comparisonApi.runComparison({
        domains: selectedDomains,
        configuration,
      });

      setComparisonResult(result);
      sessionIdRef.current = result.sessionId || null;

      if (onComparisonComplete) {
        onComparisonComplete(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run comparison');
    } finally {
      setLoading(false);
    }
  };

  // Start live updates when domains are selected and WebSocket is connected
  useEffect(() => {
    if (isLive && isConnected && selectedDomains.length >= 2 && sessionIdRef.current) {
      sendMessage({
        type: 'start_stream',
        domain: 'comparison',
        payload: {
          domains: selectedDomains,
          session_id: sessionIdRef.current,
        },
      });
    }
  }, [isLive, isConnected, selectedDomains, sendMessage]);

  return (
    <div className="space-y-6">
      <DashboardSection title="Cross-Domain Comparison" variant="card">
        <div className="space-y-6">
          {/* Domain Selection */}
          <DomainSelector
            selectedDomains={selectedDomains}
            onSelectionChange={setSelectedDomains}
            maxSelections={5}
            disabled={loading}
          />

          {/* Comparison Controls */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRunComparison}
              disabled={loading || selectedDomains.length < 2}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Running Comparison...' : 'Run Comparison'}
            </button>

            {comparisonResult && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">
                  Live Updates
                  {isLive && isConnected && (
                    <span className="ml-2 inline-flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="ml-1 text-green-600 text-xs">Live</span>
                    </span>
                  )}
                </span>
              </label>
            )}

            {selectedDomains.length < 2 && (
              <p className="text-sm text-amber-600">
                Select at least 2 domains to compare
              </p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Results */}
          {comparisonResult && (
            <div className="space-y-6">
              {/* Metric Selector */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Metric:</label>
                <select
                  value={selectedMetric}
                  onChange={(e) =>
                    setSelectedMetric(e.target.value as 'S' | 'Q' | 'U' | 'D' | 'health')
                  }
                  className="px-3 py-1 border border-gray-300 rounded-md"
                >
                  <option value="S">Stability (S)</option>
                  <option value="Q">Coherence (Q)</option>
                  <option value="U">Susceptibility (U)</option>
                  <option value="D">Diagnostic (D)</option>
                  <option value="health">Health</option>
                </select>
              </div>

              {/* Comparison Chart */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedMetric.toUpperCase()} Comparison
                </h3>
                <ComparisonChart
                  data={comparisonResult.domains}
                  metric={selectedMetric}
                  height={400}
                />
              </div>

              {/* Correlation Matrix */}
              {showCorrelation && comparisonResult.correlations.length > 0 && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Correlation Matrix</h3>
                  <CorrelationMatrix
                    correlations={comparisonResult.correlations}
                    domains={selectedDomains}
                    metric={selectedMetric}
                  />
                </div>
              )}

              {/* Insights */}
              {comparisonResult.insights && comparisonResult.insights.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold mb-2 text-blue-900">Insights</h3>
                  <ul className="space-y-2">
                    {comparisonResult.insights.map((insight, index) => (
                      <li key={index} className="text-sm text-blue-800">
                        • {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardSection>
    </div>
  );
}

