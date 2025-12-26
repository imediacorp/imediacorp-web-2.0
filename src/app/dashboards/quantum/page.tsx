/**
 * Quantum Computing Dashboard Page
 * Comprehensive dashboard for quantum qubit monitoring, gate fidelity, and coherence tracking
 */

'use client';

import React, { useState } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection } from '@/components/dashboard/template/DashboardSection';
import { DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { MaintenanceRecommendations } from '@/components/dashboard/MaintenanceRecommendations';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { useDomainLabels } from '@/hooks/useDomainTerminology';
import { quantumApi } from '@/lib/api/quantum';
import { aiApi } from '@/lib/api/ai';
import type {
  QuantumTelemetry,
  QuantumAssessmentResponse,
  QuantumTimeSeriesData,
} from '@/types/quantum';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function QuantumDashboard() {
  return <QuantumDashboardContent />;
}

function QuantumDashboardContent() {
  const domain = 'quantum';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [assetId] = useState('demo-qubit-1');
  const [assessment, setAssessment] = useState<QuantumAssessmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiInterpretation, setAIInterpretation] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [enableAI, setEnableAI] = useState(true);
  const [chadd2Config, setChadd2Config] = useState<CHADD2OverlayConfig>({
    enabled: false,
    modelType: 'auto',
    fibonacciOverlay: false,
    lambdaFib: 0.0,
    wPhi: 0.0,
  });

  // Demo telemetry data
  const [demoTelemetry] = useState<QuantumTelemetry>({
    fidelity: 0.96,
    t1: 100.0, // microseconds
    t2: 80.0, // microseconds
    noise: 0.01,
    crosstalk: 0.02,
    qubit_id: 'qubit-1',
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): QuantumTimeSeriesData[] => {
    const data: QuantumTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    const n = 100;

    // Demo parameters
    const t1True = 100.0;
    const t2True = 80.0;
    const fidelityBase = 0.96;

    for (let i = 0; i < n; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals

      // Simulate realistic quantum variations
      const t = i / 20;
      const fidelity = fidelityBase + Math.sin(t) * 0.02 + (Math.random() - 0.5) * 0.01;
      const t1 = t1True + Math.sin(t * 0.5) * 5 + (Math.random() - 0.5) * 2;
      const t2 = t2True + Math.sin(t * 0.5) * 4 + (Math.random() - 0.5) * 1.5;
      const noise = 0.01 + Math.abs(Math.sin(t * 2)) * 0.005 + Math.random() * 0.002;
      const crosstalk = 0.02 + Math.abs(Math.sin(t * 1.5)) * 0.01 + Math.random() * 0.005;

      // Calculate S/Q/U/D (simplified)
      const t1Norm = Math.max(0, Math.min(1, (t1 - 10) / 990));
      const t2Norm = Math.max(0, Math.min(1, (t2 - 5) / 495));
      const coherence = (t1Norm + t2Norm) / 2;
      const S = Math.max(0, Math.min(1, 0.4 * coherence + 0.4 * fidelity + 0.2 * fidelity));

      const fidVar = 1.0 - fidelity;
      const Q = Math.max(0, Math.min(1, 0.7 * fidVar + 0.3 * (1.0 - fidelity)));

      const noiseNorm = Math.min(1, noise / 0.1);
      const crosstalkNorm = Math.min(1, crosstalk / 0.1);
      const U = Math.max(0, Math.min(1, 0.6 * noiseNorm + 0.4 * crosstalkNorm));

      const D = 1 / (1 + Math.exp(-(S - U)));
      const D_clipped = Math.max(0, Math.min(1, D));

      const lowFidelity = fidelity < 0.95 ? 1 : 0;

      data.push({
        timestamp: time.toISOString(),
        fidelity: Math.max(0, Math.min(1, fidelity)),
        t1: Math.max(0, t1),
        t2: Math.max(0, t2),
        noise: Math.max(0, noise),
        crosstalk: Math.max(0, Math.min(1, crosstalk)),
        S,
        Q,
        U,
        D: D_clipped,
        low_fidelity: lowFidelity,
      });
    }

    return data;
  };

  const [timeSeriesData] = useState<QuantumTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await quantumApi.assessAsset({
        asset_id: assetId,
        telemetry: demoTelemetry,
        config: {
          fidelity_threshold: 0.95,
          t1_nominal: 100.0,
          t2_nominal: 80.0,
          noise_threshold: 0.05,
          crosstalk_threshold: 0.05,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'quantum',
            metrics: {
              fidelity: demoTelemetry.fidelity,
              t1: demoTelemetry.t1,
              t2: demoTelemetry.t2,
              noise: demoTelemetry.noise,
              crosstalk: demoTelemetry.crosstalk,
            },
            squd_means: {
              S: result.squd_score.S,
              Q: result.squd_score.Q,
              U: result.squd_score.U,
              D: result.squd_score.D,
            },
          });
          
          if (aiResult.text) {
            setAIInterpretation(aiResult.text);
          }
        } catch (aiError) {
          console.error('AI interpretation failed:', aiError);
        } finally {
          setAILoading(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assessment failed');
    } finally {
      setLoading(false);
    }
  };

  // Generate maintenance recommendations
  const getMaintenanceRecommendations = () => {
    if (!assessment) return [];
    
    const recommendations = (assessment.recommendations || []).map(rec => ({
      component: 'Quantum Qubit',
      severity: assessment.health < 70 ? 'critical' as const :
                assessment.health < 85 ? 'high' as const :
                assessment.gate_fidelity_avg && assessment.gate_fidelity_avg < 0.95 ? 'medium' as const :
                'low' as const,
      message: rec,
      action: rec.includes('immediate') || rec.includes('Critical') || rec.includes('Low') ? 'Take immediate action' :
              rec.includes('check') || rec.includes('investigate') ? 'Investigate and monitor' : 'Continue monitoring',
    }));
    
    return recommendations;
  };

  const actions = [
    {
      id: 'assess',
      label: 'Run Assessment',
      icon: '▶️',
      onClick: handleAssess,
      variant: 'primary' as const,
      disabled: loading,
    },
  ];

  const sections = {
    header: true,
    metrics: true,
    telemetry: true,
    charts: true,
    aiInterpretation: true,
    maintenance: true,
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Assessment Results - S/Q/U/D Metrics */}
      {assessment && (
        <>
          <MetricsCard
            squd={assessment.squd_score}
            health={assessment.health}
            domain={domain}
            title={`${domainLabels.terminology.healthLabel} Assessment (${domainLabels.getFrameworkName()} Framework)`}
          />

          {/* Quantum Metrics */}
          {assessment.qubit_metrics && (
            <DashboardSection title="Qubit Metrics" variant="card">
              <DashboardGrid cols={3} gap="md">
                {assessment.qubit_metrics.fidelity_mean !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Gate Fidelity (Mean)</div>
                    <div className={`text-2xl font-bold ${
                      (assessment.qubit_metrics.fidelity_mean || 0) >= 0.95 ? 'text-success-600' :
                      (assessment.qubit_metrics.fidelity_mean || 0) >= 0.90 ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {((assessment.qubit_metrics.fidelity_mean || 0) * 100).toFixed(2)}%
                    </div>
                  </div>
                )}
                {assessment.qubit_metrics.fidelity_min !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Gate Fidelity (Min)</div>
                    <div className={`text-2xl font-bold ${
                      (assessment.qubit_metrics.fidelity_min || 0) >= 0.95 ? 'text-success-600' :
                      (assessment.qubit_metrics.fidelity_min || 0) >= 0.90 ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {((assessment.qubit_metrics.fidelity_min || 0) * 100).toFixed(2)}%
                    </div>
                  </div>
                )}
                {assessment.qubit_metrics.fidelity_std !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Fidelity Std Dev</div>
                    <div className={`text-2xl font-bold ${
                      (assessment.qubit_metrics.fidelity_std || 0) < 0.01 ? 'text-success-600' :
                      (assessment.qubit_metrics.fidelity_std || 0) < 0.02 ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {((assessment.qubit_metrics.fidelity_std || 0) * 100).toFixed(3)}%
                    </div>
                  </div>
                )}
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* Coherence Metrics */}
          {(assessment.qubit_metrics?.t1_mean || assessment.qubit_metrics?.t2_mean) && (
            <DashboardSection title="Coherence Times" variant="card">
              <DashboardGrid cols={2} gap="md">
                {assessment.qubit_metrics.t1_mean !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">T1 Coherence Time</div>
                    <div className={`text-2xl font-bold ${
                      (assessment.qubit_metrics.t1_mean || 0) >= 80 ? 'text-success-600' :
                      (assessment.qubit_metrics.t1_mean || 0) >= 50 ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {(assessment.qubit_metrics.t1_mean || 0).toFixed(1)} μs
                    </div>
                  </div>
                )}
                {assessment.qubit_metrics.t2_mean !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">T2 Coherence Time</div>
                    <div className={`text-2xl font-bold ${
                      (assessment.qubit_metrics.t2_mean || 0) >= 60 ? 'text-success-600' :
                      (assessment.qubit_metrics.t2_mean || 0) >= 40 ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {(assessment.qubit_metrics.t2_mean || 0).toFixed(1)} μs
                    </div>
                  </div>
                )}
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* Noise & Crosstalk Metrics */}
          {(assessment.qubit_metrics?.noise_mean || assessment.qubit_metrics?.crosstalk_mean) && (
            <DashboardSection title="Noise & Crosstalk" variant="card">
              <DashboardGrid cols={2} gap="md">
                {assessment.qubit_metrics.noise_mean !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Noise Level</div>
                    <div className={`text-2xl font-bold ${
                      (assessment.qubit_metrics.noise_mean || 0) < 0.02 ? 'text-success-600' :
                      (assessment.qubit_metrics.noise_mean || 0) < 0.05 ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {((assessment.qubit_metrics.noise_mean || 0) * 100).toFixed(3)}%
                    </div>
                  </div>
                )}
                {assessment.qubit_metrics.crosstalk_mean !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Crosstalk</div>
                    <div className={`text-2xl font-bold ${
                      (assessment.qubit_metrics.crosstalk_mean || 0) < 0.03 ? 'text-success-600' :
                      (assessment.qubit_metrics.crosstalk_mean || 0) < 0.05 ? 'text-warning-600' :
                      'text-danger-600'
                    }`}>
                      {((assessment.qubit_metrics.crosstalk_mean || 0) * 100).toFixed(3)}%
                    </div>
                  </div>
                )}
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* Coherence Quality */}
          {assessment.coherence_quality !== undefined && (
            <DashboardSection title="Coherence Quality" variant="card">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Overall Coherence Quality</div>
                <div className={`text-2xl font-bold ${
                  (assessment.coherence_quality || 0) >= 0.8 ? 'text-success-600' :
                  (assessment.coherence_quality || 0) >= 0.6 ? 'text-warning-600' :
                  'text-danger-600'
                }`}>
                  {((assessment.coherence_quality || 0) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Based on T1/T2 coherence times
                </div>
              </div>
            </DashboardSection>
          )}

          {/* Low Fidelity Alert */}
          {assessment.gate_fidelity_avg !== undefined && assessment.gate_fidelity_avg < 0.95 && (
            <DashboardSection variant="card" className="bg-warning-50 border-warning-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-semibold text-warning-900">Low Gate Fidelity Detected</div>
                  <div className="text-sm text-warning-700">
                    Gate fidelity ({((assessment.gate_fidelity_avg || 0) * 100).toFixed(2)}%) is below recommended threshold (95%) - investigate gate calibration and noise sources
                  </div>
                </div>
              </div>
            </DashboardSection>
          )}
        </>
      )}

      {/* Current Telemetry Display */}
      <DashboardSection title="Current Telemetry" variant="card">
        <DashboardGrid cols={4} gap="md">
          <div>
            <div className="text-sm text-gray-500 mb-1">Gate Fidelity</div>
            <div className={`text-2xl font-semibold ${
              (demoTelemetry.fidelity || 0) >= 0.95 ? 'text-success-600' :
              (demoTelemetry.fidelity || 0) >= 0.90 ? 'text-warning-600' :
              'text-danger-600'
            }`}>
              {((demoTelemetry.fidelity || 0) * 100).toFixed(2)}%
            </div>
          </div>
          {demoTelemetry.t1 !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">T1 Coherence</div>
              <div className="text-2xl font-semibold">{demoTelemetry.t1.toFixed(1)} μs</div>
            </div>
          )}
          {demoTelemetry.t2 !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">T2 Coherence</div>
              <div className="text-2xl font-semibold">{demoTelemetry.t2.toFixed(1)} μs</div>
            </div>
          )}
          {demoTelemetry.noise !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Noise Level</div>
              <div className="text-2xl font-semibold">{((demoTelemetry.noise || 0) * 100).toFixed(3)}%</div>
            </div>
          )}
          {demoTelemetry.crosstalk !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Crosstalk</div>
              <div className="text-2xl font-semibold">{((demoTelemetry.crosstalk || 0) * 100).toFixed(3)}%</div>
            </div>
          )}
        </DashboardGrid>
      </DashboardSection>

      {/* Time Series Charts */}
      {timeSeriesData.length > 0 && (
        <DashboardSection title="Analysis - Time Series" variant="card">
          <div className="space-y-6">
            {/* S/Q/U/D Time Series */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'S', name: domainLabels.getSQUDLabel('S'), color: '#10b981' },
                { key: 'Q', name: domainLabels.getSQUDLabel('Q'), color: '#f59e0b' },
                { key: 'U', name: domainLabels.getSQUDLabel('U'), color: '#ef4444' },
                { key: 'D', name: domainLabels.getSQUDLabel('D'), color: '#3b82f6' },
              ]}
              title="S/Q/U/D Metrics Over Time"
              height={400}
            />

            {/* Gate Fidelity Time Series */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'fidelity', name: 'Gate Fidelity', color: '#3b82f6' },
              ]}
              title="Gate Fidelity Over Time"
              height={400}
            />

            {/* T1/T2 Coherence Times */}
            {timeSeriesData[0]?.t1 !== undefined && timeSeriesData[0]?.t2 !== undefined && (
              <TimeSeriesChart
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[
                  { key: 't1', name: 'T1 Coherence (μs)', color: '#10b981' },
                  { key: 't2', name: 'T2 Coherence (μs)', color: '#8b5cf6' },
                ]}
                title="T1/T2 Coherence Times"
                height={400}
              />
            )}

            {/* Noise & Crosstalk */}
            {timeSeriesData[0]?.noise !== undefined && timeSeriesData[0]?.crosstalk !== undefined && (
              <TimeSeriesChart
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[
                  { key: 'noise', name: 'Noise Level', color: '#f59e0b' },
                  { key: 'crosstalk', name: 'Crosstalk', color: '#ef4444' },
                ]}
                title="Noise & Crosstalk Over Time"
                height={400}
              />
            )}
          </div>
        </DashboardSection>
      )}

      {/* AI Interpretation */}
      <AIInterpretationCard
        interpretation={aiInterpretation}
        loading={aiLoading}
        error={null}
      />

      {/* Maintenance Recommendations */}
      {assessment && (
        <MaintenanceRecommendations
          recommendations={getMaintenanceRecommendations()}
          componentHealth={undefined}
        />
      )}
    </DashboardTemplate>
  );
}

