/**
 * Solar SCADA API Client
 */

import type { SolarAssessmentRequest, SolarAssessmentResponse } from '@/types/solar';

/**
 * Solar SCADA API methods
 */
export const solarApi = {
  /**
   * Assess solar plant health
   */
  async assessPlant(request: SolarAssessmentRequest): Promise<SolarAssessmentResponse> {
    // For now, simulate the response until backend API is available
    // TODO: Replace with actual API call when endpoint is available
    const response = await fetch('/api/v1/solar/assess', {
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
function generateDemoAssessment(request: SolarAssessmentRequest): SolarAssessmentResponse {
  const { telemetry, config } = request;
  
  const nameplateCapacity = config?.nameplate_capacity || 1000; // kW
  const prTarget = config?.performance_ratio_target || 0.80;
  const expectedIrradiance = config?.expected_irradiance || 800; // W/m²
  
  // Calculate performance ratio if not provided
  let performanceRatio = telemetry.performance_ratio;
  if (performanceRatio === undefined && telemetry.plant_power && telemetry.irradiance) {
    // Simplified PR calculation: actual / (irradiance/1000 * capacity)
    const expectedPower = (telemetry.irradiance / 1000) * nameplateCapacity;
    performanceRatio = expectedPower > 0 ? Math.min(1.0, telemetry.plant_power / expectedPower) : 0.8;
  }
  performanceRatio = performanceRatio || 0.85;
  
  // Determine statuses
  const inverterStatus = performanceRatio > (prTarget * 1.05) ? 'normal' :
                        performanceRatio > prTarget ? 'normal' :
                        performanceRatio > (prTarget * 0.90) ? 'warn' : 'alarm';
  const efficiencyStatus = performanceRatio > prTarget ? 'normal' :
                          performanceRatio > (prTarget * 0.90) ? 'warn' : 'alarm';
  
  // Check for temperature issues
  let tempIssue = false;
  if (telemetry.module_temp && telemetry.ambient_temp) {
    const tempDelta = telemetry.module_temp - telemetry.ambient_temp;
    if (tempDelta > 35 || telemetry.module_temp > 75) {
      tempIssue = true;
    }
  }
  
  // Map to S/Q/U/D
  // S: Stability based on consistent performance
  const S = performanceRatio > 0.85 ? 0.85 : performanceRatio > 0.75 ? 0.70 : 0.55;
  
  // Q: Quality based on performance ratio (lower PR = higher Q, meaning quality pressure)
  const Q = 1.0 - performanceRatio; // Inverted: lower PR means higher quality pressure
  // Normalize to reasonable range
  const Q_normalized = Math.max(0.1, Math.min(0.9, Q));
  
  // U: Susceptibility based on irradiance and temperature
  const irradianceFactor = telemetry.irradiance ? Math.min(1.0, telemetry.irradiance / 1000) : 0.7;
  const tempFactor = telemetry.module_temp ? Math.min(1.0, telemetry.module_temp / 80) : 0.5;
  const U = (irradianceFactor * 0.5 + tempFactor * 0.5);
  
  // D: Diagnostic (CHADD formula)
  const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q_normalized + 0.01) - 0.4 * U)));
  
  const health = Math.round((1 - D) * 100);
  
  // Calculate plant metrics
  const actualGeneration = telemetry.plant_power || (telemetry.inverter_power ? telemetry.inverter_power * (config?.inverter_count || 10) : nameplateCapacity * 0.7);
  const expectedGeneration = telemetry.irradiance ? (telemetry.irradiance / 1000) * nameplateCapacity : nameplateCapacity * 0.8;
  const efficiency = expectedGeneration > 0 ? (actualGeneration / expectedGeneration) * 100 : 85;
  const availability = performanceRatio > 0.75 ? 95 : performanceRatio > 0.65 ? 85 : 75;
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (performanceRatio < prTarget) {
    recommendations.push(`Performance ratio (${(performanceRatio * 100).toFixed(1)}%) below target (${(prTarget * 100).toFixed(1)}%) - investigate inverter efficiency and module condition`);
  } else if (performanceRatio > (prTarget * 1.05)) {
    recommendations.push(`Excellent performance ratio (${(performanceRatio * 100).toFixed(1)}%) - maintain current operations`);
  }
  
  if (tempIssue && telemetry.module_temp) {
    recommendations.push(`High module temperature (${telemetry.module_temp.toFixed(1)}°C) - check cooling and ventilation`);
  }
  
  if (telemetry.irradiance && telemetry.irradiance < expectedIrradiance * 0.5) {
    recommendations.push(`Low irradiance (${telemetry.irradiance.toFixed(0)} W/m²) - verify weather conditions and shading`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Plant operating within normal parameters');
  }
  
  return {
    squd_score: { S, Q: Q_normalized, U, D },
    health,
    performance_ratio: performanceRatio,
    inverter_health_status: inverterStatus,
    plant_efficiency_status: efficiencyStatus,
    recommendations,
    component_health: {
      inverter_efficiency: inverterStatus === 'normal' ? 90 : inverterStatus === 'warn' ? 70 : 50,
      module_condition: performanceRatio > 0.85 ? 90 : performanceRatio > 0.75 ? 75 : 60,
      thermal_management: tempIssue ? 60 : 90,
      overall_performance: efficiencyStatus === 'normal' ? 90 : efficiencyStatus === 'warn' ? 75 : 55,
    },
    plant_metrics: {
      expected_generation: expectedGeneration,
      actual_generation: actualGeneration,
      efficiency: efficiency,
      availability: availability,
    },
  };
}

