/**
 * Geophysical (Climate) Dashboard Page
 * Comprehensive dashboard for planetary health monitoring using CHADD/HDPD framework
 */

'use client';

import React, { useState, useMemo } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection } from '@/components/dashboard/template/DashboardSection';
import { DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { useDomainLabels } from '@/hooks/useDomainTerminology';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

type Scope = 'global' | 'hemispheric' | 'regional' | 'local';
type RondoPhase = 'A1' | 'B' | 'A2' | 'C' | 'A3';

interface BaselineData {
  temp_anomaly: number; // °C
  co2_ppm: number; // ppm
  sea_ice_extent: number; // million km²
  amoc_strength: number; // Sv
  enso_regularity: number; // 0..1
  methane_flux: number; // Tg CH4/yr
}

interface RondoResult {
  phase: RondoPhase;
  S: number;
  Q: number;
  U: number;
  D: number;
}

// Default baseline (2015-2019 illustrative slice)
const DEFAULT_BASELINE: BaselineData = {
  temp_anomaly: 1.0,
  co2_ppm: 410,
  sea_ice_extent: 5.0,
  amoc_strength: 18.0,
  enso_regularity: 0.8,
  methane_flux: 360,
};

// Simplified S/Q/U calculation (matches backend logic)
function computeClimateSQU(data: BaselineData): { S: number; Q: number; U: number } {
  // S = clip01( (1 − temp_anomaly/3) × (sea_ice_extent/6) )
  const S = Math.max(0, Math.min(1, (1 - data.temp_anomaly / 3) * (data.sea_ice_extent / 6)));
  
  // Q = clip[0.01,1]( (amoc_strength/20) × enso_regularity )
  const Q = Math.max(0.01, Math.min(1, (data.amoc_strength / 20) * data.enso_regularity));
  
  // U = clip[0,2]( (co2_ppm − 280)/700 + methane_flux/1000 )
  const U = Math.max(0, Math.min(2, (data.co2_ppm - 280) / 700 + data.methane_flux / 1000));
  
  return { S, Q, U };
}

// Simplified D calculation (logistic aggregate)
function computeD(S: number, Q: number, U: number): number {
  const wS = 2.0;
  const wQ = 1.2;
  const wU = 1.0;
  
  // D = σ( wS·S + wQ·ln(Q) − wU·U )
  const logQ = Math.log(Math.max(0.01, Q));
  const linear = wS * S + wQ * logQ - wU * U;
  const D = 1 / (1 + Math.exp(-linear));
  
  return D;
}

// Generate Rondo protocol results (A1, B, A2, C, A3)
function runRondoProtocol(baseline: BaselineData): RondoResult[] {
  const results: RondoResult[] = [];
  
  // A1: Baseline
  const { S: S1, Q: Q1, U: U1 } = computeClimateSQU(baseline);
  results.push({
    phase: 'A1',
    S: S1,
    Q: Q1,
    U: U1,
    D: computeD(S1, Q1, U1),
  });
  
  // B: Mild stress (+1.5°C temp, 0.8x sea ice, +50 ppm CO2)
  const B_data = {
    ...baseline,
    temp_anomaly: baseline.temp_anomaly + 1.5,
    sea_ice_extent: baseline.sea_ice_extent * 0.8,
    co2_ppm: baseline.co2_ppm + 50,
  };
  const { S: SB, Q: QB, U: UB } = computeClimateSQU(B_data);
  results.push({
    phase: 'B',
    S: SB,
    Q: QB,
    U: UB,
    D: computeD(SB, QB, UB),
  });
  
  // A2: Recovery (+0.5°C temp)
  const A2_data = {
    ...baseline,
    temp_anomaly: baseline.temp_anomaly + 0.5,
  };
  const { S: S2, Q: Q2, U: U2 } = computeClimateSQU(A2_data);
  results.push({
    phase: 'A2',
    S: S2,
    Q: Q2,
    U: U2,
    D: computeD(S2, Q2, U2),
  });
  
  // C: Severe stress (+3°C temp, 0.4x sea ice, +150 ppm CO2, 0.5x AMOC)
  const C_data = {
    ...baseline,
    temp_anomaly: baseline.temp_anomaly + 3.0,
    sea_ice_extent: baseline.sea_ice_extent * 0.4,
    co2_ppm: baseline.co2_ppm + 150,
    amoc_strength: baseline.amoc_strength * 0.5,
  };
  const { S: SC, Q: QC, U: UC } = computeClimateSQU(C_data);
  results.push({
    phase: 'C',
    S: SC,
    Q: QC,
    U: UC,
    D: computeD(SC, QC, UC),
  });
  
  // A3: Long-term (+2°C temp, +100 ppm CO2)
  const A3_data = {
    ...baseline,
    temp_anomaly: baseline.temp_anomaly + 2.0,
    co2_ppm: baseline.co2_ppm + 100,
  };
  const { S: S3, Q: Q3, U: U3 } = computeClimateSQU(A3_data);
  results.push({
    phase: 'A3',
    S: S3,
    Q: Q3,
    U: U3,
    D: computeD(S3, Q3, U3),
  });
  
  return results;
}

export default function GeophysicalDashboard() {
  return <GeophysicalDashboardContent />;
}

function GeophysicalDashboardContent() {
  const domain = 'geophysical';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [scope, setScope] = useState<Scope>('global');
  const [region, setRegion] = useState<string>('');
  const [baseline, setBaseline] = useState<BaselineData>(DEFAULT_BASELINE);
  const [results, setResults] = useState<RondoResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chadd2Config, setChadd2Config] = useState<CHADD2OverlayConfig>({
    enabled: false,
    modelType: 'auto',
    fibonacciOverlay: false,
    lambdaFib: 0.0,
    wPhi: 0.0,
  });

  const handleRunRondo = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Run Rondo protocol
      const rondoResults = runRondoProtocol(baseline);
      setResults(rondoResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run Rondo protocol');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemo = () => {
    setBaseline(DEFAULT_BASELINE);
    setResults(null);
  };

  // Calculate summary metrics from results
  const summaryMetrics = useMemo(() => {
    if (!results || results.length === 0) return null;
    
    const meanS = results.reduce((sum, r) => sum + r.S, 0) / results.length;
    const meanQ = results.reduce((sum, r) => sum + r.Q, 0) / results.length;
    const meanU = results.reduce((sum, r) => sum + r.U, 0) / results.length;
    const meanD = results.reduce((sum, r) => sum + r.D, 0) / results.length;
    
    return {
      S: meanS,
      Q: meanQ,
      U: meanU,
      D: meanD,
      health: (1 - meanD) * 100, // Convert D to health percentage
    };
  }, [results]);

  // Prepare time series data for charts
  const timeSeriesData = useMemo(() => {
    if (!results) return [];
    
    return results.map((r, idx) => ({
      timestamp: new Date(2025, 0, 1 + idx).toISOString(),
      phase: r.phase,
      S: r.S,
      Q: r.Q,
      U: r.U,
      D: r.D,
    }));
  }, [results]);

  const actions = [
    {
      id: 'run-rondo',
      label: loading ? 'Running Rondo Protocol...' : 'Run Rondo Protocol',
      icon: '▶️',
      onClick: handleRunRondo,
      variant: 'primary' as const,
      disabled: loading,
    },
    {
      id: 'load-demo',
      label: 'Load Demo Baseline',
      icon: '📋',
      onClick: handleLoadDemo,
      variant: 'secondary' as const,
      disabled: loading,
    },
  ];

  const sections = {
    header: true,
    metrics: true,
    telemetry: true,
    charts: true,
    aiInterpretation: false,
    maintenance: false,
  };

  return (
    <DashboardTemplate
      config={config}
      sections={sections}
      actions={actions}
      chadd2Overlay={chadd2Config}
      onCHADD2ConfigChange={setChadd2Config}
    >
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Configuration Section */}
      <DashboardSection title="Configuration" icon="⚙️">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="scope-select" className="block text-sm font-medium text-gray-700 mb-2">
                Scope
              </label>
              <select
                id="scope-select"
                value={scope}
                onChange={(e) => setScope(e.target.value as Scope)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white"
                disabled={loading}
              >
                <option value="global">Global</option>
                <option value="hemispheric">Hemispheric</option>
                <option value="regional">Regional</option>
                <option value="local">Local</option>
              </select>
            </div>
            
            {(scope === 'regional' || scope === 'local') && (
              <div>
                <label htmlFor="region-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Region (optional)
                </label>
                <input
                  id="region-input"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g., EU, NA, Amazon, NYC"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white"
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </div>
      </DashboardSection>

      {/* Baseline Input Section */}
      <DashboardSection title="Baseline Climate Data" icon="🌍">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Configure baseline climate indicators. See docs/Geophysical_Datasets_and_Inputs.md for data sources.
          </p>
          
          <DashboardGrid cols={3} gap="md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature Anomaly (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={baseline.temp_anomaly}
                onChange={(e) => setBaseline({ ...baseline, temp_anomaly: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Global mean surface temp anomaly</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CO₂ Concentration (ppm)
              </label>
              <input
                type="number"
                step="1"
                value={baseline.co2_ppm}
                onChange={(e) => setBaseline({ ...baseline, co2_ppm: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Atmospheric CO₂</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sea Ice Extent (million km²)
              </label>
              <input
                type="number"
                step="0.1"
                value={baseline.sea_ice_extent}
                onChange={(e) => setBaseline({ ...baseline, sea_ice_extent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Arctic sea ice extent</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AMOC Strength (Sv)
              </label>
              <input
                type="number"
                step="0.1"
                value={baseline.amoc_strength}
                onChange={(e) => setBaseline({ ...baseline, amoc_strength: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Atlantic Meridional Overturning Circulation</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ENSO Regularity (0-1)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={baseline.enso_regularity}
                onChange={(e) => setBaseline({ ...baseline, enso_regularity: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">ENSO cycle regularity index</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Methane Flux (Tg CH₄/yr)
              </label>
              <input
                type="number"
                step="1"
                value={baseline.methane_flux}
                onChange={(e) => setBaseline({ ...baseline, methane_flux: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 bg-white"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Global methane emissions</p>
            </div>
          </DashboardGrid>
        </div>
      </DashboardSection>

      {/* Results - S/Q/U/D Metrics */}
      {summaryMetrics && (
        <>
          <MetricsCard
            squd={{
              S: summaryMetrics.S,
              Q: summaryMetrics.Q,
              U: summaryMetrics.U,
              D: summaryMetrics.D,
            }}
            health={summaryMetrics.health}
            domain={domain}
            title={`${domainLabels.terminology.healthLabel} Assessment (${domainLabels.getFrameworkName()} Framework)`}
          />

          {/* Rondo Protocol Results Table */}
          <DashboardSection title="Rondo Protocol Results (A1, B, A2, C, A3)" icon="📊">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phase
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {domainLabels.getSQUDLabel('S')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {domainLabels.getSQUDLabel('Q')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {domainLabels.getSQUDLabel('U')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {domainLabels.getSQUDLabel('D')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results?.map((result) => (
                    <tr key={result.phase}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.phase}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.S.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.Q.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.U.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {result.D.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Rondo Protocol:</strong> A1 (baseline) → B (mild stress) → A2 (recovery) → C (severe stress) → A3 (long-term)
              </p>
            </div>
          </DashboardSection>

          {/* Time Series Charts */}
          {timeSeriesData.length > 0 && (
            <DashboardSection title="S/Q/U/D Metrics Across Rondo Phases" icon="📈">
              <div className="space-y-6">
                <TimeSeriesChart
                  data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                  lines={[
                    { key: 'S', name: domainLabels.getSQUDLabel('S'), color: '#10b981' },
                    { key: 'Q', name: domainLabels.getSQUDLabel('Q'), color: '#f59e0b' },
                    { key: 'U', name: domainLabels.getSQUDLabel('U'), color: '#ef4444' },
                    { key: 'D', name: domainLabels.getSQUDLabel('D'), color: '#3b82f6' },
                  ]}
                  title="S/Q/U/D Metrics Across Rondo Phases"
                  height={400}
                />
              </div>
            </DashboardSection>
          )}

          {/* Phase Summary Metrics */}
          <DashboardSection title="Phase Summary" icon="📊">
            <DashboardGrid cols={4} gap="md">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Mean {domainLabels.getSQUDLabel('S')}</div>
                <div className="text-2xl font-bold text-gray-900">{summaryMetrics.S.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Mean {domainLabels.getSQUDLabel('Q')}</div>
                <div className="text-2xl font-bold text-gray-900">{summaryMetrics.Q.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Mean {domainLabels.getSQUDLabel('U')}</div>
                <div className="text-2xl font-bold text-gray-900">{summaryMetrics.U.toFixed(4)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Mean {domainLabels.getSQUDLabel('D')}</div>
                <div className="text-2xl font-bold text-gray-900">{summaryMetrics.D.toFixed(4)}</div>
              </div>
            </DashboardGrid>
          </DashboardSection>
        </>
      )}
    </DashboardTemplate>
  );
}

