/**
 * Medical/Vital Signs API Client
 */

import type {
  MedicalAssessmentRequest,
  MedicalAssessmentResponse,
  BiomechanicalAssessmentRequest,
  BiomechanicalAssessmentResponse,
} from '@/types/medical';
import type { PatientFilter, Patient } from '@/components/medical/PatientCohortSelector';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Medical API methods
 */
export const medicalApi = {
  /**
   * Assess patient vital signs health
   */
  async assessPatient(request: MedicalAssessmentRequest): Promise<MedicalAssessmentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/medical/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        // Fallback to demo data if API not available
        return generateDemoAssessment(request);
      }

      return response.json();
    } catch (err) {
      // Fallback to demo data if API not available
      console.warn('Medical API not available, using demo data:', err);
      return generateDemoAssessment(request);
    }
  },

  /**
   * Get filter options (distinct values for sex, risk tiers, etc.)
   */
  async getFilterOptions(): Promise<{
    sex: string[];
    riskTiers: string[];
    riskFactors: string[];
  }> {
    try {
      const response = await fetch(`${API_URL}/api/v1/medical/filter-options`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Fallback to defaults
        return {
          sex: ['M', 'F'],
          riskTiers: ['low', 'medium', 'high', 'critical'],
          riskFactors: [
            'diabetes',
            'hypertension',
            'cardiovascular',
            'respiratory',
            'obesity',
            'smoking',
            'chronic_kidney_disease',
            'immunocompromised',
          ],
        };
      }

      return response.json();
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
      return {
        sex: ['M', 'F'],
        riskTiers: ['low', 'medium', 'high', 'critical'],
        riskFactors: [
          'diabetes',
          'hypertension',
          'cardiovascular',
          'respiratory',
          'obesity',
          'smoking',
          'chronic_kidney_disease',
          'immunocompromised',
        ],
      };
    }
  },

  /**
   * Filter patients based on criteria
   */
  async filterPatients(filter: PatientFilter): Promise<{
    patients: Patient[];
    total: number;
    matched: number;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/v1/medical/filter-patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter),
      });

      if (!response.ok) {
        // Fallback to demo data
        return generateDemoFilterResult(filter);
      }

      return response.json();
    } catch (err) {
      console.error('Failed to filter patients:', err);
      return generateDemoFilterResult(filter);
    }
  },

  /**
   * Get patient telemetry data
   */
  async getPatientTelemetry(patientIds: string[]): Promise<Record<string, any[]>> {
    try {
      const response = await fetch(`${API_URL}/api/v1/medical/telemetry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient_ids: patientIds }),
      });

      if (!response.ok) {
        // Fallback to demo data
        return generateDemoTelemetry(patientIds);
      }

      return response.json();
    } catch (err) {
      console.error('Failed to fetch telemetry:', err);
      return generateDemoTelemetry(patientIds);
    }
  },
};

/**
 * Generate demo assessment (fallback when API not available)
 */
function generateDemoAssessment(request: MedicalAssessmentRequest): MedicalAssessmentResponse {
  const { telemetry } = request;
  
  // Defaults
  const age = request.config?.age || 45;
  const baselineHR = request.config?.baseline_hr || 72;
  const baselineRR = request.config?.baseline_rr || 16;
  
  // Calculate S/Q/U/D based on medical vitals SQUD framework
  // S: Stability - cardiovascular homeostasis
  const hrDeviation = Math.abs(telemetry.heart_rate - baselineHR) / baselineHR;
  const bpStability = Math.abs(telemetry.systolic_bp - 120) / 120;
  const tempStability = Math.abs(telemetry.body_temp - 37.0) / 37.0;
  const S = Math.max(0, Math.min(1, 1 - (hrDeviation * 0.3 + bpStability * 0.4 + tempStability * 0.3)));
  
  // Q: Quality - oxygenation efficiency
  const spo2Quality = (telemetry.oxygen_saturation - 88) / 12; // Normalize 88-100% to 0-1
  const Q = Math.max(0, Math.min(1, spo2Quality));
  
  // U: Urgency - threshold violations and rate of change
  const hrUrgency = telemetry.heart_rate > 100 ? (telemetry.heart_rate - 100) / 50 :
                    telemetry.heart_rate < 60 ? (60 - telemetry.heart_rate) / 20 : 0;
  const rrUrgency = telemetry.respiratory_rate > 20 ? (telemetry.respiratory_rate - 20) / 10 :
                    telemetry.respiratory_rate < 12 ? (12 - telemetry.respiratory_rate) / 6 : 0;
  const bpUrgency = telemetry.systolic_bp > 140 ? (telemetry.systolic_bp - 140) / 40 :
                     telemetry.systolic_bp < 90 ? (90 - telemetry.systolic_bp) / 30 : 0;
  const tempUrgency = telemetry.body_temp > 38 ? (telemetry.body_temp - 38) / 2 :
                       telemetry.body_temp < 36 ? (36 - telemetry.body_temp) / 1 : 0;
  const U = Math.max(0, Math.min(1, (hrUrgency * 0.3 + rrUrgency * 0.2 + bpUrgency * 0.3 + tempUrgency * 0.2)));
  
  // D: Diagnostic (CHADD formula)
  const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
  
  const health = Math.round((1 - D) * 100);
  
  // Determine risk tier
  const riskScore = U * 0.4 + (1 - S) * 0.3 + (1 - Q) * 0.2 + D * 0.1;
  const riskTier = riskScore > 0.7 ? 'critical' :
                   riskScore > 0.5 ? 'high' :
                   riskScore > 0.3 ? 'medium' : 'low';
  
  // Determine vital statuses
  const vitalStatus = {
    heart_rate: telemetry.heart_rate > 100 ? 'tachycardia' :
                  telemetry.heart_rate < 60 ? 'bradycardia' : 'normal',
    respiratory_rate: telemetry.respiratory_rate > 20 ? 'tachypnea' :
                      telemetry.respiratory_rate < 12 ? 'bradypnea' : 'normal',
    blood_pressure: telemetry.systolic_bp > 140 ? 'hypertension' :
                    telemetry.systolic_bp < 90 ? 'hypotension' : 'normal',
    temperature: telemetry.body_temp > 38 ? 'fever' :
                 telemetry.body_temp < 36 ? 'hypothermia' : 'normal',
    oxygen_saturation: telemetry.oxygen_saturation < 95 ? 'hypoxia' : 'normal',
  };
  
  // Calculate component health
  const componentHealth = {
    cardiovascular: Math.max(0, Math.min(100, 100 - (hrDeviation * 50 + bpStability * 50))),
    respiratory: Math.max(0, Math.min(100, 100 - (rrUrgency * 100))),
    oxygenation: Math.max(0, Math.min(100, telemetry.oxygen_saturation)),
    thermoregulation: Math.max(0, Math.min(100, 100 - (tempStability * 100))),
  };
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (vitalStatus.heart_rate !== 'normal') {
    recommendations.push(`Heart rate ${vitalStatus.heart_rate} (${telemetry.heart_rate} bpm) - monitor cardiac function`);
  }
  if (vitalStatus.respiratory_rate !== 'normal') {
    recommendations.push(`Respiratory rate ${vitalStatus.respiratory_rate} (${telemetry.respiratory_rate} breaths/min) - assess respiratory function`);
  }
  if (vitalStatus.blood_pressure !== 'normal') {
    recommendations.push(`Blood pressure ${vitalStatus.blood_pressure} (${telemetry.systolic_bp}/${telemetry.diastolic_bp} mmHg) - monitor hemodynamics`);
  }
  if (vitalStatus.temperature !== 'normal') {
    recommendations.push(`Temperature ${vitalStatus.temperature} (${telemetry.body_temp.toFixed(1)}°C) - assess thermoregulation`);
  }
  if (vitalStatus.oxygen_saturation === 'hypoxia') {
    recommendations.push(`Oxygen saturation low (${telemetry.oxygen_saturation}%) - consider supplemental oxygen`);
  }
  if (recommendations.length === 0) {
    recommendations.push('All vital signs within normal ranges - continue routine monitoring');
  }
  
  return {
    squd_score: { S, Q, U, D },
    health,
    patient_id: request.patient_id,
    assessment_id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    risk_score: riskScore,
    risk_tier: riskTier,
    vital_status: vitalStatus,
    component_health: componentHealth,
    medical_metrics: {
      hr_variability: 1 - hrDeviation,
      bp_stability: 1 - bpStability,
      respiratory_efficiency: 1 - (rrUrgency / 2),
      oxygen_efficiency: Q,
    },
    recommendations,
  };
}

/**
 * Generate demo filter result
 */
function generateDemoFilterResult(filter: PatientFilter): {
  patients: Patient[];
  total: number;
  matched: number;
} {
  const patients: Patient[] = [];
  const ageMin = filter.ageMin ?? 18;
  const ageMax = filter.ageMax ?? 100;
  const bmiMin = filter.bmiMin ?? 15;
  const bmiMax = filter.bmiMax ?? 40;
  const sexOptions = filter.sex && filter.sex.length > 0 ? filter.sex : ['M', 'F'];
  const riskTierOptions =
    filter.riskTiers && filter.riskTiers.length > 0 ? filter.riskTiers : ['low', 'medium', 'high', 'critical'];

  // Generate 20-50 demo patients
  const count = 20 + Math.floor(Math.random() * 30);

  for (let i = 0; i < count; i++) {
    const age = ageMin + Math.floor(Math.random() * (ageMax - ageMin + 1));
    const bmi = bmiMin + Math.random() * (bmiMax - bmiMin);
    const sex = sexOptions[Math.floor(Math.random() * sexOptions.length)];
    const riskTier = riskTierOptions[Math.floor(Math.random() * riskTierOptions.length)];

    // Apply risk factors based on risk tier
    const riskFactors: string[] = [];
    if (riskTier === 'critical' || riskTier === 'high') {
      const factorCount = 1 + Math.floor(Math.random() * 3);
      const allFactors = [
        'diabetes',
        'hypertension',
        'cardiovascular',
        'respiratory',
        'obesity',
        'smoking',
        'chronic_kidney_disease',
        'immunocompromised',
      ];
      for (let j = 0; j < factorCount; j++) {
        const factor = allFactors[Math.floor(Math.random() * allFactors.length)];
        if (!riskFactors.includes(factor)) {
          riskFactors.push(factor);
        }
      }
    }

    // Apply filter logic
    let matches = true;
    if (filter.riskFactors && filter.riskFactors.length > 0) {
      if (filter.combiner === 'OR') {
        matches = filter.riskFactors.some((f) => riskFactors.includes(f));
      } else {
        matches = filter.riskFactors.every((f) => riskFactors.includes(f));
      }
    }

    if (matches) {
      patients.push({
        patient_id: `PAT-${String(i + 1).padStart(4, '0')}`,
        age,
        bmi,
        sex,
        risk_tier: riskTier,
        risk_factors: riskFactors,
      });
    }
  }

  return {
    patients,
    total: 1000, // Simulated total
    matched: patients.length,
  };
}

/**
 * Generate demo telemetry data for patients
 */
function generateDemoTelemetry(patientIds: string[]): Record<string, any[]> {
  const result: Record<string, any[]> = {};
  const baseTime = new Date('2025-01-01T10:00:00Z');

  patientIds.forEach((patientId) => {
    const data: any[] = [];
    for (let i = 0; i < 100; i++) {
      const time = new Date(baseTime.getTime() + i * 60000);
      const heartRate = 70 + Math.sin(i / 20) * 10 + Math.random() * 5;
      const respiratoryRate = 16 + Math.sin(i / 25) * 2 + Math.random() * 1;
      const systolicBP = 120 + Math.sin(i / 18) * 10 + Math.random() * 5;
      const diastolicBP = 80 + Math.sin(i / 18) * 5 + Math.random() * 3;
      const bodyTemp = 37.0 + Math.sin(i / 30) * 0.5 + Math.random() * 0.2;
      const oxygenSaturation = 98 + Math.random() * 2;

      data.push({
        timestamp: time.toISOString(),
        heart_rate: heartRate,
        respiratory_rate: respiratoryRate,
        systolic_bp: systolicBP,
        diastolic_bp: diastolicBP,
        body_temp: bodyTemp,
        oxygen_saturation: oxygenSaturation,
      });
    }
    result[patientId] = data;
  });

  return result;
}

/**
 * Biomechanical API methods
 */
export const biomechanicalApi = {
  /**
   * Assess biomechanical data (gait, balance, kinematics, IMU)
   */
  async assessBiomechanical(
    request: BiomechanicalAssessmentRequest
  ): Promise<BiomechanicalAssessmentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/medical/biomechanical/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (err) {
      console.error('Biomechanical API error:', err);
      throw err;
    }
  },

  /**
   * Analyze gait-specific data
   */
  async analyzeGait(
    request: BiomechanicalAssessmentRequest
  ): Promise<BiomechanicalAssessmentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/medical/biomechanical/gait`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, data_type: 'gait' }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (err) {
      console.error('Gait analysis API error:', err);
      throw err;
    }
  },

  /**
   * Analyze balance/posture data
   */
  async analyzeBalance(
    request: BiomechanicalAssessmentRequest
  ): Promise<BiomechanicalAssessmentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/medical/biomechanical/balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, data_type: 'balance' }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (err) {
      console.error('Balance analysis API error:', err);
      throw err;
    }
  },

  /**
   * Analyze joint kinematics data
   */
  async analyzeKinematics(
    request: BiomechanicalAssessmentRequest
  ): Promise<BiomechanicalAssessmentResponse> {
    try {
      const response = await fetch(`${API_URL}/api/v1/medical/biomechanical/kinematics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...request, data_type: 'kinematics' }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (err) {
      console.error('Kinematics analysis API error:', err);
      throw err;
    }
  },
};

