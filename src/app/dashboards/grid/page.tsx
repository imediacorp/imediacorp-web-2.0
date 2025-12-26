/**
 * Grid/Substation Dashboard Page
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
import { gridApi } from '@/lib/api/grid';
import { aiApi } from '@/lib/api/ai';
import type {
  GridTelemetry,
  GridAssessmentResponse,
  GridTimeSeriesData,
} from '@/types/grid';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function GridDashboard() {
  return <GridDashboardContent />;
}

function GridDashboardContent() {
  const domain = 'grid';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [substationId] = useState('demo-substation-1');
  const [assessment, setAssessment] = useState<GridAssessmentResponse | null>(null);
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
  const [demoTelemetry] = useState<GridTelemetry>({
    voltage: 13.85, // kV
    frequency: 60.02, // Hz
    power_flow: 85.5, // MW
    transformer_temp: 72.3, // °C
    current: 6200, // A
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): GridTimeSeriesData[] => {
    const data: GridTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    const voltageNominal = 13.8;
    const frequencyNominal = 60.0;
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      // Simulate realistic grid variations
      const voltage = voltageNominal + Math.sin(i / 20) * 0.3 + Math.random() * 0.2;
      const frequency = frequencyNominal + Math.sin(i / 30) * 0.05 + Math.random() * 0.03;
      const powerFlow = 80 + Math.sin(i / 15) * 15 + Math.random() * 5;
      const transformerTemp = 70 + Math.sin(i / 25) * 8 + Math.random() * 3;
      
      // Calculate S/Q/U/D (simplified)
      const voltageDeviation = Math.abs((voltage - voltageNominal) / voltageNominal * 100);
      const frequencyDeviation = Math.abs(frequency - frequencyNominal);
      
      const S = (voltageDeviation < 2 && frequencyDeviation < 0.05) ? 0.85 :
               (voltageDeviation < 5 && frequencyDeviation < 0.1) ? 0.65 : 0.45;
      const powerQualityIndex = 100 - Math.min(100, (voltageDeviation * 2 + frequencyDeviation * 50));
      const Q = powerQualityIndex > 95 ? 0.25 : powerQualityIndex > 90 ? 0.45 : 0.65;
      const loadFactor = Math.min(1.0, powerFlow / 100);
      const tempFactor = Math.min(1.0, transformerTemp / 85);
      const U = (loadFactor * 0.6 + tempFactor * 0.4);
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
      
      data.push({
        timestamp: time.toISOString(),
        voltage,
        frequency,
        power_flow: powerFlow,
        transformer_temp: transformerTemp,
        S,
        Q,
        U,
        D,
      });
    }
    
    return data;
  };

  const [timeSeriesData] = useState<GridTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await gridApi.assessSubstation({
        substation_id: substationId,
        telemetry: demoTelemetry,
        config: {
          voltage_nominal: 13.8,
          voltage_tolerance: 5.0,
          frequency_nominal: 60.0,
          frequency_tolerance: 0.1,
          transformer_temp_max: 85.0,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'grid',
            metrics: {
              voltage: demoTelemetry.voltage,
              frequency: demoTelemetry.frequency,
              power_flow: demoTelemetry.power_flow,
              transformer_temp: demoTelemetry.transformer_temp,
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
    
    const recommendations = assessment.recommendations.map(rec => ({
      component: 'Grid/Substation',
      severity: assessment.outage_detected ? 'critical' as const :
                assessment.voltage_status === 'alarm' || assessment.frequency_status === 'alarm' ? 'high' as const :
                'medium' as const,
      message: rec,
      action: rec.includes('immediate') || rec.includes('Critical') ? 'Take immediate action' :
              rec.includes('monitor') ? 'Monitor and plan maintenance' : 'Continue monitoring',
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

          {/* Grid Metrics */}
          {assessment.grid_metrics && (
            <DashboardSection title="Grid Quality Metrics" variant="card">
              <DashboardGrid cols={3} gap="md">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Voltage Deviation</div>
                  <div className={`text-2xl font-bold ${
                    (assessment.grid_metrics.voltage_deviation || 0) < 2 ? 'text-success-600' :
                    (assessment.grid_metrics.voltage_deviation || 0) < 5 ? 'text-warning-600' :
                    'text-danger-600'
                  }`}>
                    {(assessment.grid_metrics.voltage_deviation || 0).toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Frequency Deviation</div>
                  <div className={`text-2xl font-bold ${
                    (assessment.grid_metrics.frequency_deviation || 0) < 0.05 ? 'text-success-600' :
                    (assessment.grid_metrics.frequency_deviation || 0) < 0.1 ? 'text-warning-600' :
                    'text-danger-600'
                  }`}>
                    {(assessment.grid_metrics.frequency_deviation || 0).toFixed(3)} Hz
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Power Quality Index</div>
                  <div className={`text-2xl font-bold ${
                    (assessment.grid_metrics.power_quality_index || 0) > 95 ? 'text-success-600' :
                    (assessment.grid_metrics.power_quality_index || 0) > 90 ? 'text-warning-600' :
                    'text-danger-600'
                  }`}>
                    {(assessment.grid_metrics.power_quality_index || 0).toFixed(1)}
                  </div>
                </div>
              </DashboardGrid>
            </DashboardSection>
          )}

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

          {/* Grid Status Indicators */}
          <DashboardSection title="Grid Status" variant="card">
            <DashboardGrid cols={3} gap="md">
              <div className={`p-4 rounded-lg border-2 ${
                assessment.voltage_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.voltage_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Voltage</div>
                <div className="text-lg font-semibold">{demoTelemetry.voltage.toFixed(2)} kV</div>
                <div className={`text-xs mt-1 ${
                  assessment.voltage_status === 'normal' ? 'text-success-700' :
                  assessment.voltage_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.voltage_status.toUpperCase()}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessment.frequency_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.frequency_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Frequency</div>
                <div className="text-lg font-semibold">{demoTelemetry.frequency.toFixed(3)} Hz</div>
                <div className={`text-xs mt-1 ${
                  assessment.frequency_status === 'normal' ? 'text-success-700' :
                  assessment.frequency_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.frequency_status.toUpperCase()}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessment.power_quality_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.power_quality_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Power Quality</div>
                <div className="text-lg font-semibold">
                  {assessment.grid_metrics?.power_quality_index?.toFixed(1) || 'N/A'}
                </div>
                <div className={`text-xs mt-1 ${
                  assessment.power_quality_status === 'normal' ? 'text-success-700' :
                  assessment.power_quality_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.power_quality_status.toUpperCase()}
                </div>
              </div>
            </DashboardGrid>
          </DashboardSection>

          {/* Outage Alert */}
          {assessment.outage_detected && (
            <DashboardSection variant="card" className="bg-danger-50 border-danger-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <div className="font-semibold text-danger-900">Potential Outage Detected</div>
                  <div className="text-sm text-danger-700">
                    Voltage or frequency outside critical ranges - immediate action required
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
            <div className="text-sm text-gray-500 mb-1">Voltage</div>
            <div className="text-2xl font-semibold">{demoTelemetry.voltage.toFixed(2)} kV</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Frequency</div>
            <div className="text-2xl font-semibold">{demoTelemetry.frequency.toFixed(3)} Hz</div>
          </div>
          {demoTelemetry.power_flow !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Power Flow</div>
              <div className="text-2xl font-semibold">{demoTelemetry.power_flow.toFixed(1)} MW</div>
            </div>
          )}
          {demoTelemetry.transformer_temp !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Transformer Temp</div>
              <div className="text-2xl font-semibold">{demoTelemetry.transformer_temp.toFixed(1)} °C</div>
            </div>
          )}
          {demoTelemetry.current !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Current</div>
              <div className="text-2xl font-semibold">{demoTelemetry.current.toFixed(0)} A</div>
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

            {/* Voltage and Frequency Time Series */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'voltage', name: 'Voltage (kV)', color: '#3b82f6' },
                { key: 'frequency', name: 'Frequency (Hz)', color: '#10b981' },
              ]}
              title="Voltage & Frequency Over Time"
              height={400}
            />

            {/* Power Flow and Transformer Temperature */}
            {timeSeriesData[0]?.power_flow !== undefined && timeSeriesData[0]?.transformer_temp !== undefined && (
              <TimeSeriesChart
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[
                  { key: 'power_flow', name: 'Power Flow (MW)', color: '#8b5cf6' },
                  { key: 'transformer_temp', name: 'Transformer Temp (°C)', color: '#f59e0b' },
                ]}
                title="Power Flow & Transformer Temperature"
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
          componentHealth={assessment.component_health}
        />
      )}
    </DashboardTemplate>
  );
}

