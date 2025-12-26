/**
 * Grid/Substation API Client
 */

import type { GridAssessmentRequest, GridAssessmentResponse } from '@/types/grid';

/**
 * Grid/Substation API methods
 */
export const gridApi = {
  /**
   * Assess grid/substation health
   */
  async assessSubstation(request: GridAssessmentRequest): Promise<GridAssessmentResponse> {
    // For now, simulate the response until backend API is available
    // TODO: Replace with actual API call when endpoint is available
    const response = await fetch('/api/v1/grid/assess', {
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
function generateDemoAssessment(request: GridAssessmentRequest): GridAssessmentResponse {
  const { telemetry } = request;
  
  // Defaults
  const voltageNominal = request.config?.voltage_nominal || 13.8; // kV
  const voltageTolerance = request.config?.voltage_tolerance || 5.0; // %
  const frequencyNominal = request.config?.frequency_nominal || 60.0; // Hz
  const frequencyTolerance = request.config?.frequency_tolerance || 0.1; // %
  const transformerTempMax = request.config?.transformer_temp_max || 85.0; // °C
  
  // Calculate deviations
  const voltageDeviation = Math.abs((telemetry.voltage - voltageNominal) / voltageNominal * 100);
  const frequencyDeviation = Math.abs(telemetry.frequency - frequencyNominal);
  
  // Determine statuses
  const voltageStatus = voltageDeviation > (voltageTolerance * 1.5) ? 'alarm' :
                       voltageDeviation > voltageTolerance ? 'warn' : 'normal';
  const frequencyStatus = frequencyDeviation > (frequencyTolerance * 3) ? 'alarm' :
                         frequencyDeviation > (frequencyTolerance * 1.5) ? 'warn' : 'normal';
  
  // Power quality status (combines voltage and frequency)
  const powerQualityStatus = (voltageStatus === 'alarm' || frequencyStatus === 'alarm') ? 'alarm' :
                            (voltageStatus === 'warn' || frequencyStatus === 'warn') ? 'warn' : 'normal';
  
  // Check for transformer overheating
  let transformerStatus: 'normal' | 'warn' | 'alarm' = 'normal';
  if (telemetry.transformer_temp) {
    if (telemetry.transformer_temp >= transformerTempMax) {
      transformerStatus = 'alarm';
    } else if (telemetry.transformer_temp >= (transformerTempMax - 10)) {
      transformerStatus = 'warn';
    }
  }
  
  // Map to S/Q/U/D
  // S: Stability based on voltage/frequency compliance
  const S = (voltageStatus === 'normal' && frequencyStatus === 'normal') ? 0.85 :
           (voltageStatus === 'warn' || frequencyStatus === 'warn') ? 0.65 : 0.45;
  
  // Q: Quality based on power quality index
  const powerQualityIndex = 100 - Math.min(100, (voltageDeviation * 2 + frequencyDeviation * 50));
  const Q = powerQualityIndex > 95 ? 0.25 : powerQualityIndex > 90 ? 0.45 : 0.65;
  
  // U: Susceptibility based on load and transformer temp
  const loadFactor = telemetry.power_flow ? Math.min(1.0, telemetry.power_flow / 100) : 0.5;
  const tempFactor = telemetry.transformer_temp ? Math.min(1.0, telemetry.transformer_temp / transformerTempMax) : 0.5;
  const U = (loadFactor * 0.6 + tempFactor * 0.4);
  
  // D: Diagnostic (CHADD formula)
  const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q + 0.01) - 0.4 * U)));
  
  const health = Math.round((1 - D) * 100);
  
  // Check for outage (simplified - voltage or frequency completely out of range)
  const outageDetected = voltageDeviation > (voltageTolerance * 3) || frequencyDeviation > (frequencyTolerance * 5);
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (voltageStatus === 'alarm') {
    recommendations.push(`Critical voltage deviation detected (${voltageDeviation.toFixed(2)}% from nominal) - immediate action required`);
  } else if (voltageStatus === 'warn') {
    recommendations.push(`Voltage approaching limits (${voltageDeviation.toFixed(2)}% deviation) - monitor closely`);
  }
  
  if (frequencyStatus === 'alarm') {
    recommendations.push(`Critical frequency deviation detected (${frequencyDeviation.toFixed(3)} Hz from nominal) - grid stability at risk`);
  } else if (frequencyStatus === 'warn') {
    recommendations.push(`Frequency deviation detected (${frequencyDeviation.toFixed(3)} Hz) - monitor grid load`);
  }
  
  if (transformerStatus === 'alarm' && telemetry.transformer_temp) {
    recommendations.push(`Transformer overheating (${telemetry.transformer_temp.toFixed(1)}°C) - immediate cooling check required`);
  } else if (transformerStatus === 'warn' && telemetry.transformer_temp) {
    recommendations.push(`Transformer temperature elevated (${telemetry.transformer_temp.toFixed(1)}°C) - monitor cooling system`);
  }
  
  if (outageDetected) {
    recommendations.push('Potential outage condition detected - initiate emergency procedures');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All grid parameters within normal operating ranges');
  }
  
  return {
    squd_score: { S, Q, U, D },
    health,
    voltage_status: voltageStatus,
    frequency_status: frequencyStatus,
    power_quality_status: powerQualityStatus,
    outage_detected: outageDetected,
    recommendations,
    component_health: {
      voltage_regulation: voltageStatus === 'normal' ? 90 : voltageStatus === 'warn' ? 70 : 50,
      frequency_control: frequencyStatus === 'normal' ? 90 : frequencyStatus === 'warn' ? 70 : 50,
      transformer: transformerStatus === 'normal' ? 90 : transformerStatus === 'warn' ? 70 : 50,
      power_quality: powerQualityStatus === 'normal' ? 90 : powerQualityStatus === 'warn' ? 70 : 50,
    },
    grid_metrics: {
      voltage_deviation: voltageDeviation,
      frequency_deviation: frequencyDeviation,
      power_quality_index: powerQualityIndex,
    },
  };
}

