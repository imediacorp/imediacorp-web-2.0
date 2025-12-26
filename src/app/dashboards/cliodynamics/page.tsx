/**
 * Cliodynamics Dashboard Page
 * Civilization Dynamics & Historical Analysis using CHADD/SDT Framework
 * Enhanced version with multi-polity comparison, PSI trajectories, and cycle analysis
 */

'use client';

import React, { useState, useMemo } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection, DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { useDomainLabels } from '@/hooks/useDomainTerminology';
import type { DashboardAction, MetricsSummary, CHADD2OverlayConfig } from '@/types/dashboard';

interface SDTMetrics {
  psi: number; // Political Stress Indicator [0, 1]
  mmp: number; // Mass Mobilization Potential [0, 1]
  emp: number; // Elite Mobilization Potential [0, 1]
  sfd: number; // State Fiscal Distress [0, 1]
}

interface PolityData {
  polity: string;
  period: string;
  startYear: number;
  endYear: number;
  squd: { S: number; Q: number; U: number; D: number };
  sdt: SDTMetrics;
  health: number;
  metrics: {
    population: number;
    hierarchy: number;
    inequality: number;
    warfare: number;
    urbanization: number;
    real_wage_index?: number;
    state_revenues?: number;
    state_expenditures?: number;
    public_debt?: number;
  };
}

interface TimeSeriesDataPoint {
  timestamp: string;
  year: number;
  S: number;
  Q: number;
  U: number;
  D: number;
  PSI: number;
  MMP: number;
  EMP: number;
  SFD: number;
}

interface PolityResult {
  polity: string;
  period: string;
  timeSeries: TimeSeriesDataPoint[];
  meanMetrics: {
    S: number;
    Q: number;
    U: number;
    D: number;
    PSI: number;
    MMP: number;
    EMP: number;
    SFD: number;
  };
}

// Simplified SDT to CHADD mapping (client-side approximation)
function computeSDTFromMetrics(metrics: PolityData['metrics']): SDTMetrics {
  // Elite overproduction proxy: elites per 10k people
  const pop = metrics.population || 1_000_000;
  const elites = (metrics.population || 1_000_000) * 0.003; // Rough estimate
  const elitesPer10k = elites / Math.max(1, pop / 10_000);
  const eliteOverprod = Math.max(0, Math.min(1, (elitesPer10k - 3.0) / 10.0));

  // Fiscal distress
  const revenues = metrics.state_revenues || pop * 10;
  const expenditures = metrics.state_expenditures || revenues * 1.02;
  const debt = metrics.public_debt || revenues * 0.5;
  const fiscalRatio = expenditures / Math.max(1, revenues);
  const debtLoad = debt / Math.max(1, revenues);
  const sfd = Math.max(0, Math.min(1, 0.6 * (fiscalRatio - 1.0) + 0.4 * (debtLoad / 2.0)));

  // Mass mobilization potential
  const realWage = metrics.real_wage_index || 1.0;
  const wageStress = Math.max(0, Math.min(1, 1.2 - Math.max(0, Math.min(1, (realWage - 0.8) / 1.2))));
  const urbanRatio = metrics.urbanization || 0.2;
  const mmp = Math.max(0, Math.min(1, 0.5 * urbanRatio + 0.5 * wageStress));

  // Elite mobilization potential
  const conflict = Math.max(0, Math.min(1, (metrics.warfare || 0) / 2.0));
  const emp = Math.max(0, Math.min(1, 0.7 * eliteOverprod + 0.3 * conflict));

  // PSI: composite of the three stress components
  const psi = Math.max(0, Math.min(1, 0.45 * mmp + 0.35 * emp + 0.20 * sfd));

  return { psi, mmp, emp, sfd };
}

// SDT to CHADD mapping (psi_based method)
function sdtToCHADD(sdt: SDTMetrics): { S: number; Q: number; U: number; D: number } {
  const S = Math.max(0, Math.min(1, 1.0 - sdt.psi));
  const Q = Math.max(0, Math.min(1, 1.0 - 0.8 * sdt.psi));
  const U = Math.max(0, Math.min(1, 0.5 * sdt.psi + 0.3 * sdt.emp + 0.2 * sdt.mmp));
  const D = Math.max(0, Math.min(1, 0.4 * sdt.psi + 0.35 * sdt.sfd + 0.25 * sdt.emp));
  return { S, Q, U, D };
}

// Demo polity data with enhanced metrics
const demoPolities: PolityData[] = [
  {
    polity: 'Roman Empire',
    period: '100 BCE - 400 CE',
    startYear: -100,
    endYear: 400,
    squd: { S: 0.65, Q: 0.72, U: 0.58, D: 0.42 },
    sdt: { psi: 0.35, mmp: 0.40, emp: 0.45, sfd: 0.30 },
    health: 58,
    metrics: {
      population: 50_000_000,
      hierarchy: 8,
      inequality: 0.65,
      warfare: 0.45,
      urbanization: 0.25,
      real_wage_index: 0.9,
      state_revenues: 500_000_000,
      state_expenditures: 550_000_000,
      public_debt: 200_000_000,
    },
  },
  {
    polity: 'Han Dynasty',
    period: '200 BCE - 200 CE',
    startYear: -200,
    endYear: 200,
    squd: { S: 0.75, Q: 0.68, U: 0.45, D: 0.32 },
    sdt: { psi: 0.25, mmp: 0.30, emp: 0.35, sfd: 0.20 },
    health: 68,
    metrics: {
      population: 60_000_000,
      hierarchy: 7,
      inequality: 0.55,
      warfare: 0.35,
      urbanization: 0.20,
      real_wage_index: 1.1,
      state_revenues: 600_000_000,
      state_expenditures: 580_000_000,
      public_debt: 150_000_000,
    },
  },
  {
    polity: 'Ottoman Empire',
    period: '1400 - 1800 CE',
    startYear: 1400,
    endYear: 1800,
    squd: { S: 0.58, Q: 0.65, U: 0.62, D: 0.48 },
    sdt: { psi: 0.42, mmp: 0.50, emp: 0.55, sfd: 0.45 },
    health: 52,
    metrics: {
      population: 30_000_000,
      hierarchy: 9,
      inequality: 0.70,
      warfare: 0.50,
      urbanization: 0.15,
      real_wage_index: 0.85,
      state_revenues: 300_000_000,
      state_expenditures: 340_000_000,
      public_debt: 250_000_000,
    },
  },
  {
    polity: 'Mauryan Empire',
    period: '300 - 180 BCE',
    startYear: -300,
    endYear: -180,
    squd: { S: 0.70, Q: 0.60, U: 0.50, D: 0.38 },
    sdt: { psi: 0.30, mmp: 0.35, emp: 0.40, sfd: 0.28 },
    health: 62,
    metrics: {
      population: 50_000_000,
      hierarchy: 6,
      inequality: 0.60,
      warfare: 0.40,
      urbanization: 0.18,
      real_wage_index: 1.0,
      state_revenues: 500_000_000,
      state_expenditures: 510_000_000,
      public_debt: 180_000_000,
    },
  },
];

export default function CliodynamicsDashboard() {
  return <CliodynamicsDashboardContent />;
}

function CliodynamicsDashboardContent() {
  const domain = 'cliodynamics';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [selectedPolities, setSelectedPolities] = useState<string[]>([]);
  const [results, setResults] = useState<Map<string, PolityResult>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chadd2Config, setChadd2Config] = useState<CHADD2OverlayConfig>({
    enabled: false,
    modelType: 'auto',
    fibonacciOverlay: false,
    lambdaFib: 0.0,
    wPhi: 0.0,
  });
  const [showComparison, setShowComparison] = useState(true);

  // Generate time-series data for a polity with secular cycle patterns
  const generateTimeSeriesData = (polity: PolityData): TimeSeriesDataPoint[] => {
    const data: TimeSeriesDataPoint[] = [];
    const years = polity.endYear - polity.startYear;
    const points = Math.min(200, Math.max(50, years)); // Reasonable number of data points
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const year = Math.round(polity.startYear + (polity.endYear - polity.startYear) * progress);
      
      // Simulate secular cycle patterns (2-3 century cycles)
      const cyclePhase = (i / points) * 4 * Math.PI; // Multiple cycles over the period
      const trend = 1 - progress * 0.3; // Gradual decline over time
      
      // Add cyclical variation to SDT metrics
      const baseSDT = { ...polity.sdt };
      const psiVariation = Math.sin(cyclePhase) * 0.15 + Math.cos(cyclePhase * 2) * 0.1;
      const psi = Math.max(0.1, Math.min(0.9, baseSDT.psi * trend + psiVariation));
      
      const mmp = Math.max(0.1, Math.min(0.9, baseSDT.mmp * trend + Math.sin(cyclePhase) * 0.1));
      const emp = Math.max(0.1, Math.min(0.9, baseSDT.emp * trend + Math.cos(cyclePhase) * 0.12));
      const sfd = Math.max(0.1, Math.min(0.9, baseSDT.sfd * trend + Math.sin(cyclePhase * 1.5) * 0.1));
      
      const sdt = { psi, mmp, emp, sfd };
      const squd = sdtToCHADD(sdt);
      
      const timeStr = `${year >= 0 ? year.toString().padStart(4, '0') : `-${Math.abs(year).toString().padStart(4, '0')}`}-01-01T00:00:00Z`;
      
      data.push({
        timestamp: timeStr,
        year,
        S: Math.round(squd.S * 1000) / 1000,
        Q: Math.round(squd.Q * 1000) / 1000,
        U: Math.round(squd.U * 1000) / 1000,
        D: Math.round(squd.D * 1000) / 1000,
        PSI: Math.round(psi * 1000) / 1000,
        MMP: Math.round(mmp * 1000) / 1000,
        EMP: Math.round(emp * 1000) / 1000,
        SFD: Math.round(sfd * 1000) / 1000,
      });
    }
    
    return data;
  };

  const handleAnalyzePolities = async () => {
    if (selectedPolities.length === 0) {
      setError('Please select at least one polity to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    const newResults = new Map<string, PolityResult>();

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      for (const polityName of selectedPolities) {
        const polity = demoPolities.find(p => p.polity === polityName);
        if (!polity) continue;

        const timeSeries = generateTimeSeriesData(polity);
        
        // Calculate mean metrics
        const meanMetrics = {
          S: timeSeries.reduce((sum, d) => sum + d.S, 0) / timeSeries.length,
          Q: timeSeries.reduce((sum, d) => sum + d.Q, 0) / timeSeries.length,
          U: timeSeries.reduce((sum, d) => sum + d.U, 0) / timeSeries.length,
          D: timeSeries.reduce((sum, d) => sum + d.D, 0) / timeSeries.length,
          PSI: timeSeries.reduce((sum, d) => sum + d.PSI, 0) / timeSeries.length,
          MMP: timeSeries.reduce((sum, d) => sum + d.MMP, 0) / timeSeries.length,
          EMP: timeSeries.reduce((sum, d) => sum + d.EMP, 0) / timeSeries.length,
          SFD: timeSeries.reduce((sum, d) => sum + d.SFD, 0) / timeSeries.length,
        };

        newResults.set(polityName, {
          polity: polity.polity,
          period: polity.period,
          timeSeries,
          meanMetrics,
        });
      }

      setResults(newResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // Toggle polity selection
  const togglePolity = (polityName: string) => {
    setSelectedPolities(prev => {
      if (prev.includes(polityName)) {
        return prev.filter(p => p !== polityName);
      } else {
        return [...prev, polityName].slice(0, 6); // Max 6 polities
      }
    });
  };

  // Calculate comparison summary
  const comparisonSummary = useMemo(() => {
    if (results.size === 0) return null;
    
    const summary = Array.from(results.values()).map(result => ({
      polity: result.polity,
      period: result.period,
      ...result.meanMetrics,
      health: (1 - result.meanMetrics.D) * 100,
    }));
    
    return summary;
  }, [results]);

  const actions: DashboardAction[] = [
    {
      id: 'analyze',
      label: loading ? 'Analyzing...' : 'Analyze Selected Polities',
      icon: '▶️',
      onClick: handleAnalyzePolities,
      variant: 'primary' as const,
      disabled: loading || selectedPolities.length === 0,
    },
    {
      id: 'clear',
      label: 'Clear Selection',
      icon: '🗑️',
      onClick: () => {
        setSelectedPolities([]);
        setResults(new Map());
      },
      variant: 'secondary' as const,
      disabled: loading || selectedPolities.length === 0,
    },
  ];

  const sections = {
    header: true,
    metrics: false, // We'll show custom metrics
    telemetry: false,
    charts: true,
    aiInterpretation: false,
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
    >
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Polity Selection */}
      <DashboardSection title="Select Civilizations/Polities for Comparison" icon="🏛️">
        <p className="text-sm text-gray-600 mb-4">
          Select one or more polities (up to 6) to compare structural-demographic patterns, PSI trajectories, and secular cycles.
        </p>
        <DashboardGrid cols={2} gap="md">
          {demoPolities.map((polity) => {
            const isSelected = selectedPolities.includes(polity.polity);
            return (
              <button
                key={polity.polity}
                onClick={() => togglePolity(polity.polity)}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
                disabled={loading}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-gray-900">{polity.polity}</h3>
                      {isSelected && <span className="text-primary-600">✓</span>}
                    </div>
                    <p className="text-sm text-gray-500">{polity.period}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Health</div>
                    <div className={`text-2xl font-bold ${
                      polity.health >= 60 ? 'text-success-600' : 
                      polity.health >= 50 ? 'text-warning-600' : 
                      'text-danger-600'
                    }`}>
                      {polity.health}%
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mt-3 pt-3 border-t border-gray-200">
                  <div>
                    <span className="text-gray-500">Population:</span>
                    <div className="font-semibold">{(polity.metrics.population / 1_000_000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <span className="text-gray-500">PSI:</span>
                    <div className="font-semibold">{(polity.sdt.psi * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Hierarchy:</span>
                    <div className="font-semibold">{polity.metrics.hierarchy}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </DashboardGrid>
        {selectedPolities.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Selected: {selectedPolities.join(', ')} ({selectedPolities.length} of {demoPolities.length})
          </div>
        )}
      </DashboardSection>

      {/* Analysis Results */}
      {results.size > 0 && (
        <>
          {/* Cross-Polity Comparison Table */}
          {showComparison && comparisonSummary && (
            <DashboardSection title="Cross-Polity Comparison" icon="📊">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Polity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PSI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MMP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        EMP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SFD
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Health
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparisonSummary.map((row) => (
                      <tr key={row.polity}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.polity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.S.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.Q.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.U.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.D.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {row.PSI.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.MMP.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.EMP.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.SFD.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-semibold ${
                            row.health >= 60 ? 'text-success-600' :
                            row.health >= 50 ? 'text-warning-600' :
                            'text-danger-600'
                          }`}>
                            {row.health.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DashboardSection>
          )}

          {/* Individual Polity Analysis */}
          {Array.from(results.values()).map((result) => {
            const polity = demoPolities.find(p => p.polity === result.polity);
            if (!polity) return null;

            return (
              <div key={result.polity} className="space-y-6">
                {/* Polity Header with Metrics */}
                <DashboardSection title={`${result.polity} Analysis (${result.period})`} icon="📊">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CHADD Metrics */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">CHADD/SDT Metrics</h4>
                      <MetricsCard
                        squd={{
                          S: result.meanMetrics.S,
                          Q: result.meanMetrics.Q,
                          U: result.meanMetrics.U,
                          D: result.meanMetrics.D,
                        }}
                        health={(1 - result.meanMetrics.D) * 100}
                        title=""
                        domain={domain}
                      />
                    </div>

                    {/* SDT Metrics */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">SDT (Structural-Demographic Theory) Metrics</h4>
                      <DashboardGrid cols={2} gap="sm">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-1">PSI</div>
                          <div className="text-xl font-bold text-red-700">
                            {(result.meanMetrics.PSI * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Political Stress</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-1">MMP</div>
                          <div className="text-xl font-bold text-orange-700">
                            {(result.meanMetrics.MMP * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Mass Mobilization</div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-1">EMP</div>
                          <div className="text-xl font-bold text-yellow-700">
                            {(result.meanMetrics.EMP * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Elite Mobilization</div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-1">SFD</div>
                          <div className="text-xl font-bold text-purple-700">
                            {(result.meanMetrics.SFD * 100).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Fiscal Distress</div>
                        </div>
                      </DashboardGrid>
                    </div>
                  </div>
                </DashboardSection>

                {/* PSI Trajectory Chart */}
                <DashboardSection title="Political Stress Indicator (PSI) Trajectory" icon="📈">
                  <TimeSeriesChart
                    data={result.timeSeries as unknown as Array<Record<string, unknown>>}
                    lines={[
                      { key: 'PSI', name: 'PSI (Political Stress Indicator)', color: '#ef4444' },
                    ]}
                    title="PSI Over Time"
                    height={300}
                  />
                </DashboardSection>

                {/* CHADD Metrics Time Series */}
                <DashboardSection title="CHADD Metrics Over Time" icon="📉">
                  <TimeSeriesChart
                    data={result.timeSeries as unknown as Array<Record<string, unknown>>}
                    lines={[
                      { key: 'S', name: domainLabels.getSQUDLabel('S'), color: '#3b82f6' },
                      { key: 'Q', name: domainLabels.getSQUDLabel('Q'), color: '#10b981' },
                      { key: 'U', name: domainLabels.getSQUDLabel('U'), color: '#f59e0b' },
                      { key: 'D', name: domainLabels.getSQUDLabel('D'), color: '#ef4444' },
                    ]}
                    title="S/Q/U/D Metrics Over Time"
                    height={400}
                  />
                </DashboardSection>

                {/* SDT Metrics Time Series */}
                <DashboardSection title="SDT Metrics Over Time" icon="📊">
                  <TimeSeriesChart
                    data={result.timeSeries as unknown as Array<Record<string, unknown>>}
                    lines={[
                      { key: 'PSI', name: 'PSI', color: '#ef4444' },
                      { key: 'MMP', name: 'MMP (Mass Mobilization Potential)', color: '#f97316' },
                      { key: 'EMP', name: 'EMP (Elite Mobilization Potential)', color: '#eab308' },
                      { key: 'SFD', name: 'SFD (State Fiscal Distress)', color: '#a855f7' },
                    ]}
                    title="SDT Metrics Over Time"
                    height={400}
                  />
                </DashboardSection>
              </div>
            );
          })}
        </>
      )}

      {/* Empty State */}
      {results.size === 0 && !loading && (
        <DashboardSection title="Get Started" icon="🚀">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Select one or more civilizations/polities above and click "Analyze Selected Polities"
            </p>
            <p className="text-gray-400 text-sm">
              Analyze historical patterns, secular cycles, PSI trajectories, and structural-demographic dynamics using the CHADD/SDT framework
            </p>
          </div>
        </DashboardSection>
      )}
    </DashboardTemplate>
  );
}
