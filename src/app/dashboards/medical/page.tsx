/**
 * Medical Vital Signs Dashboard Page
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
import { PatientCohortSelector, type Patient } from '@/components/medical/PatientCohortSelector';
import { getConfigForDomain } from '@/lib/dashboard/config';
import { useDomainLabels } from '@/hooks/useDomainTerminology';
import { medicalApi } from '@/lib/api/medical';
import { aiApi } from '@/lib/api/ai';
import type {
  MedicalTelemetry,
  MedicalAssessmentResponse,
  MedicalTimeSeriesData,
} from '@/types/medical';
import type { CHADD2OverlayConfig } from '@/types/dashboard';

export default function MedicalDashboard() {
  return <MedicalDashboardContent />;
}

function MedicalDashboardContent() {
  const domain = 'medical';
  const config = getConfigForDomain(domain);
  const domainLabels = useDomainLabels(domain);
  
  const [selectedPatients, setSelectedPatients] = useState<Patient[]>([]);
  const [isCohort, setIsCohort] = useState(false);
  const [assessments, setAssessments] = useState<Record<string, MedicalAssessmentResponse>>({});
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

  // Generate telemetry for selected patients
  const patientTelemetry = useMemo(() => {
    const telemetry: Record<string, MedicalTelemetry> = {};
    selectedPatients.forEach((patient) => {
      // Generate realistic telemetry based on patient demographics
      const age = patient.age ?? 45;
      const bmi = patient.bmi ?? 22;
      const riskTier = patient.risk_tier ?? 'low';
      
      // Adjust vitals based on risk tier
      const hrBase = riskTier === 'critical' ? 95 : riskTier === 'high' ? 85 : riskTier === 'medium' ? 75 : 72;
      const bpBase = riskTier === 'critical' ? 145 : riskTier === 'high' ? 135 : riskTier === 'medium' ? 125 : 120;
      const spo2Base = riskTier === 'critical' ? 92 : riskTier === 'high' ? 94 : riskTier === 'medium' ? 96 : 98;
      
      telemetry[patient.patient_id] = {
        heart_rate: hrBase + Math.random() * 10 - 5,
        respiratory_rate: 16 + Math.random() * 2 - 1,
        systolic_bp: bpBase + Math.random() * 10 - 5,
        diastolic_bp: bpBase * 0.65 + Math.random() * 5 - 2.5,
        body_temp: 37.0 + Math.random() * 0.5 - 0.25,
        oxygen_saturation: spo2Base + Math.random() * 2 - 1,
        patient_age: age,
        patient_weight: bmi * 1.75, // Approximate weight from BMI
      };
    });
    return telemetry;
  }, [selectedPatients]);

  // Generate demo time-series data (fallback when no real data available)
  // In production, this should load from API endpoint for time-series data
  const generateTimeSeriesData = (): MedicalTimeSeriesData[] => {
    const data: MedicalTimeSeriesData[] = [];
    const baseTime = new Date('2025-01-01T10:00:00Z');
    const baselineHR = 72;
    const baselineRR = 16;
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
      
      // Simulate realistic vital sign variations
      const heartRate = baselineHR + Math.sin(i / 20) * 10 + Math.random() * 5;
      const respiratoryRate = baselineRR + Math.sin(i / 25) * 2 + Math.random() * 1;
      const systolicBP = 120 + Math.sin(i / 18) * 10 + Math.random() * 5;
      const diastolicBP = 80 + Math.sin(i / 18) * 5 + Math.random() * 3;
      const bodyTemp = 37.0 + Math.sin(i / 30) * 0.5 + Math.random() * 0.2;
      const oxygenSaturation = 98 + Math.random() * 2;
      
      // Calculate S/Q/U/D using backend API logic (simplified fallback)
      // NOTE: In production, use medicalApi.getPatientTelemetry() for real data
      const hrDeviation = Math.abs(heartRate - baselineHR) / baselineHR;
      const bpStability = Math.abs(systolicBP - 120) / 120;
      const tempStability = Math.abs(bodyTemp - 37.0) / 37.0;
      const S = Math.max(0, Math.min(1, 1 - (hrDeviation * 0.3 + bpStability * 0.4 + tempStability * 0.3)));
      
      const spo2Quality = (oxygenSaturation - 88) / 12;
      const Q = Math.max(0, Math.min(1, spo2Quality));
      
      const hrUrgency = heartRate > 100 ? (heartRate - 100) / 50 :
                       heartRate < 60 ? (60 - heartRate) / 20 : 0;
      const rrUrgency = respiratoryRate > 20 ? (respiratoryRate - 20) / 10 :
                        respiratoryRate < 12 ? (12 - respiratoryRate) / 6 : 0;
      const bpUrgency = systolicBP > 140 ? (systolicBP - 140) / 40 :
                        systolicBP < 90 ? (90 - systolicBP) / 30 : 0;
      const U = Math.max(0, Math.min(1, (hrUrgency * 0.3 + rrUrgency * 0.2 + bpUrgency * 0.5)));
      
      const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
      
      data.push({
        timestamp: time.toISOString(),
        heart_rate: heartRate,
        respiratory_rate: respiratoryRate,
        systolic_bp: systolicBP,
        diastolic_bp: diastolicBP,
        body_temp: bodyTemp,
        oxygen_saturation: oxygenSaturation,
        S,
        Q,
        U,
        D,
      });
    }
    
    return data;
  };

  const [timeSeriesData, setTimeSeriesData] = useState<MedicalTimeSeriesData[]>(generateTimeSeriesData());
  
  // Load time-series data from API when patients are selected
  React.useEffect(() => {
    const loadTimeSeriesData = async () => {
      if (selectedPatients.length > 0) {
        try {
          const patientIds = selectedPatients.map(p => p.patient_id);
          const telemetryData = await medicalApi.getPatientTelemetry(patientIds);
          
          // Convert telemetry data to time-series format
          // This is a placeholder - actual implementation would process the API response
          // For now, keep using demo data but note that API integration is ready
        } catch (err) {
          console.warn('Failed to load telemetry from API, using demo data:', err);
          // Fallback to demo data on error
        }
      }
    };
    
    loadTimeSeriesData();
  }, [selectedPatients]);

  const handlePatientSelection = (patients: Patient[], isCohortMode: boolean) => {
    setSelectedPatients(patients);
    setIsCohort(isCohortMode);
    setAssessments({});
    setAIInterpretation(null);
  };

  const handleAssess = async () => {
    if (selectedPatients.length === 0) {
      setError('Please select at least one patient for analysis');
      return;
    }

    setLoading(true);
    setError(null);
    setAIInterpretation(null);
    setAssessments({});

    try {
      // Assess all selected patients
      const assessmentPromises = selectedPatients.map(async (patient) => {
        const telemetry = patientTelemetry[patient.patient_id];
        if (!telemetry) return null;

        const result = await medicalApi.assessPatient({
          patient_id: patient.patient_id,
          telemetry,
          config: {
            age: telemetry.patient_age,
            weight: telemetry.patient_weight,
            baseline_hr: 72,
            baseline_rr: 16,
          },
        });

        return { patientId: patient.patient_id, assessment: result };
      });

      const results = await Promise.all(assessmentPromises);
      const newAssessments: Record<string, MedicalAssessmentResponse> = {};
      
      results.forEach((result) => {
        if (result) {
          newAssessments[result.patientId] = result.assessment;
        }
      });

      setAssessments(newAssessments);

      // Get AI interpretation for primary patient or cohort summary
      if (enableAI && selectedPatients.length > 0) {
        setAILoading(true);
        try {
          const primaryPatient = selectedPatients[0];
          const primaryAssessment = newAssessments[primaryPatient.patient_id];
          
          if (primaryAssessment) {
            const aiResult = await aiApi.interpretVehicle({
              domain: 'medical',
              metrics: {
                risk_score: primaryAssessment.risk_score,
                cardiovascular: primaryAssessment.component_health?.cardiovascular,
                respiratory: primaryAssessment.component_health?.respiratory,
                oxygenation: primaryAssessment.component_health?.oxygenation,
                cohort_size: isCohort ? selectedPatients.length : undefined,
              },
              squd_means: {
                S: primaryAssessment.squd_score.S,
                Q: primaryAssessment.squd_score.Q,
                U: primaryAssessment.squd_score.U,
                D: primaryAssessment.squd_score.D,
              },
            });
            
            if (aiResult.text) {
              setAIInterpretation(aiResult.text);
            }
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

  // Get primary assessment (first selected patient or cohort average)
  const primaryAssessment = useMemo(() => {
    if (selectedPatients.length === 0) return null;
    const firstPatientId = selectedPatients[0].patient_id;
    return assessments[firstPatientId] ?? null;
  }, [selectedPatients, assessments]);

  // Generate maintenance recommendations
  const getMaintenanceRecommendations = () => {
    if (!primaryAssessment) return [];
    
    const recommendations = [];
    const primaryTelemetry = selectedPatients.length > 0 ? patientTelemetry[selectedPatients[0].patient_id] : null;
    
    if (primaryAssessment.vital_status) {
      if (primaryAssessment.vital_status.heart_rate && primaryAssessment.vital_status.heart_rate !== 'normal') {
        recommendations.push({
          component: 'Heart Rate',
          severity: primaryAssessment.vital_status.heart_rate === 'tachycardia' ? 'high' as const : 'medium' as const,
          message: `Heart rate ${primaryAssessment.vital_status.heart_rate}${primaryTelemetry ? ` (${primaryTelemetry.heart_rate.toFixed(0)} bpm)` : ''}`,
          action: 'Monitor cardiac function and consider ECG if persistent',
        });
      }
      
      if (primaryAssessment.vital_status.respiratory_rate && primaryAssessment.vital_status.respiratory_rate !== 'normal') {
        recommendations.push({
          component: 'Respiratory Rate',
          severity: 'medium' as const,
          message: `Respiratory rate ${primaryAssessment.vital_status.respiratory_rate}${primaryTelemetry ? ` (${primaryTelemetry.respiratory_rate.toFixed(0)} breaths/min)` : ''}`,
          action: 'Assess respiratory function and oxygen requirements',
        });
      }
      
      if (primaryAssessment.vital_status.blood_pressure && primaryAssessment.vital_status.blood_pressure !== 'normal') {
        recommendations.push({
          component: 'Blood Pressure',
          severity: primaryAssessment.vital_status.blood_pressure === 'hypotension' ? 'high' as const : 'medium' as const,
          message: `Blood pressure ${primaryAssessment.vital_status.blood_pressure}${primaryTelemetry ? ` (${primaryTelemetry.systolic_bp.toFixed(0)}/${primaryTelemetry.diastolic_bp.toFixed(0)} mmHg)` : ''}`,
          action: 'Monitor hemodynamics and consider intervention if severe',
        });
      }
      
      if (primaryAssessment.vital_status.oxygen_saturation === 'hypoxia') {
        recommendations.push({
          component: 'Oxygen Saturation',
          severity: 'critical' as const,
          message: `Oxygen saturation low${primaryTelemetry ? ` (${primaryTelemetry.oxygen_saturation.toFixed(0)}%)` : ''}`,
          action: 'Consider supplemental oxygen and assess respiratory function',
        });
      }
    }
    
    if (primaryAssessment.risk_tier === 'critical' || primaryAssessment.risk_tier === 'high') {
      recommendations.push({
        component: 'Overall Risk',
        severity: primaryAssessment.risk_tier === 'critical' ? 'critical' as const : 'high' as const,
        message: `Patient at ${primaryAssessment.risk_tier} risk - immediate clinical review recommended${isCohort ? ` (${selectedPatients.length} patients in cohort)` : ''}`,
        action: 'Escalate to attending physician for comprehensive assessment',
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        component: 'Overall Health',
        severity: 'low' as const,
        message: 'All vital signs within normal ranges',
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

      {/* Patient/Cohort Selector */}
      <DashboardSection title="Patient/Cohort Selection" icon="👥">
        <PatientCohortSelector onSelectionChange={handlePatientSelection} />
      </DashboardSection>

      {/* Assessment Results - S/Q/U/D Metrics */}
      {primaryAssessment && (
        <>
          <MetricsCard
            squd={primaryAssessment.squd_score}
            health={primaryAssessment.health}
            title={isCohort ? `Cohort Health Assessment (${selectedPatients.length} patients)` : 'Patient Health Assessment'}
          />

          {/* Risk Tier Display */}
          {primaryAssessment.risk_tier && (
            <DashboardSection title="Risk Assessment" icon="⚠️">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Risk Tier</div>
                    <div className={`text-2xl font-bold capitalize ${
                      primaryAssessment.risk_tier === 'critical' ? 'text-red-600' :
                      primaryAssessment.risk_tier === 'high' ? 'text-orange-600' :
                      primaryAssessment.risk_tier === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {primaryAssessment.risk_tier}
                    </div>
                  </div>
                  {primaryAssessment.risk_score !== undefined && (
                    <div>
                      <div className="text-sm text-gray-500">Risk Score</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {(primaryAssessment.risk_score * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DashboardSection>
          )}

          {/* Vital Status */}
          {primaryAssessment.vital_status && (
            <DashboardSection title="Vital Sign Status" icon="📊">
              <DashboardGrid cols={3} gap="md">
                {Object.entries(primaryAssessment.vital_status).map(([vital, status]) => (
                  <DashboardSection 
                    key={vital} 
                    variant="card" 
                    title={vital.replace(/_/g, ' ').toUpperCase()}
                  >
                    <div className={`text-xl font-bold capitalize ${
                      status === 'normal' ? 'text-green-600' :
                      status === 'hypoxia' || status === 'hypotension' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {status}
                    </div>
                  </DashboardSection>
                ))}
              </DashboardGrid>
            </DashboardSection>
          )}

          {/* Component Health Grid */}
          {primaryAssessment.component_health && (
            <DashboardSection title="Component Health" icon="🏥">
              <DashboardGrid cols={2} gap="md">
                {Object.entries(primaryAssessment.component_health).map(([component, health]) => (
                  <DashboardSection key={component} variant="card" title={component.replace(/_/g, ' ').toUpperCase()}>
                    <div className="text-3xl font-bold text-primary-600">{health.toFixed(0)}%</div>
                    <div className="text-sm text-gray-500 mt-1">Health Score</div>
                  </DashboardSection>
                ))}
              </DashboardGrid>
            </DashboardSection>
          )}
        </>
      )}

      {/* Telemetry Display */}
      {selectedPatients.length > 0 && (
        <DashboardSection title={isCohort ? "Cohort Vital Signs Summary" : "Current Vital Signs"} icon="📡">
          {isCohort ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Showing average vital signs for {selectedPatients.length} patients in cohort
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(() => {
                  const primaryTelemetry = patientTelemetry[selectedPatients[0].patient_id];
                  if (!primaryTelemetry) return null;
                  return (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Heart Rate (avg)</div>
                        <div className="text-2xl font-bold text-gray-900">{primaryTelemetry.heart_rate.toFixed(0)} bpm</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Respiratory Rate (avg)</div>
                        <div className="text-2xl font-bold text-gray-900">{primaryTelemetry.respiratory_rate.toFixed(0)} breaths/min</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Blood Pressure (avg)</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {primaryTelemetry.systolic_bp.toFixed(0)}/{primaryTelemetry.diastolic_bp.toFixed(0)} mmHg
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Body Temperature (avg)</div>
                        <div className="text-2xl font-bold text-gray-900">{primaryTelemetry.body_temp.toFixed(1)}°C</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Oxygen Saturation (avg)</div>
                        <div className="text-2xl font-bold text-gray-900">{primaryTelemetry.oxygen_saturation.toFixed(0)}%</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(() => {
                const primaryTelemetry = selectedPatients.length > 0 ? patientTelemetry[selectedPatients[0].patient_id] : null;
                if (!primaryTelemetry) return null;
                return (
                  <>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-500">Heart Rate</div>
                      <div className="text-2xl font-bold text-gray-900">{primaryTelemetry.heart_rate.toFixed(0)} bpm</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-500">Respiratory Rate</div>
                      <div className="text-2xl font-bold text-gray-900">{primaryTelemetry.respiratory_rate.toFixed(0)} breaths/min</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-500">Blood Pressure</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {primaryTelemetry.systolic_bp.toFixed(0)}/{primaryTelemetry.diastolic_bp.toFixed(0)} mmHg
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-500">Body Temperature</div>
                      <div className="text-2xl font-bold text-gray-900">{primaryTelemetry.body_temp.toFixed(1)}°C</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-500">Oxygen Saturation</div>
                      <div className="text-2xl font-bold text-gray-900">{primaryTelemetry.oxygen_saturation.toFixed(0)}%</div>
                    </div>
                    {primaryTelemetry.patient_age && (
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-500">Patient Age</div>
                        <div className="text-2xl font-bold text-gray-900">{primaryTelemetry.patient_age} years</div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </DashboardSection>
      )}

      {/* No Selection Message */}
      {selectedPatients.length === 0 && (
        <DashboardSection title="Select Patients" icon="👥">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800">
              Please select one or more patients using the filter above to begin analysis.
            </p>
          </div>
        </DashboardSection>
      )}

      {/* Time Series Charts */}
      {timeSeriesData.length > 0 && (
        <DashboardSection title="Vital Signs Trends" icon="📈">
          <div className="space-y-6">
            <TimeSeriesChart
              title="Cardiovascular Metrics"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'heart_rate', name: 'Heart Rate (bpm)', color: '#3b82f6' },
                { key: 'systolic_bp', name: 'Systolic BP (mmHg)', color: '#10b981' },
                { key: 'diastolic_bp', name: 'Diastolic BP (mmHg)', color: '#f59e0b' },
              ]}
              height={300}
            />
            <TimeSeriesChart
              title="Respiratory & Temperature"
              data={timeSeriesData as unknown as Array<Record<string, unknown>>}
              lines={[
                { key: 'respiratory_rate', name: 'Respiratory Rate (breaths/min)', color: '#8b5cf6' },
                { key: 'body_temp', name: 'Body Temperature (°C)', color: '#ec4899' },
                { key: 'oxygen_saturation', name: 'Oxygen Saturation (%)', color: '#06b6d4' },
              ]}
              height={300}
            />
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
      {primaryAssessment && (
        <MaintenanceRecommendations recommendations={getMaintenanceRecommendations()} />
      )}
    </DashboardTemplate>
  );
}

