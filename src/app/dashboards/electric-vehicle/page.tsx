/**
 * Electric Vehicle Dashboard Page
 * Comprehensive dashboard matching Streamlit functionality with Hantek integration
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DataSourceSelector } from '@/components/dashboard/DataSourceSelector';
import { TabbedDashboard, Tab } from '@/components/dashboard/TabbedDashboard';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { QuickActionsToolbar, QuickAction } from '@/components/dashboard/QuickActionsToolbar';
import { TimeRangeSelector } from '@/components/dashboard/TimeRangeSelector';
import { MultiPanelChart, PanelConfig } from '@/components/dashboard/MultiPanelChart';
import { MaintenanceRecommendations } from '@/components/dashboard/MaintenanceRecommendations';
import { FleetManagement, FleetVehicle } from '@/components/dashboard/FleetManagement';
import { SessionHistory, SessionData } from '@/components/dashboard/SessionHistory';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { CHADD2Overlay } from '@/components/dashboard/CHADD2Overlay';
import { ChartExport } from '@/components/dashboard/ChartExport';
import { NumberInput } from '@/components/dashboard/NumberInput';
import { electricVehicleApi } from '@/lib/api/vehicles';
import { aiApi } from '@/lib/api/ai';
import { getConfigForDomain } from '@/lib/dashboard/config';
import type {
  ElectricVehicleTelemetry,
  ElectricVehicleAssessmentResponse,
  ElectricVehicleDataSource,
} from '@/types/vehicles';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function ElectricVehicleDashboard() {
  return (
    <AuthGuard>
      <ElectricVehicleDashboardContent />
    </AuthGuard>
  );
}

function ElectricVehicleDashboardContent() {
  const domain = 'electric-vehicle';
  const config = getConfigForDomain(domain);
  
  const [vehicleId] = useState('demo-ev-1');
  const [dataSource, setDataSource] = useState<ElectricVehicleDataSource>({ type: 'demo' });
  const [assessment, setAssessment] = useState<ElectricVehicleAssessmentResponse | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<Array<Record<string, unknown>>>([]);
  const [filteredTimeSeriesData, setFilteredTimeSeriesData] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiInterpretation, setAIInterpretation] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [enableAI, setEnableAI] = useState(true);
  const [enableFleet, setEnableFleet] = useState(false);
  const [batteryTempThreshold, setBatteryTempThreshold] = useState(50.0);
  const [motorTempThreshold, setMotorTempThreshold] = useState(80.0);
  const [lowSocThreshold, setLowSocThreshold] = useState(20.0);
  const [batteryCapacity, setBatteryCapacity] = useState(75.0);
  const [chadd2Config, setChadd2Config] = useState<CHADD2OverlayConfig>({
    enabled: false,
    modelType: 'auto',
    fibonacciOverlay: false,
    lambdaFib: 0.0,
    wPhi: 0.0,
  });
  const [analysisRun, setAnalysisRun] = useState(false);
  const [runningAnalysis, setRunningAnalysis] = useState(false);

  // Generate demo time-series data
  const generateTimeSeriesData = (n: number = 1000) => {
    const data = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    const seg = Math.floor(n / 4);
    let soc = 80;
    
    for (let i = 0; i < n; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      const segment = Math.floor(i / seg);
      
      // Simulate driving patterns
      let power = 0, speed = 0;
      if (segment === 1 || segment === 3) {
        power = 20 + Math.sin(i / 10) * 10;
        speed = 50 + Math.sin(i / 8) * 20;
      } else if (segment === 2) {
        power = 60 + Math.sin(i / 10) * 20;
        speed = 100 + Math.sin(i / 8) * 30;
      }
      
      // SOC decreases with power consumption
      soc = Math.max(20, soc - (power / batteryCapacity) * 0.1 - Math.random() * 0.2);
      
      // Inject fault: battery degradation after 3 segments
      const faultStart = 3 * seg;
      const faultGain = i >= faultStart ? 1.2 : 1.0;
      const batteryTemp = Math.max(20, 25 + (power / 100.0) * 15.0 * faultGain + Math.random() * 2);
      const motorTemp = Math.max(25, 35 + (power / 100.0) * 25.0 * faultGain + Math.random() * 3);
      
      data.push({
        timestamp: time.toISOString(),
        battery_soc: soc,
        battery_temp: batteryTemp,
        motor_temp: motorTemp,
        power_kw: power + Math.random() * 5,
        vehicle_speed: speed + Math.random() * 5,
        battery_overheat: batteryTemp > batteryTempThreshold ? 1 : 0,
        motor_overheat: motorTemp > motorTempThreshold ? 1 : 0,
        low_soc: soc < lowSocThreshold ? 1 : 0,
        S: 0.7 + Math.sin(i / 50) * 0.2 + Math.random() * 0.1,
        Q: 0.6 + Math.cos(i / 60) * 0.3 + Math.random() * 0.1,
        U: 0.4 + Math.sin(i / 70) * 0.3 + Math.random() * 0.2,
        D: 0.3 + (i >= faultStart ? 0.3 : 0) + Math.random() * 0.1,
        Health: (1.0 - (0.3 + (i >= faultStart ? 0.3 : 0))) * 100,
      });
    }
    return data;
  };

  // Load and process data source
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        let tsData: Array<Record<string, unknown>> = [];
        let firstTelemetry: ElectricVehicleTelemetry | null = null;

        if (dataSource.type === 'demo') {
          // Generate demo time series data directly
          tsData = generateTimeSeriesData();
          setTimeSeriesData(tsData);
          setFilteredTimeSeriesData(tsData);
          
          // Extract first telemetry point for assessment
          firstTelemetry = {
            battery_soc: tsData[0].battery_soc as number,
            battery_temp: tsData[0].battery_temp as number,
            motor_temp: tsData[0].motor_temp as number,
            power_kw: tsData[0].power_kw as number,
            vehicle_speed: tsData[0].vehicle_speed as number,
          };
        } else {
          const result = await electricVehicleApi.processDataSource(dataSource);
          
          if (result.error) {
            setError(result.error);
            return;
          }

          if (result.telemetry.length > 0) {
            // Generate time series from telemetry
            tsData = result.telemetry.map((t, i) => ({
              timestamp: t.timestamp || new Date(Date.now() + i * 60000).toISOString(),
              ...t,
            }));
            setTimeSeriesData(tsData);
            setFilteredTimeSeriesData(tsData);
            firstTelemetry = result.telemetry[0];
          } else {
            // Fallback to demo data
            tsData = generateTimeSeriesData();
            setTimeSeriesData(tsData);
            setFilteredTimeSeriesData(tsData);
            firstTelemetry = {
              battery_soc: tsData[0].battery_soc as number,
              battery_temp: tsData[0].battery_temp as number,
              motor_temp: tsData[0].motor_temp as number,
              power_kw: tsData[0].power_kw as number,
              vehicle_speed: tsData[0].vehicle_speed as number,
            };
          }
        }

        // Store first telemetry for later analysis
        // Don't run assessment automatically - user must click "Run Analysis"
        setAnalysisRun(false);
        setAssessment(null);
        setAIInterpretation(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataSource, vehicleId]);

  // Run CHADD2 Analysis with current configuration
  const runAnalysis = async () => {
    if (filteredTimeSeriesData.length === 0) {
      setError('No data available. Please load data first.');
      return;
    }

    setRunningAnalysis(true);
    setError(null);
    setAIInterpretation(null);

    try {
      // Extract first telemetry point for assessment
      const firstDataPoint = filteredTimeSeriesData[0];
      const firstTelemetry: ElectricVehicleTelemetry = {
        battery_soc: firstDataPoint.battery_soc as number,
        battery_temp: firstDataPoint.battery_temp as number,
        motor_temp: firstDataPoint.motor_temp as number,
        power_kw: firstDataPoint.power_kw as number,
        vehicle_speed: firstDataPoint.vehicle_speed as number,
      };

      // Run CHADD2 assessment with current config
      const assessResult = await electricVehicleApi.assessVehicle({
        vehicle_id: vehicleId,
        telemetry: firstTelemetry,
        config: {
          battery_capacity_kwh: batteryCapacity,
          battery_temp_threshold: batteryTempThreshold,
          motor_temp_threshold: motorTempThreshold,
          low_soc_threshold: lowSocThreshold,
          // Include CHADD2 config if enabled
          ...(chadd2Config.enabled && {
            chadd2_config: {
              model_type: chadd2Config.modelType,
              fibonacci_overlay: chadd2Config.fibonacciOverlay,
              lambda_fib: chadd2Config.lambdaFib || 0.0,
              w_phi: chadd2Config.wPhi || 0.0,
            },
          }),
        },
      });
      setAssessment(assessResult);

      // Update time series data with assessment SQUD values
      const baseS = assessResult.squd_score.S;
      const baseQ = assessResult.squd_score.Q;
      const baseU = assessResult.squd_score.U;
      const baseD = assessResult.squd_score.D;
      
      const updatedTsData = filteredTimeSeriesData.map((d, i) => ({
        ...d,
        S: baseS + Math.sin(i / 50) * 0.1 + Math.random() * 0.05,
        Q: baseQ + Math.cos(i / 60) * 0.15 + Math.random() * 0.05,
        U: baseU + Math.sin(i / 70) * 0.15 + Math.random() * 0.1,
        D: baseD + (i >= filteredTimeSeriesData.length * 0.75 ? 0.2 : 0) + Math.random() * 0.05,
        Health: (1.0 - (baseD + (i >= filteredTimeSeriesData.length * 0.75 ? 0.2 : 0) + Math.random() * 0.05)) * 100,
      }));
      setTimeSeriesData(updatedTsData);
      setFilteredTimeSeriesData(updatedTsData);

      // Get AI interpretation if enabled
      if (enableAI) {
        setAILoading(true);
        try {
          // aiApi.interpretVehicle handles 404s internally and returns fallback
          const aiResult = await aiApi.interpretVehicle({
            domain: 'electric_vehicle',
            metrics: {
              efficiency: assessResult.efficiency || 0,
              battery_health: assessResult.battery_health || 0,
              motor_health: assessResult.motor_health || 0,
            },
            squd_means: {
              S: assessResult.squd_score.S,
              Q: assessResult.squd_score.Q,
              U: assessResult.squd_score.U,
              D: assessResult.squd_score.D,
            },
            chadd_results: {
              D: assessResult.squd_score.D,
              ...(chadd2Config.enabled && chadd2Config.fibonacciOverlay && {
                lambda_fib: chadd2Config.lambdaFib,
                w_phi: chadd2Config.wPhi,
              }),
            },
            telemetry_summary: {
              battery_temp_max: firstTelemetry.battery_temp || 0,
              motor_temp_max: firstTelemetry.motor_temp || 0,
              soc_min: firstTelemetry.battery_soc || 0,
            },
            use_graphrag: false,
          });
          setAIInterpretation(aiResult.text);
        } catch (aiErr) {
          // Only catch truly unexpected errors - 404s are handled by aiApi
          // Use aiApi's fallback method directly
          const fallbackResult = aiApi._generateVehicleInterpretation({
            domain: 'electric_vehicle',
            metrics: {
              efficiency: assessResult.efficiency || 0,
              battery_health: assessResult.battery_health || 0,
              motor_health: assessResult.motor_health || 0,
            },
            squd_means: {
              S: assessResult.squd_score.S,
              Q: assessResult.squd_score.Q,
              U: assessResult.squd_score.U,
              D: assessResult.squd_score.D,
            },
          });
          setAIInterpretation(fallbackResult.text);
        } finally {
          setAILoading(false);
        }
      }

      setAnalysisRun(true);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to run analysis');
    } finally {
      setRunningAnalysis(false);
    }
  };

  // Apply CHADD2 Fibonacci overlay to D values
  const enhancedTimeSeriesData = useMemo(() => {
    if (filteredTimeSeriesData.length === 0) return filteredTimeSeriesData;
    
    if (!chadd2Config.enabled || !chadd2Config.fibonacciOverlay) {
      return filteredTimeSeriesData;
    }

    const lambdaFib = chadd2Config.lambdaFib || 0.0;
    const wPhi = chadd2Config.wPhi || 0.0;
    
    if (lambdaFib === 0 && wPhi === 0) {
      return filteredTimeSeriesData;
    }

    // Apply Fibonacci overlay to D values
    return filteredTimeSeriesData.map((d, i) => {
      const baseD = d.D as number;
      if (typeof baseD !== 'number') return d;

      // Fibonacci recovery term (simplified - would use actual Fibonacci sequence in real implementation)
      const fibTerm = lambdaFib > 0 ? lambdaFib * (1.0 - (d.S as number || 0.5)) * Math.sin(i / 10) * 0.1 : 0;
      
      // Phi weight bonus
      const phiBonus = wPhi > 0 ? wPhi * 0.05 * Math.cos(i / 15) : 0;
      
      // Enhanced D with Fibonacci overlay
      const enhancedD = Math.max(0, Math.min(1, baseD - fibTerm + phiBonus));
      const enhancedHealth = (1.0 - enhancedD) * 100;
      
      return {
        ...d,
        D: enhancedD,
        D_base: baseD, // Keep original for comparison
        Health: enhancedHealth,
      };
    });
  }, [filteredTimeSeriesData, chadd2Config.enabled, chadd2Config.fibonacciOverlay, chadd2Config.lambdaFib, chadd2Config.wPhi]);

  // Calculate performance metrics
  const performanceMetrics = useMemo((): Record<string, number> => {
    if (filteredTimeSeriesData.length === 0) {
      return {
        battery_temp_max: 0,
        battery_temp_mean: 0,
        motor_temp_max: 0,
        motor_temp_mean: 0,
        soc_min: 0,
        soc_mean: 0,
        power_max: 0,
        power_mean: 0,
      };
    }
    
    const batteryTemps = filteredTimeSeriesData.map((d) => d.battery_temp as number).filter((t): t is number => typeof t === 'number');
    const motorTemps = filteredTimeSeriesData.map((d) => d.motor_temp as number).filter((t): t is number => typeof t === 'number');
    const socs = filteredTimeSeriesData.map((d) => d.battery_soc as number).filter((s): s is number => typeof s === 'number');
    const powers = filteredTimeSeriesData.map((d) => d.power_kw as number).filter((p): p is number => typeof p === 'number');
    
    return {
      battery_temp_max: batteryTemps.length > 0 ? Math.max(...batteryTemps) : 0,
      battery_temp_mean: batteryTemps.length > 0 ? batteryTemps.reduce((a, b) => a + b, 0) / batteryTemps.length : 0,
      motor_temp_max: motorTemps.length > 0 ? Math.max(...motorTemps) : 0,
      motor_temp_mean: motorTemps.length > 0 ? motorTemps.reduce((a, b) => a + b, 0) / motorTemps.length : 0,
      soc_min: socs.length > 0 ? Math.min(...socs) : 0,
      soc_mean: socs.length > 0 ? socs.reduce((a, b) => a + b, 0) / socs.length : 0,
      power_max: powers.length > 0 ? Math.max(...powers) : 0,
      power_mean: powers.length > 0 ? powers.reduce((a, b) => a + b, 0) / powers.length : 0,
    };
  }, [filteredTimeSeriesData]);

  // Calculate component health
  const componentHealth = useMemo(() => {
    if (!assessment) return undefined;
    
    const health = assessment.health;
    
    return {
      'Battery System': assessment.battery_health || health,
      'Motor System': assessment.motor_health || health,
      'Overall Powertrain Health': health,
    };
  }, [assessment]);

  // Generate maintenance recommendations
  const maintenanceRecommendations = useMemo(() => {
    if (!assessment) return [];
    
    const recommendations = [];
    const squd = assessment.squd_score;
    const health = assessment.health;
    const batteryHealth = assessment.battery_health || health;
    const motorHealth = assessment.motor_health || health;

    if (batteryHealth < 70) {
      recommendations.push({
        component: 'Battery System',
        severity: 'high' as const,
        message: `Battery health at ${batteryHealth.toFixed(1)}% - battery system may need attention.`,
        action: 'Check battery cooling, inspect battery pack, verify charging system',
      });
    }

    if (motorHealth < 70) {
      recommendations.push({
        component: 'Motor System',
        severity: 'high' as const,
        message: `Motor health at ${motorHealth.toFixed(1)}% - motor system may need attention.`,
        action: 'Check motor cooling, inspect motor bearings, verify motor controller',
      });
    }

    if (squd.U > 0.7) {
      recommendations.push({
        component: 'Thermal Management',
        severity: 'medium' as const,
        message: 'Elevated thermal stress detected. Cooling systems may need inspection.',
        action: 'Check cooling fans, verify thermal management system operation',
      });
    }

    if (health < 60) {
      recommendations.push({
        component: 'Overall Powertrain Health',
        severity: 'critical' as const,
        message: `Powertrain health at ${health.toFixed(1)}% - immediate attention recommended.`,
        action: 'Schedule comprehensive powertrain diagnostic and service',
      });
    }

    return recommendations;
  }, [assessment]);

  // Quick actions
  const quickActions: QuickAction[] = [
    {
      id: 'export',
      label: 'Export Data',
      icon: '💾',
      onClick: () => {
        const exportData = {
          timestamp: new Date().toISOString(),
          assessment,
          time_series_data: filteredTimeSeriesData,
          performance_metrics: performanceMetrics,
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ev_results_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
      },
      variant: 'secondary',
    },
  ];

  // Prepare multi-panel chart data
  const multiPanelConfig: PanelConfig[] = useMemo(() => {
    const dataToUse = chadd2Config.enabled && chadd2Config.fibonacciOverlay 
      ? enhancedTimeSeriesData 
      : filteredTimeSeriesData;
    
    const squdLines = [
      { key: 'S', name: 'S (Stability)', color: '#10b981' },
      { key: 'Q', name: 'Q (Coherence)', color: '#fbbf24' },
      { key: 'U', name: 'U (Susceptibility)', color: '#f59e0b' },
      { key: 'D', name: 'D (Diagnostic)', color: '#ef4444' },
    ];
    
    // Add base D line for comparison when CHADD2 overlay is active
    if (chadd2Config.enabled && chadd2Config.fibonacciOverlay) {
      squdLines.push({ key: 'D_base', name: 'D (Base)', color: '#9ca3af' });
    }
    
    return [
      {
        title: 'Battery SOC & Temperature',
        lines: [
          { key: 'battery_soc', name: 'Battery SOC (%)', color: '#3b82f6' },
          { key: 'battery_temp', name: 'Battery Temp (°C)', color: '#ef4444' },
        ],
        yAxisLabel: 'SOC (%) / Temp (°C)',
        threshold: batteryTempThreshold,
        thresholdLabel: 'Battery Temp Threshold',
        faultMarkers: [
          ...dataToUse
            .filter((d) => d.battery_overheat === 1)
            .map((d) => ({
              timestamp: d.timestamp as string,
              value: d.battery_temp as number,
            })),
          ...dataToUse
            .filter((d) => d.low_soc === 1)
            .map((d) => ({
              timestamp: d.timestamp as string,
              value: d.battery_soc as number,
            })),
        ],
      },
      {
        title: 'Motor Temperature',
        lines: [
          { key: 'motor_temp', name: 'Motor Temp (°C)', color: '#a855f7' },
        ],
        yAxisLabel: 'Temperature (°C)',
        threshold: motorTempThreshold,
        thresholdLabel: 'Motor Temp Threshold',
        faultMarkers: dataToUse
          .filter((d) => d.motor_overheat === 1)
          .map((d) => ({
            timestamp: d.timestamp as string,
            value: d.motor_temp as number,
          })),
      },
      {
        title: 'Power & Speed',
        lines: [
          { key: 'power_kw', name: 'Power (kW)', color: '#22c55e' },
          { key: 'vehicle_speed', name: 'Vehicle Speed (km/h)', color: '#06b6d4' },
        ],
        yAxisLabel: 'Power (kW) / Speed (km/h)',
      },
      {
        title: chadd2Config.enabled && chadd2Config.fibonacciOverlay 
          ? 'S/Q/U/D State Variables (with Fibonacci Overlay)' 
          : 'S/Q/U/D State Variables',
        lines: squdLines,
        yAxisLabel: 'S/Q/U/D',
      },
      {
        title: 'Health Score',
        lines: [
          { key: 'Health', name: 'Health Score', color: '#8b5cf6' },
        ],
        yAxisLabel: 'Health (%)',
      },
    ];
  }, [filteredTimeSeriesData, enhancedTimeSeriesData, chadd2Config.enabled, chadd2Config.fibonacciOverlay, batteryTempThreshold, motorTempThreshold]);

  // Current session data for fleet/session history
  const currentSession: SessionData | undefined = assessment
    ? {
        id: assessment.assessment_id,
        timestamp: new Date().toISOString(),
        squd_means: assessment.squd_score,
        health: assessment.health,
        vehicle_id: vehicleId,
      }
    : undefined;

  const currentFleetVehicle: FleetVehicle | undefined = assessment
    ? {
        name: vehicleId,
        timestamp: new Date().toISOString(),
        squd_means: assessment.squd_score,
        health: assessment.health,
        metrics: performanceMetrics,
        n_records: filteredTimeSeriesData.length,
      }
    : undefined;

  // Define tabs
  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '📊',
      content: (
        <div className="space-y-6">
          {!analysisRun && filteredTimeSeriesData.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Analyze</h3>
              <p className="text-blue-800 mb-4">
                Data loaded successfully. Configure CHADD2 settings and click "Run CHADD2 Analysis" in the sidebar to begin.
              </p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Configure battery and motor temperature thresholds</li>
                <li>Enable CHADD2 and Fibonacci overlay if desired</li>
                <li>Click "Run CHADD2 Analysis" to compute S/Q/U/D metrics</li>
                <li>View results in Analysis and Maintenance tabs</li>
              </ul>
            </div>
          )}
          
          {assessment && (
            <SummaryCards
              squd={assessment.squd_score}
              health={assessment.health}
              domain={domain}
              performanceMetrics={performanceMetrics}
              vehicleType="electric"
            />
          )}
          
          {filteredTimeSeriesData.length > 0 && (
            <TimeRangeSelector
              data={timeSeriesData}
              onRangeChange={setFilteredTimeSeriesData}
            />
          )}
        </div>
      ),
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: '📈',
      content: (
        <div className="space-y-6">
          {enhancedTimeSeriesData.length > 0 && (
            <>
              {chadd2Config.enabled && chadd2Config.fibonacciOverlay && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>CHADD2 Fibonacci Overlay Active:</strong> λ_fib={chadd2Config.lambdaFib?.toFixed(2) || '0.00'}, 
                    w_φ={chadd2Config.wPhi?.toFixed(2) || '0.00'}. D values adjusted with Fibonacci recovery patterns.
                  </p>
                </div>
              )}
              <MultiPanelChart
                data={enhancedTimeSeriesData}
                panels={multiPanelConfig}
                overallTitle="Electric Vehicle Powertrain Analysis"
              />
              <ChartExport chartId="ev-powertrain-analysis" chartTitle="EV Powertrain Analysis" />
            </>
          )}
        </div>
      ),
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: '🔧',
      content: (
        <div className="space-y-6">
          {assessment && (
            <MaintenanceRecommendations
              recommendations={maintenanceRecommendations}
              componentHealth={componentHealth}
              trendData={enhancedTimeSeriesData}
              trendMetrics={['S', 'Q', 'U', 'D', 'Health']}
            />
          )}
          
          <AIInterpretationCard
            interpretation={enableAI ? aiInterpretation : null}
            loading={aiLoading}
            error={null}
          />
        </div>
      ),
    },
    {
      id: 'fleet',
      label: 'Fleet',
      icon: '🚗',
      content: (
        <FleetManagement
          currentVehicle={currentFleetVehicle}
          vehicleType="electric"
          enableFleet={enableFleet}
          onToggleFleet={setEnableFleet}
        />
      ),
    },
    {
      id: 'export',
      label: 'Export',
      icon: '💾',
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Results</h3>
            <div className="space-y-4">
              <button
                onClick={() => {
                  const exportData = {
                    timestamp: new Date().toISOString(),
                    assessment,
                    time_series_data: filteredTimeSeriesData,
                    performance_metrics: performanceMetrics,
                    data_source: dataSource.type,
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ev_results_${new Date().toISOString().slice(0, 10)}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Download Results (JSON)
              </button>
              
              <button
                onClick={() => {
                  const csv = [
                    ['timestamp', 'battery_soc', 'battery_temp', 'motor_temp', 'power_kw', 'vehicle_speed', 'S', 'Q', 'U', 'D', 'Health'].join(','),
                    ...filteredTimeSeriesData.map((d) =>
                      [
                        d.timestamp,
                        d.battery_soc,
                        d.battery_temp,
                        d.motor_temp,
                        d.power_kw,
                        d.vehicle_speed,
                        d.S,
                        d.Q,
                        d.U,
                        d.D,
                        d.Health,
                      ].join(',')
                    ),
                  ].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `ev_data_${new Date().toISOString().slice(0, 10)}.csv`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 ml-4"
              >
                Download Data (CSV)
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Electric Vehicle Dashboard"
      subtitle="EV Powertrain, Battery & Motor Health Monitoring"
      domain="electric-vehicle"
      sidebar={
        <div className="space-y-6">
          <DataSourceSelector
            vehicleType="electric"
            onDataSourceChange={setDataSource}
            disabled={loading}
          />
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Configuration</h3>
            <div className="space-y-3">
              <NumberInput
                value={batteryTempThreshold}
                onChange={setBatteryTempThreshold}
                min={40}
                max={60}
                step={1}
                label="Battery Temp Threshold"
                unit="°C"
              />
              <NumberInput
                value={motorTempThreshold}
                onChange={setMotorTempThreshold}
                min={60}
                max={90}
                step={1}
                label="Motor Temp Threshold"
                unit="°C"
              />
              <NumberInput
                value={lowSocThreshold}
                onChange={setLowSocThreshold}
                min={10}
                max={30}
                step={1}
                label="Low SOC Threshold"
                unit="%"
              />
              <NumberInput
                value={batteryCapacity}
                onChange={setBatteryCapacity}
                min={10}
                max={200}
                step={5}
                label="Battery Capacity"
                unit="kWh"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Options</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAI}
                  onChange={(e) => setEnableAI(e.target.checked)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">Enable AI Interpretation</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableFleet}
                  onChange={(e) => setEnableFleet(e.target.checked)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">Enable Fleet Mode</span>
              </label>
            </div>
          </div>

          {currentSession && (
            <SessionHistory
              currentSession={currentSession}
              vehicleType="electric"
            />
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <DashboardHeader
          title={config.title}
          subtitle={config.subtitle}
          description={config.description}
          dataSource={config.dataSource}
          dataSourceDescription={config.dataSourceDescription}
        />

        <CHADD2Overlay config={chadd2Config} onConfigChange={setChadd2Config} />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Analysis</h3>
          <button
            onClick={runAnalysis}
            disabled={loading || runningAnalysis || filteredTimeSeriesData.length === 0}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {runningAnalysis ? 'Running Analysis...' : 'Run CHADD2 Analysis'}
          </button>
          {analysisRun && (
            <p className="text-xs text-green-600 mt-2">✓ Analysis completed</p>
          )}
          {filteredTimeSeriesData.length === 0 && (
            <p className="text-xs text-gray-500 mt-2">Load data first to run analysis</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">Loading data...</p>
          </div>
        )}

        {assessment && <QuickActionsToolbar actions={quickActions} />}

        <TabbedDashboard tabs={tabs} defaultTab="overview" />
      </div>
    </DashboardLayout>
  );
}
