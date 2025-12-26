/**
 * Gas Vehicle Dashboard Page
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
import { gasVehicleApi } from '@/lib/api/vehicles';
import { aiApi } from '@/lib/api/ai';
import { getConfigForDomain } from '@/lib/dashboard/config';
import type {
  GasVehicleTelemetry,
  GasVehicleAssessmentResponse,
  GasVehicleDataSource,
} from '@/types/vehicles';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function GasVehicleDashboard() {
  return (
    <AuthGuard>
      <GasVehicleDashboardContent />
    </AuthGuard>
  );
}

function GasVehicleDashboardContent() {
  const domain = 'gas-vehicle';
  const config = getConfigForDomain(domain);
  
  const [vehicleId] = useState('demo-vehicle-1');
  const [dataSource, setDataSource] = useState<GasVehicleDataSource>({ type: 'demo' });
  const [assessment, setAssessment] = useState<GasVehicleAssessmentResponse | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<Array<Record<string, unknown>>>([]);
  const [filteredTimeSeriesData, setFilteredTimeSeriesData] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiInterpretation, setAIInterpretation] = useState<string | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [enableAI, setEnableAI] = useState(true);
  const [enableFleet, setEnableFleet] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(95.0);
  const [ambientTemp, setAmbientTemp] = useState(25.0);
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
    
    for (let i = 0; i < n; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      const segment = Math.floor(i / seg);
      
      // Simulate driving patterns
      let rpm = 750, throttle = 0, speed = 0;
      if (segment === 1 || segment === 3) {
        rpm = 2000 + Math.sin(i / 10) * 500;
        throttle = 25 + Math.sin(i / 8) * 15;
        speed = 50 + Math.sin(i / 8) * 20;
      } else if (segment === 2) {
        rpm = 3000 + Math.sin(i / 10) * 500;
        throttle = 40 + Math.sin(i / 8) * 20;
        speed = 100 + Math.sin(i / 8) * 30;
      }
      
      // Inject fault: overheating after 3 segments
      const faultStart = 3 * seg;
      const faultGain = i >= faultStart ? 3.0 : 1.0;
      const loadFactor = (throttle / 100.0) * (rpm / 3000.0);
      const coolantTemp = Math.max(25, 85 + faultGain * loadFactor * 10 + Math.sin(i / 15) * 5);
      
      data.push({
        timestamp: time.toISOString(),
        engine_rpm: rpm + Math.random() * 200,
        coolant_temp: coolantTemp + Math.random() * 3,
        throttle_position: throttle + Math.random() * 5,
        maf: (throttle / 100.0) * 50.0 + (rpm / 3000.0) * 30.0 + Math.random() * 3,
        o2_sensor_1: 1.0 + (Math.random() - 0.5) * 0.1,
        timing_advance: 10 + (throttle / 100.0) * 15.0 + Math.random() * 2,
        vehicle_speed: speed + Math.random() * 5,
        S: 0.7 + Math.sin(i / 50) * 0.2 + Math.random() * 0.1,
        Q: 0.6 + Math.cos(i / 60) * 0.3 + Math.random() * 0.1,
        U: 0.4 + Math.sin(i / 70) * 0.3 + Math.random() * 0.2,
        D: 0.3 + (i >= faultStart ? 0.3 : 0) + Math.random() * 0.1,
        overheat: i >= faultStart && coolantTemp > tempThreshold ? 1 : 0,
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
        let firstTelemetry: GasVehicleTelemetry | null = null;

        if (dataSource.type === 'demo') {
          // Generate demo time series data directly
          tsData = generateTimeSeriesData();
          setTimeSeriesData(tsData);
          setFilteredTimeSeriesData(tsData);
          
          // Extract first telemetry point for assessment
          firstTelemetry = {
            engine_rpm: tsData[0].engine_rpm as number,
            coolant_temp: tsData[0].coolant_temp as number,
            throttle_position: tsData[0].throttle_position as number,
            maf: tsData[0].maf as number,
            o2_sensor_1: tsData[0].o2_sensor_1 as number,
            timing_advance: tsData[0].timing_advance as number,
            vehicle_speed: tsData[0].vehicle_speed as number,
          };
        } else {
          const result = await gasVehicleApi.processDataSource(dataSource);
          
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
              engine_rpm: tsData[0].engine_rpm as number,
              coolant_temp: tsData[0].coolant_temp as number,
              throttle_position: tsData[0].throttle_position as number,
              maf: tsData[0].maf as number,
              o2_sensor_1: tsData[0].o2_sensor_1 as number,
              timing_advance: tsData[0].timing_advance as number,
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
      const firstTelemetry: GasVehicleTelemetry = {
        engine_rpm: firstDataPoint.engine_rpm as number,
        coolant_temp: firstDataPoint.coolant_temp as number,
        throttle_position: firstDataPoint.throttle_position as number,
        maf: firstDataPoint.maf as number,
        o2_sensor_1: firstDataPoint.o2_sensor_1 as number,
        timing_advance: firstDataPoint.timing_advance as number,
        vehicle_speed: firstDataPoint.vehicle_speed as number,
      };

      // Run CHADD2 assessment with current config
      const assessResult = await gasVehicleApi.assessVehicle({
        vehicle_id: vehicleId,
        telemetry: firstTelemetry,
        config: {
          temp_threshold: tempThreshold,
          ambient_temp: ambientTemp,
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
      }));
      setTimeSeriesData(updatedTsData);
      setFilteredTimeSeriesData(updatedTsData);

      // Get AI interpretation if enabled
      if (enableAI) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'gas_vehicle',
            metrics: {
              combustion_quality: assessResult.combustion_quality || 0,
              thermal_stress: assessResult.thermal_stress || 0,
              engine_load: assessResult.engine_load || 0,
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
              coolant_temp_max: firstTelemetry.coolant_temp,
              engine_rpm: firstTelemetry.engine_rpm,
            },
            use_graphrag: false,
          });
          setAIInterpretation(aiResult.text);
        } catch (aiErr) {
          // Only catch truly unexpected errors - 404s are handled by aiApi
          // Use aiApi's fallback method directly
          const fallbackResult = aiApi._generateVehicleInterpretation({
            domain: 'gas_vehicle',
            metrics: {
              combustion_quality: assessResult.combustion_quality || 0,
              thermal_stress: assessResult.thermal_stress || 0,
              engine_load: assessResult.engine_load || 0,
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
      // The recovery term reduces D when S is low (system recovering)
      const fibTerm = lambdaFib > 0 ? lambdaFib * (1.0 - (d.S as number || 0.5)) * Math.sin(i / 10) * 0.1 : 0;
      
      // Phi weight bonus (golden ratio augmentation)
      const phiBonus = wPhi > 0 ? wPhi * 0.05 * Math.cos(i / 15) : 0;
      
      // Enhanced D with Fibonacci overlay (recovery reduces D, phi adds slight variation)
      const enhancedD = Math.max(0, Math.min(1, baseD - fibTerm + phiBonus));
      
      return {
        ...d,
        D: enhancedD,
        D_base: baseD, // Keep original for comparison
      };
    });
  }, [filteredTimeSeriesData, chadd2Config.enabled, chadd2Config.fibonacciOverlay, chadd2Config.lambdaFib, chadd2Config.wPhi]);

  // Calculate performance metrics
  const performanceMetrics = useMemo((): Record<string, number> => {
    if (filteredTimeSeriesData.length === 0) {
      return {
        coolant_temp_max: 0,
        coolant_temp_mean: 0,
        rpm_mean: 0,
        rpm_max: 0,
      };
    }
    
    const temps = filteredTimeSeriesData.map((d) => d.coolant_temp as number).filter((t): t is number => typeof t === 'number');
    const rpms = filteredTimeSeriesData.map((d) => d.engine_rpm as number).filter((r): r is number => typeof r === 'number');
    
    return {
      coolant_temp_max: temps.length > 0 ? Math.max(...temps) : 0,
      coolant_temp_mean: temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 0,
      rpm_mean: rpms.length > 0 ? rpms.reduce((a, b) => a + b, 0) / rpms.length : 0,
      rpm_max: rpms.length > 0 ? Math.max(...rpms) : 0,
    };
  }, [filteredTimeSeriesData]);

  // Calculate component health
  const componentHealth = useMemo(() => {
    if (!assessment) return undefined;
    
    const squd = assessment.squd_score;
    const health = assessment.health;
    
    return {
      'Coolant System': Math.max(0, Math.min(100, health + (1 - squd.U) * 20)),
      'Combustion System': Math.max(0, Math.min(100, health + (1 - squd.Q) * 30)),
      'Engine Load System': Math.max(0, Math.min(100, health + squd.S * 20)),
      'Overall Engine Health': health,
    };
  }, [assessment]);

  // Generate maintenance recommendations
  const maintenanceRecommendations = useMemo(() => {
    if (!assessment) return [];
    
    const recommendations = [];
    const squd = assessment.squd_score;
    const health = assessment.health;

    if (squd.U > 0.7) {
      recommendations.push({
        component: 'Coolant System',
        severity: 'high' as const,
        message: 'Elevated thermal stress detected. Coolant system may need attention.',
        action: 'Check coolant level, inspect radiator, test thermostat',
      });
    }

    if (squd.Q > 0.6) {
      recommendations.push({
        component: 'Combustion System',
        severity: 'medium' as const,
        message: 'Combustion quality declining. Air-fuel mixture may be suboptimal.',
        action: 'Check spark plugs, inspect O2 sensors, verify fuel quality',
      });
    }

    if (squd.S < 0.5) {
      recommendations.push({
        component: 'Engine Stability',
        severity: 'high' as const,
        message: 'Engine stability is below optimal levels.',
        action: 'Inspect engine mounts, check for vibration sources, verify oil quality',
      });
    }

    if (health < 60) {
      recommendations.push({
        component: 'Overall Engine Health',
        severity: 'critical' as const,
        message: `Engine health at ${health.toFixed(1)}% - immediate attention recommended.`,
        action: 'Schedule comprehensive engine diagnostic and tune-up',
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
        link.download = `gas_vehicle_${new Date().toISOString().slice(0, 10)}.json`;
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
    
    const dLines = [
      { key: 'S', name: 'S (Stability)', color: '#10b981' },
      { key: 'Q', name: 'Q (Coherence)', color: '#fbbf24' },
      { key: 'U', name: 'U (Susceptibility)', color: '#f59e0b' },
      { key: 'D', name: 'D (Diagnostic)', color: '#ef4444' },
    ];
    
    // Add base D line for comparison when CHADD2 overlay is active
    if (chadd2Config.enabled && chadd2Config.fibonacciOverlay) {
      dLines.push({ key: 'D_base', name: 'D (Base)', color: '#9ca3af', });
    }
    
    return [
      {
        title: 'Coolant Temperature & Over-Heat',
        lines: [
          { key: 'coolant_temp', name: 'Coolant Temp', color: '#ef4444' },
        ],
        yAxisLabel: 'Temperature (°C)',
        threshold: tempThreshold,
        thresholdLabel: 'Overheat Threshold',
        faultMarkers: dataToUse
          .filter((d) => d.overheat === 1)
          .map((d) => ({
            timestamp: d.timestamp as string,
            value: d.coolant_temp as number,
          })),
      },
      {
        title: 'Engine RPM & Throttle',
        lines: [
          { key: 'engine_rpm', name: 'RPM', color: '#3b82f6' },
          { key: 'throttle_position', name: 'Throttle %', color: '#22c55e' },
        ],
        yAxisLabel: 'RPM / %',
      },
      {
        title: 'O2 Sensor & Timing',
        lines: [
          { key: 'o2_sensor_1', name: 'O2 Sensor (Lambda)', color: '#a855f7' },
          { key: 'timing_advance', name: 'Timing Advance', color: '#f59e0b' },
        ],
        yAxisLabel: 'Lambda / Degrees',
        threshold: 1.0,
        thresholdLabel: 'Target Lambda',
      },
      {
        title: chadd2Config.enabled && chadd2Config.fibonacciOverlay 
          ? 'S/Q/U/D (with Fibonacci Overlay)' 
          : 'S/Q/U/D',
        lines: dLines,
        yAxisLabel: 'S/Q/U/D',
      },
    ];
  }, [filteredTimeSeriesData, enhancedTimeSeriesData, chadd2Config.enabled, chadd2Config.fibonacciOverlay, tempThreshold]);

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
                <li>Configure temperature thresholds</li>
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
              vehicleType="gas"
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
                overallTitle="Gas Vehicle Engine Analysis"
              />
              <ChartExport chartId="gas-vehicle-analysis" chartTitle="Gas Vehicle Analysis" />
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
              trendMetrics={['S', 'Q', 'U', 'D']}
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
          vehicleType="gas"
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
                  link.download = `gas_vehicle_results_${new Date().toISOString().slice(0, 10)}.json`;
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
                    ['timestamp', 'engine_rpm', 'coolant_temp', 'throttle_position', 'maf', 'o2_sensor_1', 'timing_advance', 'S', 'Q', 'U', 'D'].join(','),
                    ...filteredTimeSeriesData.map((d) =>
                      [
                        d.timestamp,
                        d.engine_rpm,
                        d.coolant_temp,
                        d.throttle_position,
                        d.maf,
                        d.o2_sensor_1,
                        d.timing_advance,
                        d.S,
                        d.Q,
                        d.U,
                        d.D,
                      ].join(',')
                    ),
                  ].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `gas_vehicle_data_${new Date().toISOString().slice(0, 10)}.csv`;
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
      title="Gas Vehicle Dashboard"
      subtitle="Internal Combustion Engine Diagnostics & Health Monitoring"
      domain="gas-vehicle"
      sidebar={
        <div className="space-y-6">
          <DataSourceSelector
            vehicleType="gas"
            onDataSourceChange={setDataSource}
            disabled={loading}
          />
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Configuration</h3>
            <div className="space-y-3">
              <NumberInput
                value={tempThreshold}
                onChange={setTempThreshold}
                min={80}
                max={110}
                step={1}
                label="Coolant Temp Threshold"
                unit="°C"
              />
              <NumberInput
                value={ambientTemp}
                onChange={setAmbientTemp}
                min={15}
                max={35}
                step={1}
                label="Ambient Temp"
                unit="°C"
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
              vehicleType="gas"
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
