/**
 * Industrial Fault Detection Dashboard Page
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
import { industrialApi } from '@/lib/api/industrial';
import { aiApi } from '@/lib/api/ai';
import type {
  IndustrialTelemetry,
  IndustrialAssessmentResponse,
  IndustrialTimeSeriesData,
} from '@/types/industrial';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function IndustrialFaultDashboard() {
  return <IndustrialFaultDashboardContent />;
}

function IndustrialFaultDashboardContent() {
  const domain = 'industrial';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [assetId] = useState('demo-asset-1');
  const [assessment, setAssessment] = useState<IndustrialAssessmentResponse | null>(null);
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
  const [demoTelemetry] = useState<IndustrialTelemetry>({
    vibration: 4.2, // mm/s
    temperature: 68.5, // °C
    pressure: 8.5, // bar
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): IndustrialTimeSeriesData[] => {
    const data: IndustrialTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      const vibration = 3 + Math.sin(i / 10) * 2 + Math.random() * 1.5;
      const temperature = 65 + Math.sin(i / 15) * 5 + Math.random() * 3;
      const pressure = 8.0 + Math.sin(i / 20) * 1.0 + Math.random() * 0.5;
      
      // Calculate S/Q/U/D (simplified)
      const S = pressure >= 7.5 && pressure <= 9.5 ? 0.8 : 0.6;
      const Q = temperature < 70 ? 0.3 : temperature < 80 ? 0.5 : 0.7;
      const U = vibration < 5 ? 0.3 : vibration < 8 ? 0.5 : 0.7;
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
      
      data.push({
        timestamp: time.toISOString(),
        vibration,
        temperature,
        pressure,
        S,
        Q,
        U,
        D,
      });
    }
    
    return data;
  };

  const [timeSeriesData] = useState<IndustrialTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await industrialApi.assessAsset({
        asset_id: assetId,
        telemetry: demoTelemetry,
        config: {
          vibration_threshold_warn: 5.0,
          vibration_threshold_alarm: 8.0,
          temperature_threshold_warn: 70.0,
          temperature_threshold_alarm: 85.0,
          pressure_min: 7.0,
          pressure_max: 10.0,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'industrial',
            metrics: {
              vibration: demoTelemetry.vibration,
              temperature: demoTelemetry.temperature,
              pressure: demoTelemetry.pressure,
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
      component: 'Equipment',
      severity: assessment.fault_detected ? 'high' as const : 'low' as const,
      message: rec,
      action: rec.includes('Immediate') ? 'Schedule immediate inspection' : 'Monitor and plan maintenance',
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
              <DashboardGrid cols={3} gap="md">
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

          {/* Sensor Status Indicators */}
          <DashboardSection title="Sensor Status" variant="card">
            <DashboardGrid cols={3} gap="md">
              <div className={`p-4 rounded-lg border-2 ${
                assessment.vibration_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.vibration_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Vibration</div>
                <div className="text-lg font-semibold">{demoTelemetry.vibration.toFixed(1)} mm/s</div>
                <div className={`text-xs mt-1 ${
                  assessment.vibration_status === 'normal' ? 'text-success-700' :
                  assessment.vibration_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.vibration_status.toUpperCase()}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessment.temperature_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.temperature_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Temperature</div>
                <div className="text-lg font-semibold">{demoTelemetry.temperature.toFixed(1)} °C</div>
                <div className={`text-xs mt-1 ${
                  assessment.temperature_status === 'normal' ? 'text-success-700' :
                  assessment.temperature_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.temperature_status.toUpperCase()}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessment.pressure_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.pressure_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Pressure</div>
                <div className="text-lg font-semibold">{demoTelemetry.pressure.toFixed(1)} bar</div>
                <div className={`text-xs mt-1 ${
                  assessment.pressure_status === 'normal' ? 'text-success-700' :
                  assessment.pressure_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.pressure_status.toUpperCase()}
                </div>
              </div>
            </DashboardGrid>
          </DashboardSection>

          {/* Fault Detection Alert */}
          {assessment.fault_detected && (
            <DashboardSection variant="card" className="bg-danger-50 border-danger-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-semibold text-danger-900">Fault Detected</div>
                  <div className="text-sm text-danger-700">
                    {assessment.fault_type === 'bearing' && 'Bearing fault detected - high vibration levels'}
                    {assessment.fault_type === 'overheating' && 'Overheating detected - temperature critical'}
                  </div>
                </div>
              </div>
            </DashboardSection>
          )}
        </>
      )}

      {/* Current Telemetry Display */}
      <DashboardSection title="Current Telemetry" variant="card">
        <DashboardGrid cols={3} gap="md">
          <div>
            <div className="text-sm text-gray-500 mb-1">Vibration</div>
            <div className="text-2xl font-semibold">{demoTelemetry.vibration.toFixed(2)} mm/s</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Temperature</div>
            <div className="text-2xl font-semibold">{demoTelemetry.temperature.toFixed(1)} °C</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Pressure</div>
            <div className="text-2xl font-semibold">{demoTelemetry.pressure.toFixed(2)} bar</div>
          </div>
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

            {/* Sensor Data Time Series */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'vibration', name: 'Vibration (mm/s)', color: '#ef4444' },
                { key: 'temperature', name: 'Temperature (°C)', color: '#f59e0b' },
                { key: 'pressure', name: 'Pressure (bar)', color: '#3b82f6' },
              ]}
              title="Sensor Data Over Time"
              height={400}
            />
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

