/**
 * Aerospace Dashboard Page
 * Comprehensive dashboard using template system with domain-specific terminology
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
import { aerospaceApi } from '@/lib/api/aerospace';
import { aiApi } from '@/lib/api/ai';
import type {
  AerospaceTelemetry,
  AerospaceAssessmentResponse,
  AerospaceTimeSeriesData,
} from '@/types/aerospace';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function AerospaceDashboard() {
  return <AerospaceDashboardContent />;
}

function AerospaceDashboardContent() {
  const domain = 'aerospace';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [assetId] = useState('demo-uav-radar-1');
  const [assessment, setAssessment] = useState<AerospaceAssessmentResponse | null>(null);
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
  const [demoTelemetry] = useState<AerospaceTelemetry>({
    signal: 5.0, // Signal amplitude
    snr: 15.0, // dB
    drift: 0.01,
    noise: 0.5,
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): AerospaceTimeSeriesData[] => {
    const data: AerospaceTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    const np = 100;
    
    // Base signal with noise
    let signalBase = 5.0;
    let snrBase = 15.0;
    let noiseBase = 0.5;
    let driftBase = 0.01;
    
    for (let i = 0; i < np; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      
      // Simulate signal variations with occasional anomalies
      const t = i / np;
      const signalVariation = Math.sin(t * Math.PI * 4) * 0.5 + Math.random() * 0.3;
      const signal = signalBase + signalVariation;
      
      // SNR varies with signal strength and noise
      const noiseVariation = Math.abs(Math.sin(t * Math.PI * 3)) * 0.3 + Math.random() * 0.2;
      const noise = Math.max(0.1, noiseBase + noiseVariation);
      const snr = signal / noise * 10; // Convert to dB scale (simplified)
      
      // Drift accumulation
      const drift = driftBase + (i * 0.0001);
      
      // Anomaly detection (z-score based)
      const signalMean = signalBase;
      const signalStd = 0.5;
      const zScore = (signal - signalMean) / signalStd;
      const anomaly = Math.abs(zScore) > 3.0 ? 1 : 0;
      
      // Calculate S/Q/U/D (based on aerospace domain mapping)
      // S (Stability): signal stability, SNR, drift penalty
      const signalStability = Math.max(0.0, Math.min(1.0, 1.0 - (noise / 2.0)));
      const snrContrib = Math.max(0.0, Math.min(1.0, (snr + 10.0) / 30.0));
      const driftPenalty = Math.min(1.0, Math.abs(drift) * 20.0);
      const S = Math.max(0.0, Math.min(1.0, 0.5 * signalStability + 0.3 * snrContrib - 0.2 * driftPenalty));
      
      // Q (Coherence/Quality Pressure): signal coherence, tracking precision (higher is worse)
      const coherence = Math.max(0.0, Math.min(1.0, 1.0 - (noise / 1.5)));
      const precision = Math.max(0.0, Math.min(1.0, 1.0 - (noise / 2.0)));
      const Q = Math.max(0.0, Math.min(1.0, 0.6 * (1.0 - coherence) + 0.4 * (1.0 - precision)));
      
      // U (Susceptibility/Effort): noise levels, processing load (higher is worse)
      const noisePressure = Math.min(1.0, noise / 2.0);
      const loadProxy = Math.min(1.0, noise / 1.5);
      const U = Math.max(0.0, Math.min(1.0, 0.7 * noisePressure + 0.3 * loadProxy));
      
      // D (Diagnostic): CHADD formula
      const D = 1.0 / (1.0 + Math.exp(-(S - U)));
      const D_clamped = Math.max(0.0, Math.min(1.0, D));
      
      data.push({
        timestamp: time.toISOString(),
        signal,
        snr,
        drift,
        noise,
        anomaly,
        z_score: zScore,
        S,
        Q,
        U,
        D: D_clamped,
      });
    }
    
    return data;
  };

  const [timeSeriesData] = useState<AerospaceTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await aerospaceApi.assessAsset({
        asset_id: assetId,
        telemetry: demoTelemetry,
        config: {
          asset_type: 'UAV Radar',
          z_threshold: 3.0,
          signal_quality_threshold: 0.7,
          snr_threshold: 10.0,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'aerospace',
            metrics: {
              signal: demoTelemetry.signal,
              snr: demoTelemetry.snr,
              drift: demoTelemetry.drift,
              noise: demoTelemetry.noise,
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
      component: 'Aerospace System',
      severity: assessment.anomaly_detected ? 'high' as const :
                assessment.status === 'warn' ? 'medium' as const : 'low' as const,
      message: rec,
      action: rec.includes('investigate') || rec.includes('recalibrate') ? 'Take immediate action' :
              rec.includes('monitor') ? 'Schedule inspection' :
              'Continue monitoring',
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

          {/* Component Health */}
          {assessment.component_health && (
            <DashboardSection title="Component Health" variant="card">
              <DashboardGrid cols={4} gap="md">
                {Object.entries(assessment.component_health).map(([component, health]) => (
                  <div key={component} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 capitalize mb-1">
                      {component.replace(/_/g, ' ')}
                    </div>
                    <div className={`text-2xl font-bold ${
                      health >= 80 ? 'text-success-600' : health >= 60 ? 'text-warning-600' : 'text-danger-600'
                    }`}>
                      {health}%
                    </div>
                  </div>
                ))}
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* Signal Status Indicators */}
          <DashboardSection title="Signal Status" variant="card">
            <DashboardGrid cols={4} gap="md">
              <div className={`p-4 rounded-lg border-2 ${
                assessment.status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Overall Status</div>
                <div className="text-lg font-semibold">
                  {assessment.anomaly_detected ? 'Anomaly Detected' : 'Normal'}
                </div>
                <div className={`text-xs mt-1 ${
                  assessment.status === 'normal' ? 'text-success-700' :
                  assessment.status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.status?.toUpperCase() || 'NORMAL'}
                </div>
              </div>

              <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
                <div className="text-sm font-medium text-gray-700 mb-1">Signal Quality</div>
                <div className="text-lg font-semibold">
                  {assessment.signal_quality ? (assessment.signal_quality * 100).toFixed(1) + '%' : 'N/A'}
                </div>
                <div className={`text-xs mt-1 ${
                  (assessment.signal_quality || 0) > 0.8 ? 'text-success-700' :
                  (assessment.signal_quality || 0) > 0.6 ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {(assessment.signal_quality || 0) > 0.8 ? 'OPTIMAL' :
                   (assessment.signal_quality || 0) > 0.6 ? 'ACCEPTABLE' : 'LOW'}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                !assessment.anomaly_detected ? 'border-success-300 bg-success-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Anomaly Detection</div>
                <div className="text-lg font-semibold">
                  {assessment.anomaly_detected ? 'Detected' : 'None'}
                </div>
                <div className={`text-xs mt-1 ${
                  !assessment.anomaly_detected ? 'text-success-700' : 'text-danger-700'
                }`}>
                  {assessment.anomaly_detected ? 'ALERT' : 'CLEAR'}
                </div>
              </div>

              <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
                <div className="text-sm font-medium text-gray-700 mb-1">Health Score</div>
                <div className={`text-lg font-semibold ${
                  assessment.health >= 80 ? 'text-success-600' :
                  assessment.health >= 60 ? 'text-warning-600' :
                  'text-danger-600'
                }`}>
                  {assessment.health}%
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  SYSTEM HEALTH
                </div>
              </div>
            </DashboardGrid>
          </DashboardSection>

          {/* Anomaly Alert */}
          {assessment.anomaly_detected && (
            <DashboardSection variant="card" className="bg-danger-50 border-danger-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-semibold text-danger-900">Anomaly Detected</div>
                  <div className="text-sm text-danger-700">
                    Signal anomaly detected - investigate signal source, interference, or sensor calibration
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
            <div className="text-sm text-gray-500 mb-1">Signal Amplitude</div>
            <div className="text-2xl font-semibold">{demoTelemetry.signal.toFixed(2)}</div>
          </div>
          {demoTelemetry.snr !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">SNR</div>
              <div className="text-2xl font-semibold">{demoTelemetry.snr.toFixed(1)} dB</div>
            </div>
          )}
          {demoTelemetry.drift !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Drift</div>
              <div className="text-2xl font-semibold">{demoTelemetry.drift.toFixed(3)}</div>
            </div>
          )}
          {demoTelemetry.noise !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Noise</div>
              <div className="text-2xl font-semibold">{demoTelemetry.noise.toFixed(2)}</div>
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

            {/* Signal and SNR Time Series */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'signal', name: 'Signal Amplitude', color: '#3b82f6' },
                { key: 'snr', name: 'SNR (dB)', color: '#10b981' },
              ]}
              title="Signal & SNR Over Time"
              height={400}
            />

            {/* Noise and Drift Time Series */}
            {timeSeriesData[0]?.noise !== undefined && timeSeriesData[0]?.drift !== undefined && (
              <TimeSeriesChart
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[
                  { key: 'noise', name: 'Noise Level', color: '#ef4444' },
                  { key: 'drift', name: 'Signal Drift', color: '#f59e0b' },
                ]}
                title="Noise & Drift Over Time"
                height={400}
              />
            )}

            {/* Anomaly Detection Time Series */}
            {timeSeriesData[0]?.anomaly !== undefined && (
              <TimeSeriesChart
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[
                  { key: 'z_score', name: 'Z-Score', color: '#8b5cf6' },
                  { key: 'anomaly', name: 'Anomaly (binary)', color: '#ef4444' },
                ]}
                title="Anomaly Detection (Z-Score)"
                height={300}
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
          componentHealth={assessment.component_health}
        />
      )}
    </DashboardTemplate>
  );
}

