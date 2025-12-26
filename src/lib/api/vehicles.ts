/**
 * Vehicle API Client
 * Methods for interacting with vehicle endpoints
 */

import { apiClient } from './client';
import {
  GasVehicleAssessmentRequest,
  GasVehicleAssessmentResponse,
  GasVehicleMetrics,
  GasVehicleDataSource,
  ElectricVehicleAssessmentRequest,
  ElectricVehicleAssessmentResponse,
  ElectricVehicleMetrics,
  ElectricVehicleDataSource,
} from '@/types/vehicles';
import { hantekApi } from './hantek';

// ============================================================================
// Gas Vehicle API
// ============================================================================

export const gasVehicleApi = {
  /**
   * Assess gas vehicle health
   */
  async assessVehicle(
    request: GasVehicleAssessmentRequest
  ): Promise<GasVehicleAssessmentResponse> {
    // Send telemetry and config in body, vehicle_id is in the path
    return apiClient.post<GasVehicleAssessmentResponse>(
      `/api/v1/vehicle/gas/vehicles/${request.vehicle_id}/assess`,
      {
        telemetry: request.telemetry,
        config: request.config,
      }
    );
  },

  /**
   * Get gas vehicle metrics (time-series)
   */
  async getMetrics(
    vehicleId: string,
    startTime?: string,
    endTime?: string
  ): Promise<GasVehicleMetrics> {
    const params: Record<string, string> = {};
    if (startTime) params.start_time = startTime;
    if (endTime) params.end_time = endTime;

    return apiClient.get<GasVehicleMetrics>(
      `/api/v1/vehicle/gas/vehicles/${vehicleId}/metrics`,
      params
    );
  },

  /**
   * Get engine status
   */
  async getEngineStatus(vehicleId: string) {
    return apiClient.get(`/api/v1/vehicle/gas/vehicles/${vehicleId}/engine`);
  },

  /**
   * Create gas vehicle
   */
  async createVehicle(data: { vehicle_id: string; metadata?: Record<string, unknown> }) {
    return apiClient.post(`/api/v1/vehicle/gas/vehicles`, data);
  },

  /**
   * Process data source and convert to telemetry
   */
  async processDataSource(
    dataSource: GasVehicleDataSource
  ): Promise<{ telemetry: Array<GasVehicleAssessmentRequest['telemetry']>; error?: string }> {
    if (dataSource.type === 'demo') {
      // Generate demo data
      return {
        telemetry: [this.generateDemoTelemetry()],
      };
    } else if (dataSource.type === 'hantek' && dataSource.hantek_data) {
      // Convert Hantek data to automotive signals
      const signals = hantekApi.mapToAutomotiveSignals(dataSource.hantek_data.records);
      const telemetryArray = hantekApi.convertToGasVehicleTelemetry(signals);
      return {
        telemetry: telemetryArray,
      };
    } else if (dataSource.type === 'csv' && dataSource.file) {
      // Process CSV file (would need backend API)
      try {
        const formData = new FormData();
        formData.append('file', dataSource.file);
        const response = await fetch('/api/v1/vehicle/gas/process-csv', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          return {
            telemetry: [],
            error: 'Failed to process CSV file',
          };
        }
        const data = await response.json();
        return {
          telemetry: data.telemetry || [],
        };
      } catch (error) {
        return {
          telemetry: [],
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return {
      telemetry: [],
      error: 'Invalid data source',
    };
  },

  /**
   * Generate demo telemetry data
   */
  generateDemoTelemetry(): GasVehicleAssessmentRequest['telemetry'] {
    return {
      engine_rpm: 2500 + Math.random() * 500,
      coolant_temp: 85 + Math.random() * 10,
      throttle_position: 40 + Math.random() * 20,
      maf: 30 + Math.random() * 10,
      o2_sensor_1: 1.0 + (Math.random() - 0.5) * 0.1,
      timing_advance: 15 + Math.random() * 5,
      vehicle_speed: 60 + Math.random() * 20,
      intake_temp: 30 + Math.random() * 5,
      oil_pressure: 40 + Math.random() * 10,
      vibration: 2 + Math.random(),
      dtc_count: 0,
    };
  },
};

// ============================================================================
// Electric Vehicle API
// ============================================================================

export const electricVehicleApi = {
  /**
   * Assess electric vehicle health
   */
  async assessVehicle(
    request: ElectricVehicleAssessmentRequest
  ): Promise<ElectricVehicleAssessmentResponse> {
    return apiClient.post<ElectricVehicleAssessmentResponse>(
      `/api/v1/vehicle/electric/vehicles/${request.vehicle_id}/assess`,
      request
    );
  },

  /**
   * Get electric vehicle metrics (time-series)
   */
  async getMetrics(
    vehicleId: string,
    startTime?: string,
    endTime?: string
  ): Promise<ElectricVehicleMetrics> {
    const params: Record<string, string> = {};
    if (startTime) params.start_time = startTime;
    if (endTime) params.end_time = endTime;

    return apiClient.get<ElectricVehicleMetrics>(
      `/api/v1/vehicle/electric/vehicles/${vehicleId}/metrics`,
      params
    );
  },

  /**
   * Get battery status
   */
  async getBatteryStatus(vehicleId: string) {
    return apiClient.get(`/api/v1/vehicle/electric/vehicles/${vehicleId}/battery`);
  },

  /**
   * Create electric vehicle
   */
  async createVehicle(data: { vehicle_id: string; metadata?: Record<string, unknown> }) {
    return apiClient.post(`/api/v1/vehicle/electric/vehicles`, data);
  },

  /**
   * Process data source and convert to telemetry
   */
  async processDataSource(
    dataSource: ElectricVehicleDataSource
  ): Promise<{ telemetry: Array<ElectricVehicleAssessmentRequest['telemetry']>; error?: string }> {
    if (dataSource.type === 'demo') {
      return {
        telemetry: [this.generateDemoTelemetry()],
      };
    } else if (dataSource.type === 'hantek' && dataSource.hantek_data) {
      // Convert Hantek data for EV (similar mapping)
      const signals = hantekApi.mapToAutomotiveSignals(dataSource.hantek_data.records);
      // For EV, we can use battery voltage, motor signals, etc.
      const telemetryArray = signals.battery.map((voltage, i) => ({
        battery_soc: Math.max(20, Math.min(100, 80 - (i / signals.battery.length) * 20)),
        battery_voltage: voltage,
        battery_temp: 25 + (voltage - 12.0) * 2,
        motor_temp: 35 + signals.ignition[i] * 2,
        power_kw: Math.abs(signals.maf[i] * 10),
        vehicle_speed: Math.abs(signals.crankshaft[i] - 2.5) * 50,
        motor_current: signals.maf[i] * 5,
        motor_voltage: voltage + 5,
        motor_speed: Math.abs(signals.crankshaft[i] - 2.5) * 2000,
        torque: signals.throttle[i] * 100,
      }));
      return {
        telemetry: telemetryArray,
      };
    } else if (dataSource.type === 'csv' && dataSource.file) {
      try {
        const formData = new FormData();
        formData.append('file', dataSource.file);
        const response = await fetch('/api/v1/vehicle/electric/process-csv', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          return {
            telemetry: [],
            error: 'Failed to process CSV file',
          };
        }
        const data = await response.json();
        return {
          telemetry: data.telemetry || [],
        };
      } catch (error) {
        return {
          telemetry: [],
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return {
      telemetry: [],
      error: 'Invalid data source',
    };
  },

  /**
   * Generate demo telemetry data
   */
  generateDemoTelemetry(): ElectricVehicleAssessmentRequest['telemetry'] {
    return {
      battery_soc: 75 + Math.random() * 10,
      battery_temp: 30 + Math.random() * 5,
      motor_temp: 45 + Math.random() * 10,
      power_kw: 40 + Math.random() * 20,
      vehicle_speed: 60 + Math.random() * 20,
      battery_voltage: 400 + Math.random() * 20,
      battery_current: 100 + Math.random() * 30,
      motor_current: 100 + Math.random() * 20,
      motor_voltage: 405 + Math.random() * 15,
      motor_speed: 3000 + Math.random() * 500,
      torque: 140 + Math.random() * 20,
    };
  },
};

