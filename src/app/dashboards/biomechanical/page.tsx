/**
 * Biomechanical Analysis Dashboard Page
 * Comprehensive dashboard using template system with domain-specific terminology
 */

'use client';

import React, { useState, useMemo } from 'react';
import { DashboardTemplate } from '@/components/dashboard/template/DashboardTemplate';
import { DashboardSection } from '@/components/dashboard/template/DashboardSection';
import { DashboardGrid } from '@/components/dashboard/template/DashboardSection';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TimeSeriesChart } from '@/components/dashboard/TimeSeriesChart';
import { AIInterpretationCard } from '@/components/dashboard/AIInterpretation';
import { MaintenanceRecommendations } from '@/components/dashboard/MaintenanceRecommendations';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { useDomainLabels } from '@/hooks/useDomainTerminology';
import { biomechanicalApi } from '@/lib/api/medical';
import { aiApi } from '@/lib/api/ai';
import type {
  BiomechanicalTelemetry,
  BiomechanicalAssessmentResponse,
} from '@/types/medical';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function BiomechanicalDashboard() {
  return <BiomechanicalDashboardContent />;
}

function BiomechanicalDashboardContent() {
  const domain = 'biomechanical';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<BiomechanicalTelemetry[]>([]);
  const [assessment, setAssessment] = useState<BiomechanicalAssessmentResponse | null>(null);
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
  const [dataType, setDataType] = useState<'gait' | 'balance' | 'kinematics' | 'imu' | 'mixed'>('mixed');

  // Generate demo telemetry for testing
  const generateDemoTelemetry = (): BiomechanicalTelemetry[] => {
    const data: BiomechanicalTelemetry[] = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 100); // 100ms intervals
      
      // Generate realistic biomechanical data
      const strideTime = 1.2 + Math.sin(i / 20) * 0.1 + Math.random() * 0.05;
      const stepLengthLeft = 0.7 + Math.sin(i / 25) * 0.05 + Math.random() * 0.02;
      const stepLengthRight = 0.68 + Math.sin(i / 25) * 0.05 + Math.random() * 0.02;
      const cadence = 100 / strideTime;
      const gaitVelocity = ((stepLengthLeft + stepLengthRight) * cadence) / 120;
      
      // COP data
      const copX = Math.sin(i / 15) * 5 + Math.random() * 2;
      const copY = Math.cos(i / 18) * 5 + Math.random() * 2;
      
      // Joint angle
      const jointAngle = 45 + Math.sin(i / 10) * 15 + Math.random() * 5;
      
      // IMU data
      const accelX = Math.sin(i / 8) * 0.5 + Math.random() * 0.2;
      const accelY = Math.cos(i / 10) * 0.3 + Math.random() * 0.1;
      const accelZ = 9.8 + Math.random() * 0.5;
      
      data.push({
        timestamp: time.toISOString(),
        stride_time: strideTime,
        step_length_left: stepLengthLeft,
        step_length_right: stepLengthRight,
        cadence,
        gait_velocity: gaitVelocity,
        cop_x: copX,
        cop_y: copY,
        joint_angle: jointAngle,
        accel_x: accelX,
        accel_y: accelY,
        accel_z: accelZ,
      });
    }
    
    return data;
  };

  // Initialize demo data
  React.useEffect(() => {
    if (telemetry.length === 0) {
      setTelemetry(generateDemoTelemetry());
      setSelectedSubject('SUBJ-001');
    }
  }, [telemetry.length]);

  // Generate time-series data from telemetry
  const timeSeriesData = useMemo(() => {
    return telemetry.map((t, idx) => ({
      timestamp: t.timestamp || new Date(Date.now() + idx * 100).toISOString(),
      stride_time: t.stride_time || 0,
      gait_velocity: t.gait_velocity || 0,
      cop_x: t.cop_x || 0,
      cop_y: t.cop_y || 0,
      joint_angle: t.joint_angle || 0,
      S: assessment?.squd_score?.S || 0.7,
      Q: assessment?.squd_score?.Q || 0.8,
      U: assessment?.squd_score?.U || 0.2,
      D: assessment?.squd_score?.D || 0.2,
    }));
  }, [telemetry, assessment]);

  const handleAssess = async () => {
    if (telemetry.length === 0 || !selectedSubject) {
      setError('Please ensure telemetry data is available');
      return;
    }

    setLoading(true);
    setError(null);
    setAIInterpretation(null);
    setAssessment(null);

    try {
      const result = await biomechanicalApi.assessBiomechanical({
        subject_id: selectedSubject,
        telemetry,
        data_type: dataType,
      });

      setAssessment(result);

      // Get AI interpretation
      if (enableAI && result) {
        setAILoading(true);
        try {
          const aiResult = await aiApi.interpretVehicle({
            domain: 'biomechanical',
            metrics: {
              risk_score: result.risk_score,
              movement_stability: result.squd_score.S,
              movement_quality: result.squd_score.Q,
              fall_risk: result.squd_score.U,
            },
            squd_means: result.squd_score,
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

  // Generate recommendations from assessment
  const getRecommendations = () => {
    if (!assessment) return [];
    
    const recommendations = [];
    
    if (assessment.risk_tier === 'high') {
      recommendations.push({
        component: 'Fall Risk',
        severity: 'high' as const,
        message: 'High fall risk detected - immediate attention recommended',
        action: 'Consider balance assessment and fall prevention measures',
      });
    }
    
    if (assessment.squd_score.U > 0.6) {
      recommendations.push({
        component: 'Movement Urgency',
        severity: 'high' as const,
        message: `High urgency score (U = ${assessment.squd_score.U.toFixed(2)})`,
        action: 'Assess for movement impairments and balance deficits',
      });
    }
    
    if (assessment.squd_score.S < 0.5) {
      recommendations.push({
        component: 'Movement Stability',
        severity: 'medium' as const,
        message: `Low stability (S = ${assessment.squd_score.S.toFixed(2)})`,
        action: 'Consider gait training and rehabilitation interventions',
      });
    }
    
    if (assessment.squd_score.Q < 0.5) {
      recommendations.push({
        component: 'Movement Quality',
        severity: 'medium' as const,
        message: `Poor movement quality (Q = ${assessment.squd_score.Q.toFixed(2)})`,
        action: 'Consider movement therapy and quality improvement programs',
      });
    }
    
    if (assessment.recommendations && assessment.recommendations.length > 0) {
      assessment.recommendations.forEach((rec) => {
        recommendations.push({
          component: 'Assessment',
          severity: 'low' as const,
          message: rec,
          action: 'Review and consider clinical intervention',
        });
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        component: 'Overall Movement',
        severity: 'low' as const,
        message: 'Movement patterns within normal ranges',
        action: 'Continue routine monitoring',
      });
    }
    
    return recommendations;
  };

  const actions = [
    {
      id: 'assess',
      label: 'Run Assessment',
      icon: '▶️',
      onClick: handleAssess,
      variant: 'primary' as const,
      disabled: loading || telemetry.length === 0,
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

      {/* Subject Selection */}
      <DashboardSection title="Subject Selection" icon="👤">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject ID
            </label>
            <input
              type="text"
              value={selectedSubject || ''}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="SUBJ-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Type
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="mixed">Mixed</option>
              <option value="gait">Gait</option>
              <option value="balance">Balance</option>
              <option value="kinematics">Kinematics</option>
              <option value="imu">IMU</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Currently using demo telemetry data. In production, this would load from your data source.
        </div>
      </DashboardSection>

      {/* Assessment Results - S/Q/U/D Metrics */}
      {assessment && (
        <>
          <MetricsCard
            squd={assessment.squd_score}
            health={assessment.health}
            title="Movement Health Assessment"
          />

          {/* Risk Tier Display */}
          {assessment.risk_tier && (
            <DashboardSection title="Risk Assessment" icon="⚠️">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Risk Tier</div>
                    <div className={`text-2xl font-bold capitalize ${
                      assessment.risk_tier === 'high' ? 'text-red-600' :
                      assessment.risk_tier === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {assessment.risk_tier}
                    </div>
                  </div>
                  {assessment.risk_score !== undefined && (
                    <div>
                      <div className="text-sm text-gray-500">Risk Score</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {(assessment.risk_score * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DashboardSection>
          )}

          {/* Movement Metrics */}
          {assessment.movement_metrics && (
            <DashboardSection title="Movement Metrics" icon="📊">
              <DashboardGrid cols={3} gap="md">
                {Object.entries(assessment.movement_metrics).map(([metric, value]) => (
                  <DashboardSection 
                    key={metric} 
                    variant="card" 
                    title={metric.replace(/_/g, ' ').toUpperCase()}
                  >
                    <div className="text-3xl font-bold text-primary-600">
                      {typeof value === 'number' ? value.toFixed(2) : String(value)}
                    </div>
                  </DashboardSection>
                ))}
              </DashboardGrid>
            </DashboardSection>
          )}
        </>
      )}

      {/* Time Series Charts */}
      {timeSeriesData.length > 0 && (
        <DashboardSection title="Biomechanical Data Trends" icon="📈">
          <div className="space-y-6">
            {dataType === 'gait' || dataType === 'mixed' ? (
              <>
                <TimeSeriesChart
                  title="Gait Metrics"
                  data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                  lines={[
                    { key: 'stride_time', name: 'Stride Time (s)', color: '#3b82f6' },
                    { key: 'gait_velocity', name: 'Gait Velocity (m/s)', color: '#10b981' },
                  ]}
                  height={300}
                />
              </>
            ) : null}
            
            {dataType === 'balance' || dataType === 'mixed' ? (
              <>
                <TimeSeriesChart
                  title="Balance - Center of Pressure"
                  data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                  lines={[
                    { key: 'cop_x', name: 'COP X (mm)', color: '#8b5cf6' },
                    { key: 'cop_y', name: 'COP Y (mm)', color: '#ec4899' },
                  ]}
                  height={300}
                />
              </>
            ) : null}
            
            {dataType === 'kinematics' || dataType === 'mixed' ? (
              <>
                <TimeSeriesChart
                  title="Joint Kinematics"
                  data={timeSeriesData as unknown as Array<Record<string, unknown>>}
                  lines={[
                    { key: 'joint_angle', name: 'Joint Angle (degrees)', color: '#06b6d4' },
                  ]}
                  height={300}
                />
              </>
            ) : null}

            <TimeSeriesChart
              title={`${domainLabels.getFrameworkName()} Metrics`}
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'S', name: domainLabels.getSQUDLabel('S'), color: '#2ca02c' },
                { key: 'Q', name: domainLabels.getSQUDLabel('Q'), color: '#1f77b4' },
                { key: 'U', name: domainLabels.getSQUDLabel('U'), color: '#d62728' },
                { key: 'D', name: domainLabels.getSQUDLabel('D'), color: '#9467bd' },
              ]}
              height={300}
            />
          </div>
        </DashboardSection>
      )}

      {/* AI Interpretation */}
      {enableAI && (
        <AIInterpretationCard
          interpretation={aiInterpretation}
          loading={aiLoading}
        />
      )}

      {/* Maintenance Recommendations */}
      {assessment && (
        <MaintenanceRecommendations recommendations={getRecommendations()} />
      )}
    </DashboardTemplate>
  );
}

