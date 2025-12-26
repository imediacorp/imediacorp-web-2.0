/**
 * Wind SCADA API Client
 */

import type { WindAssessmentRequest, WindAssessmentResponse } from '@/types/wind';

/**
 * Wind SCADA API methods
 */
export const windApi = {
  /**
   * Assess wind plant health
   */
  async assessPlant(request: WindAssessmentRequest): Promise<WindAssessmentResponse> {
    // For now, simulate the response until backend API is available
    // TODO: Replace with actual API call when endpoint is available
    const response = await fetch('/api/v1/wind/assess', {
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
function generateDemoAssessment(request: WindAssessmentRequest): WindAssessmentResponse {
  const { telemetry, config } = request;
  
  const ratedWindSpeed = config?.rated_wind_speed || 12.0; // m/s
  const cutInWindSpeed = config?.cut_in_wind_speed || 3.0; // m/s
  const cutOutWindSpeed = config?.cut_out_wind_speed || 22.0; // m/s
  const nameplateCapacity = config?.nameplate_capacity || 2000; // kW
  const turbineCount = config?.turbine_count || 10;
  
  const windSpeed = telemetry.wind_speed || 8.5; // m/s
  
  // Calculate expected generation based on wind speed
  let expectedPower = 0;
  if (windSpeed >= cutInWindSpeed && windSpeed <= cutOutWindSpeed) {
    if (windSpeed < ratedWindSpeed) {
      // Power curve: cubic relationship up to rated wind speed
      const powerRatio = Math.pow((windSpeed - cutInWindSpeed) / (ratedWindSpeed - cutInWindSpeed), 3);
      expectedPower = powerRatio * nameplateCapacity;
    } else {
      // At or above rated wind speed, output is constant
      expectedPower = nameplateCapacity;
    }
  }
  
  const actualPower = telemetry.plant_power || (telemetry.turbine_power ? telemetry.turbine_power * turbineCount : expectedPower * 0.85);
  const capacityFactor = (actualPower / nameplateCapacity) * 100;
  const availability = telemetry.availability || (capacityFactor > 20 ? 95 : 85);
  
  // Determine statuses
  const turbineStatus = availability > 95 && capacityFactor > 25 ? 'normal' :
                       availability > 90 && capacityFactor > 15 ? 'warn' : 'alarm';
  
  // Check drivetrain health (temperature and vibration)
  const nacelleTemp = telemetry.nacelle_temp || 45;
  const gearboxTemp = telemetry.gearbox_temp || 65;
  const vibration = telemetry.vibration || 3.5;
  
  let drivetrainStatus: 'normal' | 'warn' | 'alarm' = 'normal';
  if (gearboxTemp > 80 || nacelleTemp > 60 || vibration > 8.0) {
    drivetrainStatus = 'alarm';
  } else if (gearboxTemp > 70 || nacelleTemp > 55 || vibration > 5.0) {
    drivetrainStatus = 'warn';
  }
  
  const availabilityStatus = availability > 95 ? 'normal' :
                            availability > 90 ? 'warn' : 'alarm';
  
  // Map to S/Q/U/D (based on Wind SCADA mapping from Purpose Statement)
  // S: Stability based on availability/curtailment compliance
  // From Purpose Statement: "S (support/stability): availability/curtailment compliance (placeholder neutral S=1.0 until status codes wired)"
  const S = availability > 95 ? 0.85 : availability > 90 ? 0.70 : 0.55;
  
  // Q: Coherence/Quality Pressure based on resource/load (wind speed normalized by high percentile)
  // From Purpose Statement: "Q (resource/load): hub-height wind speed (or proxy) normalized by high percentile"
  // Higher wind speed (resource) = lower Q (quality pressure)
  const windSpeedNormalized = Math.min(1.0, windSpeed / 15.0); // Normalize by high percentile (~15 m/s)
  const Q = 1.0 - windSpeedNormalized; // Inverted: more resource = less quality pressure
  const Q_normalized = Math.max(0.1, Math.min(0.9, Q));
  
  // U: Susceptibility/Effort based on drivetrain thermal and vibration
  // From Purpose Statement: "U (stress/urgency): drivetrain thermal (nacelle/gearbox temp) and/or vibration"
  const tempFactor = Math.max(
    nacelleTemp / 70,
    gearboxTemp / 90
  );
  const vibFactor = vibration / 10.0;
  const U = Math.min(1.0, (tempFactor * 0.6 + vibFactor * 0.4));
  
  // D: Diagnostic (CHADD formula)
  const D = 1 / (1 + Math.exp(-(0.5 * S + 0.3 * Math.log(Q_normalized + 0.01) - 0.4 * U)));
  
  const health = Math.round((1 - D) * 100);
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (availability < 90) {
    recommendations.push(`Availability below target (${availability.toFixed(1)}%) - investigate turbine downtime and curtailment`);
  }
  
  if (drivetrainStatus === 'alarm') {
    if (gearboxTemp > 80) {
      recommendations.push(`Critical gearbox temperature (${gearboxTemp.toFixed(1)}°C) - immediate inspection required`);
    }
    if (vibration > 8.0) {
      recommendations.push(`High vibration levels (${vibration.toFixed(1)} mm/s) - potential bearing or drivetrain issues`);
    }
  } else if (drivetrainStatus === 'warn') {
    recommendations.push(`Drivetrain parameters approaching limits - monitor closely`);
  }
  
  if (windSpeed < cutInWindSpeed) {
    recommendations.push(`Wind speed below cut-in (${windSpeed.toFixed(1)} m/s) - normal low wind conditions`);
  } else if (windSpeed > cutOutWindSpeed) {
    recommendations.push(`Wind speed above cut-out (${windSpeed.toFixed(1)} m/s) - turbines shut down for protection`);
  }
  
  if (capacityFactor < 20) {
    recommendations.push(`Low capacity factor (${capacityFactor.toFixed(1)}%) - check wind resource and turbine performance`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Plant operating within normal parameters');
  }
  
  return {
    squd_score: { S, Q: Q_normalized, U, D },
    health,
    turbine_health_status: turbineStatus,
    drivetrain_health_status: drivetrainStatus,
    availability_status: availabilityStatus,
    recommendations,
    component_health: {
      turbine_availability: availabilityStatus === 'normal' ? 90 : availabilityStatus === 'warn' ? 75 : 60,
      drivetrain_condition: drivetrainStatus === 'normal' ? 90 : drivetrainStatus === 'warn' ? 70 : 50,
      gearbox_health: gearboxTemp < 70 ? 90 : gearboxTemp < 80 ? 70 : 50,
      nacelle_health: nacelleTemp < 55 ? 90 : nacelleTemp < 60 ? 75 : 60,
      vibration_health: vibration < 5 ? 90 : vibration < 8 ? 70 : 50,
    },
    plant_metrics: {
      expected_generation: expectedPower,
      actual_generation: actualPower,
      capacity_factor: capacityFactor,
      availability: availability,
      wind_speed_avg: windSpeed,
    },
  };
}


