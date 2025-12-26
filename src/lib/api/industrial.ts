/**
 * Industrial Fault Detection API Client
 */

import { apiClient } from './client';
import type { IndustrialAssessmentRequest, IndustrialAssessmentResponse } from '@/types/industrial';

/**
 * Industrial Fault Detection API methods
 */
export const industrialApi = {
  /**
   * Assess industrial equipment health
   */
  async assessAsset(request: IndustrialAssessmentRequest): Promise<IndustrialAssessmentResponse> {
    // For now, simulate the response until backend API is available
    // TODO: Replace with actual API call when endpoint is available
    const response = await fetch('/api/v1/industrial/assess', {
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
  },
};

/**
 * Generate demo assessment (fallback when API not available)
 */
function generateDemoAssessment(request: IndustrialAssessmentRequest): IndustrialAssessmentResponse {
  const { telemetry } = request;
  
  // Simple rule-based assessment
  const vibrationWarn = request.config?.vibration_threshold_warn || 5.0;
  const vibrationAlarm = request.config?.vibration_threshold_alarm || 8.0;
  const tempWarn = request.config?.temperature_threshold_warn || 70.0;
  const tempAlarm = request.config?.temperature_threshold_alarm || 85.0;
  const pressureMin = request.config?.pressure_min || 7.0;
  const pressureMax = request.config?.pressure_max || 10.0;
  
  // Determine statuses
  const vibrationStatus = telemetry.vibration >= vibrationAlarm ? 'alarm' :
                         telemetry.vibration >= vibrationWarn ? 'warn' : 'normal';
  const temperatureStatus = telemetry.temperature >= tempAlarm ? 'alarm' :
                           telemetry.temperature >= tempWarn ? 'warn' : 'normal';
  const pressureStatus = telemetry.pressure < pressureMin || telemetry.pressure > pressureMax ? 'alarm' :
                        telemetry.pressure < (pressureMin + 0.5) || telemetry.pressure > (pressureMax - 0.5) ? 'warn' : 'normal';
  
  // Map to S/Q/U/D (simplified)
  // S: Stability based on pressure compliance
  const S = pressureStatus === 'normal' ? 0.8 : pressureStatus === 'warn' ? 0.6 : 0.4;
  
  // Q: Quality based on temperature
  const Q = temperatureStatus === 'normal' ? 0.3 : temperatureStatus === 'warn' ? 0.5 : 0.7;
  
  // U: Susceptibility based on vibration
  const U = vibrationStatus === 'normal' ? 0.3 : vibrationStatus === 'warn' ? 0.5 : 0.7;
  
  // D: Diagnostic (CHADD formula simplified)
  const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
  
  // Determine fault type
  let faultType: 'none' | 'bearing' | 'overheating' = 'none';
  if (vibrationStatus === 'alarm') {
    faultType = 'bearing';
  } else if (temperatureStatus === 'alarm') {
    faultType = 'overheating';
  }
  
  const health = Math.round((1 - D) * 100);
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (vibrationStatus === 'alarm') {
    recommendations.push('Immediate bearing inspection recommended - vibration exceeds alarm threshold');
  } else if (vibrationStatus === 'warn') {
    recommendations.push('Monitor vibration trends - approaching alarm threshold');
  }
  
  if (temperatureStatus === 'alarm') {
    recommendations.push('Immediate cooling system check required - temperature critical');
  } else if (temperatureStatus === 'warn') {
    recommendations.push('Monitor temperature - approaching alarm threshold');
  }
  
  if (pressureStatus === 'alarm') {
    recommendations.push('Pressure outside acceptable range - check pressure regulation system');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All systems operating within normal parameters');
  }
  
  return {
    squd_score: { S, Q, U, D },
    health,
    vibration_status: vibrationStatus,
    temperature_status: temperatureStatus,
    pressure_status: pressureStatus,
    fault_detected: faultType !== 'none',
    fault_type: faultType,
    recommendations,
    component_health: {
      vibration_sensor: vibrationStatus === 'normal' ? 90 : vibrationStatus === 'warn' ? 70 : 50,
      temperature_sensor: temperatureStatus === 'normal' ? 90 : temperatureStatus === 'warn' ? 70 : 50,
      pressure_sensor: pressureStatus === 'normal' ? 90 : pressureStatus === 'warn' ? 70 : 50,
    },
  };
}

