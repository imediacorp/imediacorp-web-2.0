/**
 * Solar SCADA Dashboard Page
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
import { solarApi } from '@/lib/api/solar';
import { aiApi } from '@/lib/api/ai';
import type {
  SolarTelemetry,
  SolarAssessmentResponse,
  SolarTimeSeriesData,
} from '@/types/solar';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function SolarDashboard() {
  return <SolarDashboardContent />;
}

function SolarDashboardContent() {
  const domain = 'solar';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [plantId] = useState('demo-plant-1');
  const [assessment, setAssessment] = useState<SolarAssessmentResponse | null>(null);
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
  const [demoTelemetry] = useState<SolarTelemetry>({
    plant_power: 850, // kW
    irradiance: 780, // W/m²
    ambient_temp: 28.5, // °C
    module_temp: 58.2, // °C
    performance_ratio: 0.84,
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): SolarTimeSeriesData[] => {
    const data: SolarTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T08:00:00Z'); // Start at 8 AM
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      const hour = time.getHours();
      
      // Simulate daily solar curve
      const solarCurve = hour >= 6 && hour <= 18 ? 
        Math.sin((hour - 6) * Math.PI / 12) : 0;
      
      const irradiance = Math.max(0, solarCurve * 900 + Math.random() * 50);
      const plantPower = irradiance > 0 ? (irradiance / 1000) * 1000 * (0.80 + Math.random() * 0.10) : 0;
      const ambientTemp = 25 + solarCurve * 10 + Math.random() * 2;
      const moduleTemp = ambientTemp + (irradiance / 50) + Math.random() * 5;
      const performanceRatio = 0.75 + Math.random() * 0.15;
      
      // Calculate S/Q/U/D (simplified)
      const S = performanceRatio > 0.85 ? 0.85 : performanceRatio > 0.75 ? 0.70 : 0.55;
      const Q = 1.0 - performanceRatio;
      const Q_normalized = Math.max(0.1, Math.min(0.9, Q));
      const irradianceFactor = Math.min(1.0, irradiance / 1000);
      const tempFactor = Math.min(1.0, moduleTemp / 80);
      const U = (irradianceFactor * 0.5 + tempFactor * 0.5);
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q_normalized + 0.01) - 0.4 * U)));
      
      data.push({
        timestamp: time.toISOString(),
        plant_power: plantPower,
        irradiance: irradiance,
        ambient_temp: ambientTemp,
        module_temp: moduleTemp,
        performance_ratio: performanceRatio,
        S,
        Q: Q_normalized,
        U,
        D,
      });
    }
    
    return data;
  };

  const [timeSeriesData] = useState<SolarTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await solarApi.assessPlant({
        plant_id: plantId,
        telemetry: demoTelemetry,
        config: {
          nameplate_capacity: 1000, // kW
          performance_ratio_target: 0.80,
          inverter_count: 10,
          expected_irradiance: 800,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'solar',
            metrics: {
              plant_power: demoTelemetry.plant_power,
              irradiance: demoTelemetry.irradiance,
              performance_ratio: demoTelemetry.performance_ratio,
              module_temp: demoTelemetry.module_temp,
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
      component: 'Solar Plant',
      severity: assessment.plant_efficiency_status === 'alarm' ? 'high' as const :
                assessment.plant_efficiency_status === 'warn' ? 'medium' as const :
                'low' as const,
      message: rec,
      action: rec.includes('investigate') || rec.includes('check') ? 'Schedule inspection' :
              rec.includes('maintain') ? 'Continue monitoring' : 'Monitor trends',
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

          {/* Plant Metrics */}
          {assessment.plant_metrics && (
            <DashboardSection title="Plant Performance Metrics" variant="card">
              <DashboardGrid cols={4} gap="md">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Expected Generation</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.plant_metrics.expected_generation || 0).toFixed(0)} kW
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Actual Generation</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.plant_metrics.actual_generation || 0).toFixed(0)} kW
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Efficiency</div>
                  <div className={`text-2xl font-bold ${
                    (assessment.plant_metrics.efficiency || 0) > 90 ? 'text-success-600' :
                    (assessment.plant_metrics.efficiency || 0) > 80 ? 'text-warning-600' :
                    'text-danger-600'
                  }`}>
                    {(assessment.plant_metrics.efficiency || 0).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Availability</div>
                  <div className={`text-2xl font-bold ${
                    (assessment.plant_metrics.availability || 0) > 95 ? 'text-success-600' :
                    (assessment.plant_metrics.availability || 0) > 90 ? 'text-warning-600' :
                    'text-danger-600'
                  }`}>
                    {(assessment.plant_metrics.availability || 0).toFixed(1)}%
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

          {/* Performance Status Indicators */}
          <DashboardSection title="Performance Status" variant="card">
            <DashboardGrid cols={2} gap="md">
              <div className={`p-4 rounded-lg border-2 ${
                assessment.inverter_health_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.inverter_health_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Inverter Health</div>
                <div className="text-lg font-semibold">
                  {assessment.performance_ratio ? (assessment.performance_ratio * 100).toFixed(1) : 'N/A'}% PR
                </div>
                <div className={`text-xs mt-1 ${
                  assessment.inverter_health_status === 'normal' ? 'text-success-700' :
                  assessment.inverter_health_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.inverter_health_status.toUpperCase()}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessment.plant_efficiency_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.plant_efficiency_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Plant Efficiency</div>
                <div className="text-lg font-semibold">
                  {assessment.plant_metrics?.efficiency?.toFixed(1) || 'N/A'}%
                </div>
                <div className={`text-xs mt-1 ${
                  assessment.plant_efficiency_status === 'normal' ? 'text-success-700' :
                  assessment.plant_efficiency_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.plant_efficiency_status.toUpperCase()}
                </div>
              </div>
            </DashboardGrid>
          </DashboardSection>
        </>
      )}

      {/* Current Telemetry Display */}
      <DashboardSection title="Current Telemetry" variant="card">
        <DashboardGrid cols={4} gap="md">
          {demoTelemetry.plant_power !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Plant Power</div>
              <div className="text-2xl font-semibold">{demoTelemetry.plant_power.toFixed(0)} kW</div>
            </div>
          )}
          {demoTelemetry.irradiance !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Irradiance</div>
              <div className="text-2xl font-semibold">{demoTelemetry.irradiance.toFixed(0)} W/m²</div>
            </div>
          )}
          {demoTelemetry.performance_ratio !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Performance Ratio</div>
              <div className="text-2xl font-semibold">{(demoTelemetry.performance_ratio * 100).toFixed(1)}%</div>
            </div>
          )}
          {demoTelemetry.module_temp !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Module Temp</div>
              <div className="text-2xl font-semibold">{demoTelemetry.module_temp.toFixed(1)} °C</div>
            </div>
          )}
          {demoTelemetry.ambient_temp !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Ambient Temp</div>
              <div className="text-2xl font-semibold">{demoTelemetry.ambient_temp.toFixed(1)} °C</div>
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

            {/* Plant Power and Irradiance */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'plant_power', name: 'Plant Power (kW)', color: '#f59e0b' },
                { key: 'irradiance', name: 'Irradiance (W/m²)', color: '#3b82f6' },
              ]}
              title="Plant Power & Irradiance Over Time"
              height={400}
            />

            {/* Performance Ratio */}
            {timeSeriesData[0]?.performance_ratio !== undefined && (
              <TimeSeriesChart
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[
                  { key: 'performance_ratio', name: 'Performance Ratio (PR)', color: '#10b981' },
                ]}
                title="Performance Ratio Over Time"
                height={300}
              />
            )}

            {/* Temperature */}
            {timeSeriesData[0]?.module_temp !== undefined && timeSeriesData[0]?.ambient_temp !== undefined && (
              <TimeSeriesChart
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[
                  { key: 'module_temp', name: 'Module Temperature (°C)', color: '#ef4444' },
                  { key: 'ambient_temp', name: 'Ambient Temperature (°C)', color: '#3b82f6' },
                ]}
                title="Temperature Over Time"
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

