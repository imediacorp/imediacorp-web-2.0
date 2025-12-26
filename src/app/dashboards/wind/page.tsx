/**
 * Wind SCADA Dashboard Page
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
import { windApi } from '@/lib/api/wind';
import { aiApi } from '@/lib/api/ai';
import type {
  WindTelemetry,
  WindAssessmentResponse,
  WindTimeSeriesData,
} from '@/types/wind';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function WindDashboard() {
  return <WindDashboardContent />;
}

function WindDashboardContent() {
  const domain = 'wind';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [plantId] = useState('demo-wind-plant-1');
  const [assessment, setAssessment] = useState<WindAssessmentResponse | null>(null);
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
  const [demoTelemetry] = useState<WindTelemetry>({
    wind_speed: 10.5, // m/s
    plant_power: 1750, // kW
    nacelle_temp: 48.2, // °C
    gearbox_temp: 68.5, // °C
    vibration: 4.2, // mm/s
    availability: 96.5, // %
  });

  // Generate demo time-series data
  const generateTimeSeriesData = (): WindTimeSeriesData[] => {
    const data: WindTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T00:00:00Z');
    const ratedWindSpeed = 12.0;
    const cutInWindSpeed = 3.0;
    const cutOutWindSpeed = 22.0;
    const nameplateCapacity = 2000; // kW
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      
      // Simulate realistic wind speed variations
      const windSpeed = 5 + Math.sin(i / 15) * 8 + Math.random() * 3;
      const windSpeedClamped = Math.max(0, Math.min(25, windSpeed));
      
      // Calculate expected power from wind speed (power curve)
      let expectedPower = 0;
      if (windSpeedClamped >= cutInWindSpeed && windSpeedClamped <= cutOutWindSpeed) {
        if (windSpeedClamped < ratedWindSpeed) {
          const powerRatio = Math.pow((windSpeedClamped - cutInWindSpeed) / (ratedWindSpeed - cutInWindSpeed), 3);
          expectedPower = powerRatio * nameplateCapacity;
        } else {
          expectedPower = nameplateCapacity;
        }
      }
      const actualPower = expectedPower * (0.85 + Math.random() * 0.10); // 85-95% of expected
      
      // Temperature and vibration (correlated with wind speed/load)
      const nacelleTemp = 40 + (windSpeedClamped / 25) * 20 + Math.random() * 3;
      const gearboxTemp = 60 + (windSpeedClamped / 25) * 15 + Math.random() * 3;
      const vibration = 2 + (windSpeedClamped / 25) * 5 + Math.random() * 1.5;
      const availability = 95 + Math.random() * 3;
      
      // Calculate S/Q/U/D
      const S = availability > 95 ? 0.85 : availability > 90 ? 0.70 : 0.55;
      const windSpeedNormalized = Math.min(1.0, windSpeedClamped / 15.0);
      const Q = 1.0 - windSpeedNormalized;
      const Q_normalized = Math.max(0.1, Math.min(0.9, Q));
      const tempFactor = Math.max(nacelleTemp / 70, gearboxTemp / 90);
      const vibFactor = vibration / 10.0;
      const U = Math.min(1.0, (tempFactor * 0.6 + vibFactor * 0.4));
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q_normalized + 0.01) - 0.4 * U)));
      
      data.push({
        timestamp: time.toISOString(),
        wind_speed: windSpeedClamped,
        plant_power: actualPower,
        nacelle_temp: nacelleTemp,
        gearbox_temp: gearboxTemp,
        vibration: vibration,
        availability: availability,
        S,
        Q: Q_normalized,
        U,
        D,
      });
    }
    
    return data;
  };

  const [timeSeriesData] = useState<WindTimeSeriesData[]>(generateTimeSeriesData());

  const handleAssess = async () => {
    setLoading(true);
    setError(null);
    setAIInterpretation(null);

    try {
      const result = await windApi.assessPlant({
        plant_id: plantId,
        telemetry: demoTelemetry,
        config: {
          nameplate_capacity: 2000, // kW
          turbine_count: 10,
          rated_wind_speed: 12.0,
          cut_in_wind_speed: 3.0,
          cut_out_wind_speed: 22.0,
        },
      });
      
      setAssessment(result);

      // Get AI interpretation if enabled
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'wind',
            metrics: {
              wind_speed: demoTelemetry.wind_speed,
              plant_power: demoTelemetry.plant_power,
              availability: demoTelemetry.availability,
              gearbox_temp: demoTelemetry.gearbox_temp,
              vibration: demoTelemetry.vibration,
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
      component: 'Wind Plant',
      severity: assessment.drivetrain_health_status === 'alarm' ? 'critical' as const :
                assessment.drivetrain_health_status === 'warn' || assessment.availability_status === 'alarm' ? 'high' as const :
                'medium' as const,
      message: rec,
      action: rec.includes('immediate') || rec.includes('Critical') ? 'Take immediate action' :
              rec.includes('investigate') || rec.includes('monitor') ? 'Schedule inspection' :
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
                  <div className="text-sm text-gray-500 mb-1">Capacity Factor</div>
                  <div className={`text-2xl font-bold ${
                    (assessment.plant_metrics.capacity_factor || 0) > 30 ? 'text-success-600' :
                    (assessment.plant_metrics.capacity_factor || 0) > 20 ? 'text-warning-600' :
                    'text-danger-600'
                  }`}>
                    {(assessment.plant_metrics.capacity_factor || 0).toFixed(1)}%
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
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Wind Speed</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {(assessment.plant_metrics.wind_speed_avg || 0).toFixed(1)} m/s
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

          {/* Status Indicators */}
          <DashboardSection title="Plant Status" variant="card">
            <DashboardGrid cols={3} gap="md">
              <div className={`p-4 rounded-lg border-2 ${
                assessment.turbine_health_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.turbine_health_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Turbine Health</div>
                <div className="text-lg font-semibold">
                  {assessment.plant_metrics?.availability?.toFixed(1) || 'N/A'}% Available
                </div>
                <div className={`text-xs mt-1 ${
                  assessment.turbine_health_status === 'normal' ? 'text-success-700' :
                  assessment.turbine_health_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.turbine_health_status.toUpperCase()}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessment.drivetrain_health_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.drivetrain_health_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Drivetrain Health</div>
                <div className="text-lg font-semibold">
                  {demoTelemetry.gearbox_temp?.toFixed(1) || 'N/A'}°C Gearbox
                </div>
                <div className={`text-xs mt-1 ${
                  assessment.drivetrain_health_status === 'normal' ? 'text-success-700' :
                  assessment.drivetrain_health_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.drivetrain_health_status.toUpperCase()}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                assessment.availability_status === 'normal' ? 'border-success-300 bg-success-50' :
                assessment.availability_status === 'warn' ? 'border-warning-300 bg-warning-50' :
                'border-danger-300 bg-danger-50'
              }`}>
                <div className="text-sm font-medium text-gray-700 mb-1">Availability</div>
                <div className="text-lg font-semibold">
                  {assessment.plant_metrics?.availability?.toFixed(1) || 'N/A'}%
                </div>
                <div className={`text-xs mt-1 ${
                  assessment.availability_status === 'normal' ? 'text-success-700' :
                  assessment.availability_status === 'warn' ? 'text-warning-700' :
                  'text-danger-700'
                }`}>
                  {assessment.availability_status.toUpperCase()}
                </div>
              </div>
            </DashboardGrid>
          </DashboardSection>

          {/* Drivetrain Alert */}
          {assessment.drivetrain_health_status === 'alarm' && (
            <DashboardSection variant="card" className="bg-danger-50 border-danger-300">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <div className="font-semibold text-danger-900">Drivetrain Health Alert</div>
                  <div className="text-sm text-danger-700">
                    High temperature or vibration detected - immediate inspection recommended
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
          {demoTelemetry.wind_speed !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Wind Speed</div>
              <div className="text-2xl font-semibold">{demoTelemetry.wind_speed.toFixed(1)} m/s</div>
            </div>
          )}
          {demoTelemetry.plant_power !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Plant Power</div>
              <div className="text-2xl font-semibold">{demoTelemetry.plant_power.toFixed(0)} kW</div>
            </div>
          )}
          {demoTelemetry.availability !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Availability</div>
              <div className="text-2xl font-semibold">{demoTelemetry.availability.toFixed(1)}%</div>
            </div>
          )}
          {demoTelemetry.gearbox_temp !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Gearbox Temp</div>
              <div className="text-2xl font-semibold">{demoTelemetry.gearbox_temp.toFixed(1)} °C</div>
            </div>
          )}
          {demoTelemetry.nacelle_temp !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Nacelle Temp</div>
              <div className="text-2xl font-semibold">{demoTelemetry.nacelle_temp.toFixed(1)} °C</div>
            </div>
          )}
          {demoTelemetry.vibration !== undefined && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Vibration</div>
              <div className="text-2xl font-semibold">{demoTelemetry.vibration.toFixed(1)} mm/s</div>
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

            {/* Wind Speed and Plant Power */}
            <TimeSeriesChart
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'wind_speed', name: 'Wind Speed (m/s)', color: '#3b82f6' },
                { key: 'plant_power', name: 'Plant Power (kW)', color: '#f59e0b' },
              ]}
              title="Wind Speed & Plant Power Over Time"
              height={400}
            />

            {/* Drivetrain Temperatures and Vibration */}
            {timeSeriesData[0]?.gearbox_temp !== undefined && timeSeriesData[0]?.nacelle_temp !== undefined && timeSeriesData[0]?.vibration !== undefined && (
              <TimeSeriesChart
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[
                  { key: 'gearbox_temp', name: 'Gearbox Temp (°C)', color: '#ef4444' },
                  { key: 'nacelle_temp', name: 'Nacelle Temp (°C)', color: '#f59e0b' },
                  { key: 'vibration', name: 'Vibration (mm/s)', color: '#8b5cf6' },
                ]}
                title="Drivetrain Temperatures & Vibration"
                height={400}
              />
            )}

            {/* Availability */}
            {timeSeriesData[0]?.availability !== undefined && (
              <TimeSeriesChart
                data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                lines={[
                  { key: 'availability', name: 'Availability (%)', color: '#10b981' },
                ]}
                title="Availability Over Time"
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

